import { type NextRequest, NextResponse } from "next/server.js"
import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"
import { Anthropic } from "@anthropic-ai/sdk"

// Cache for MCP client connection
let mcpClient: Client | null = null

// Initialize MCP client
async function getMcpClient(): Promise<Client> {
  if (mcpClient) {
    return mcpClient
  }

  mcpClient = new Client(
    {
      name: "web-chatbot",
      version: "1.0.0"
    },
    { capabilities: { sampling: {} } }
  )

  const transport = new StdioClientTransport({
    command: "tsx",
    args: ["src/server.ts"],
    stderr: "ignore",
  })

  await mcpClient.connect(transport)

  return mcpClient
}

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      )
    }

    const mcp = await getMcpClient()
    
    // Get available resources and tools
    const [{ resources }, { tools }] = await Promise.all([
      mcp.listResources(),
      mcp.listTools(),
    ])

    // Convert MCP tools to Anthropic tools format
    const anthropicTools = tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.inputSchema
    }))

    // Prepare context for Claude
    const systemContext = `You are a helpful assistant with access to a database and various tools.
You can directly use tools to help the user with their requests.

Available resources:
${resources.map(r => `- ${r.name}: ${r.description}`).join('\n')}

Available tools:
${tools.map(t => `- ${t.name}: ${t.description}`).join('\n')}

When the user requests:
- To get a user/patient by ID, use the "get-user-by-id" tool with the userId parameter
- To create a random patient with complete health data (including demographics, medical conditions, allergies, medications, HIV status, emergency contact), use the "create-random-user" tool. This tool will use AI to generate realistic patient data with all required fields.
- To create a patient manually, use the "create-user" tool. 
  CRITICAL: The database expects patients with comprehensive health information. When creating a patient, you MUST include health data:
  * Required fields: name, email, address, phone
  * Health fields that should be included: dateOfBirth, gender, bloodType, hivStatus, medicalConditions (array), allergies (array), medications (array), emergencyContact (object with name, relationship, phone), lastVisit, nextAppointment
  * If the user doesn't specify health information, you should generate realistic health data yourself (blood type, common medical conditions, etc.) rather than leaving fields empty
  * Always create complete patient records with health information - this is a healthcare system, not just a contact list
- To generate a report about patients or appointments, use the "generate-report" tool
- Reports can be generated as: summary (default), detailed, patients, or appointments
- Example: "Generate a report" or "Show me a detailed report about patients" or "Create a report about appointments"

MEDICAL REPORT GENERATION:
- To generate a detailed medical report for a specific patient, use "generate-patient-medical-report" tool
- Provide the patient ID and optionally the format (detailed, summary, or clinical-notes)
- Example: "Generate a medical report for patient ID 1" or "Create a clinical summary for patient 3"
- These reports include gender-specific health considerations, HIV status management, and condition-specific clinical notes
- Reports are professional medical documents suitable for clinical use

PATIENT RESOURCES:
- Access patient medical reports via "patients://{patientId}/medical-report" resource
- Filter patients by health criteria using "patients://filter/{filterType}/{filterValue}"
  - Filter types: hiv-status, gender, medical-condition, blood-type
  - Example: "patients://filter/hiv-status/Positive" to get all HIV-positive patients

IMPORTANT: When the user wants to SAVE a report to the database:
- ALWAYS ask for explicit confirmation before using the "save-report" tool
- The user must confirm they want to save the report
- Use the save-report tool with confirmSave: true only after getting user confirmation
- Example: "Would you like to save this report to the database?" and wait for confirmation before saving
- If the user says "yes", "save it", "confirm", etc., then use save-report with confirmSave: true`

    // Initialize Anthropic client
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      )
    }

    const anthropic = new Anthropic({ apiKey })

    // Build conversation history or start fresh
    const messages: any[] = conversationHistory || []
    messages.push({ role: "user", content: message })

    let finalResponse = ""
    let responseContent: any[] = []

    // Handle tool calls in a loop
    while (true) {
      const response = await anthropic.messages.create({
        model: "claude-sonnet-4-20250514",
        max_tokens: 2048,
        system: systemContext,
        tools: anthropicTools,
        messages,
      })

      for (const content of response.content) {
        if (content.type === "text") {
          finalResponse += content.text + "\n"
        } else if (content.type === "tool_use") {
          // Execute tool call
          try {
            const toolResult = await mcp.callTool({
              name: content.name,
              arguments: content.input as Record<string, unknown>,
            })
            
            const resultText = (toolResult.content as any)[0]?.type === "text" 
              ? (toolResult.content as any)[0].text 
              : JSON.stringify(toolResult.content)
            
            // Add tool call and result to conversation
            messages.push({ role: "assistant", content: [content] })
            messages.push({ 
              role: "user", 
              content: [{ 
                type: "tool_result", 
                tool_use_id: content.id, 
                content: resultText 
              }] 
            })
            
            responseContent.push({ type: "tool_use", name: content.name, result: resultText })
          } catch (error) {
            console.error(`[Chatbot] Error executing tool ${content.name}:`, error)
            messages.push({ role: "assistant", content: [content] })
            messages.push({ 
              role: "user", 
              content: [{ 
                type: "tool_result", 
                tool_use_id: content.id, 
                content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
              }] 
            })
          }
        }
      }

      // If Claude stopped for a reason other than tool use, we're done
      if (response.stop_reason !== "tool_use") {
        break
      }
    }

    return NextResponse.json({
      response: finalResponse.trim() || "I apologize, but I couldn't generate a response.",
      resources: resources.map(r => ({ name: r.name, description: r.description })),
      tools: tools.map(t => ({ name: t.name, description: t.description })),
      toolCalls: responseContent,
    })
  } catch (error) {
    console.error("[Chatbot] Error:", error)
    return NextResponse.json(
      { error: "Failed to process message" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const mcp = await getMcpClient()
    const [{ resources }, { tools }, { prompts }] = await Promise.all([
      mcp.listResources(),
      mcp.listTools(),
      mcp.listPrompts(),
    ])

    return NextResponse.json({
      resources: resources.map(r => ({ name: r.name, description: r.description })),
      tools: tools.map(t => ({ name: t.name, description: t.description })),
      prompts: prompts.map(p => ({ name: p.name, description: p.description })),
    })
  } catch (error) {
    console.error("[Chatbot] Error fetching capabilities:", error)
    return NextResponse.json({ error: "Failed to fetch capabilities" }, { status: 500 })
  }
}

