import { Client } from "@modelcontextprotocol/sdk/client/index.js"
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js"
import { input, select } from "@inquirer/prompts"
import { Prompt, PromptMessage, Tool } from "@modelcontextprotocol/sdk/types.js"
import { Anthropic } from "@anthropic-ai/sdk"
import dotenv from "dotenv"
import { resolve } from "node:path"

// Load environment variables from .env.local
dotenv.config({ path: resolve(process.cwd(), ".env.local") })

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
if (!ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not set in .env.local")
}

const anthropic = new Anthropic({
    apiKey: ANTHROPIC_API_KEY,
})

const mcp = new Client(
    {
        name: "text-client-video", version: "1.0.0"
    },

    { capabilities: { sampling: {} } }

)

const transport = new StdioClientTransport({
    command: "tsx",
    args: ["src/server.ts"],
    stderr: "ignore",
})

async function main() {
    await mcp.connect(transport)
    const [{ tools }, { prompts }, { resources }, { resourceTemplates }] = await Promise.all([
        mcp.listTools(),
        mcp.listPrompts(),
        mcp.listResources(),
        mcp.listResourceTemplates(),
    ])
    console.log("You are connected")
    while (true) {
        const option = await select({
            message: "what would you like to do?",
            choices: ["Query", "Tools", "Resources", "Prompts"]
        })
        switch (option) {
            case "Tools":
                const toolName = await select({
                    message: "Select a tool",
                    choices: tools.map(tool => ({
                        name: tool.annotations?.title ?? tool.name,
                        value: tool.name,
                        description: tool.description,
                    }))
                })
                const tool = tools.find(tool => tool.name === toolName)
                if (tool == null) {
                    console.error("Tool not found.")
                } else {
                    await handleTool(tool)
                }
                break
            case "Resources":
                const resourceUri = await select({
                    message: "Select a resource",
                    choices: [
                        ...resources.map(resource => ({
                            name: resource.name,
                            value: resource.uri,
                            description: resource.description,
                        })),
                        ...resourceTemplates.map(template => ({
                            name: template.name,
                            value: template.uriTemplate,
                            description: template.description,
                        })),
                    ],
                })
                const uri = resources.find(r => r.uri === resourceUri)?.uri ?? resourceTemplates.find(t => t.uriTemplate === resourceUri)?.uriTemplate
                if (uri == null) {
                    console.error("Tool not found.")
                } else {
                    await handleResource(uri)
                }
                break
            case "Prompts":
                const promptName = await select({
                    message: "Select a prompt",
                    choices: prompts.map(prompt => ({
                        name: prompt.name,
                        value: prompt.name,
                    })),
                })
                const prompt = prompts.find(p => p.name === promptName)
                if (prompt == null) {
                    console.error("Prompt not found.")
                } else {
                    await handlePrompt(prompt)
                }
                break
        }
    }
}

async function handleResource(uri: string) {
    let finalUri = uri
    const paramMatches = uri.match(/{([^}]+)}/g)
    if (paramMatches != null) {
        for (const paramMatch of paramMatches) {
            const paramName = paramMatch.replace("{", "").replace("}", "")
            const paramValue = await input({
                message: `Enter the value for ${paramName}`,
            })
            finalUri = finalUri.replace(paramMatch, paramValue)
        }
    }



    const res = await mcp.readResource({
        uri: finalUri
    })
    console.log(JSON.stringify(JSON.parse(res.contents[0].text as string), null, 2))
}

async function handleTool(tool: Tool) {
    const args: Record<string, string> = {}
    for (const [key, value] of Object.entries(tool.inputSchema.properties ?? {})) {
        args[key] = await input({
            message: `Enter the value for ${key} (${(value as { type: string }).type})`,
        })
    }
    const res = await mcp.callTool({
        name: tool.name,
        arguments: args,
    })

    console.log((res.content as [{ text: string }])[0].text)
}
async function handlePrompt(prompt: Prompt) {
    const args: Record<string, string> = {}
    for (const arg of prompt.arguments ?? []) {
        args[arg.name] = await input({
            message: `Enter the value for ${arg.name}:`,
        })
    }
    const response = await mcp.getPrompt({
        name: prompt.name,
        arguments: args,
    })

    for (const message of response.messages) {
        await handleServerMessagePrompt(message)
    }
}

async function handleServerMessagePrompt(message: PromptMessage) {
    if (message.content.type !== "text") {
        return
    }

    const promptText = message.content.text
    console.log("\n📝 Prompt received:")
    console.log(promptText)
    console.log("\n🤖 Generating response with Claude...\n")

    try {
        const response = await anthropic.messages.create({
            model: "claude-sonnet-4-5-20250929",
            max_tokens: 1024,
            messages: [
                {
                    role: "user",
                    content: promptText,
                },
            ],
        })

        if (response.content[0]?.type === "text") {
            console.log("Claude's response:")
            console.log(response.content[0].text)
        }
    } catch (error) {
        console.error("❌ Error generating response with Claude:", error)
    }
}


main() 