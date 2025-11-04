import { NextResponse } from "next/server"
import { readFile } from "node:fs/promises"
import { resolve } from "node:path"

export async function GET() {
  try {
    const reportsPath = resolve(process.cwd(), "src", "data", "reports.json")
    const fileContent = await readFile(reportsPath, "utf-8")
    const reports = JSON.parse(fileContent)

    // Sort by most recent first
    const sortedReports = reports.sort((a: any, b: any) => {
      return new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
    })

    return NextResponse.json(sortedReports)
  } catch (error) {
    // If file doesn't exist or is empty, return empty array
    if (error instanceof Error && (error as any).code === "ENOENT") {
      return NextResponse.json([])
    }
    console.error("Error reading reports:", error)
    return NextResponse.json({ error: "Failed to load reports" }, { status: 500 })
  }
}

