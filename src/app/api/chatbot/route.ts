import { type NextRequest, NextResponse } from "next/server"
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
    const { message } = await request.json()

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

    // Fetch relevant resources based on context
    const resourceData: Record<string, any> = {}
    
    // If user asks about users, load user data
    if (message.toLowerCase().includes('user')) {
      try {
        const usersRes = await mcp.readResource({ uri: "users://all" })
        const usersData = JSON.parse(usersRes.contents[0].text as string)
        resourceData.users = usersData
      } catch (error) {
        console.error("Error fetching users:", error)
      }
    }

    // Prepare context for Claude
    const systemContext = `You are a helpful assistant with access to a database and various tools.
Available resources:
${resources.map(r => `- ${r.name}: ${r.description}`).join('\n')}

Available tools:
${tools.map(t => `- ${t.name}: ${t.description}`).join('\n')}

${Object.keys(resourceData).length > 0 ? `\nCurrent data:\n${JSON.stringify(resourceData, null, 2)}` : ''}

Help the user with their questions and suggest tools/resources when relevant.`

    // Initialize Anthropic client
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "ANTHROPIC_API_KEY not configured" },
        { status: 500 }
      )
    }

    const anthropic = new Anthropic({ apiKey })

    // Call Claude with the MCP context
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 2048,
      system: systemContext,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    })

    const responseText = response.content[0]?.type === "text" 
      ? response.content[0].text 
      : "I apologize, but I couldn't generate a response."

    return NextResponse.json({
      response: responseText,
      resources: resources.map(r => ({ name: r.name, description: r.description })),
      tools: tools.map(t => ({ name: t.name, description: t.description })),
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

