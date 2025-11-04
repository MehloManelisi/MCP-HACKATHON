import { NextRequest, NextResponse } from "next/server"
import { readFile, writeFile } from "node:fs/promises"
import { resolve } from "node:path"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    if (!body.name || !body.email || !body.address || !body.phone) {
      return NextResponse.json(
        { error: "Missing required fields: name, email, address, phone" },
        { status: 400 }
      )
    }

    // Read current users
    const usersPath = resolve(process.cwd(), "src", "data", "users.json")
    const usersData = await readFile(usersPath, "utf-8")
    const users = JSON.parse(usersData)

    // Generate new ID (highest ID + 1)
    const maxId = users.length > 0 ? Math.max(...users.map((u: any) => u.id)) : 0
    const newId = maxId + 1

    // Create new user object
    const newUser: any = {
      id: newId,
      name: body.name,
      email: body.email,
      address: body.address,
      phone: body.phone,
    }

    // Add optional fields if provided
    if (body.dateOfBirth) newUser.dateOfBirth = body.dateOfBirth
    if (body.gender) newUser.gender = body.gender
    if (body.bloodType) newUser.bloodType = body.bloodType
    if (body.hivStatus) newUser.hivStatus = body.hivStatus
    
    // Handle arrays - convert comma-separated strings to arrays
    if (body.medicalConditions) {
      const conditions = Array.isArray(body.medicalConditions)
        ? body.medicalConditions
        : typeof body.medicalConditions === 'string' && body.medicalConditions.trim()
          ? body.medicalConditions.split(",").map((c: string) => c.trim()).filter((c: string) => c)
          : []
      if (conditions.length > 0) {
        newUser.medicalConditions = conditions
      }
    }
    
    if (body.allergies) {
      const allergies = Array.isArray(body.allergies)
        ? body.allergies
        : typeof body.allergies === 'string' && body.allergies.trim()
          ? body.allergies.split(",").map((a: string) => a.trim()).filter((a: string) => a)
          : []
      if (allergies.length > 0) {
        newUser.allergies = allergies
      }
    }
    
    if (body.medications) {
      const medications = Array.isArray(body.medications)
        ? body.medications
        : typeof body.medications === 'string' && body.medications.trim()
          ? body.medications.split(",").map((m: string) => m.trim()).filter((m: string) => m)
          : []
      if (medications.length > 0) {
        newUser.medications = medications
      }
    }

    // Add emergency contact if provided
    if (body.emergencyContact && body.emergencyContact.name) {
      newUser.emergencyContact = {
        name: body.emergencyContact.name,
        relationship: body.emergencyContact.relationship || "Friend",
        phone: body.emergencyContact.phone || "",
      }
    }

    if (body.lastVisit) newUser.lastVisit = body.lastVisit
    if (body.nextAppointment) newUser.nextAppointment = body.nextAppointment

    // Add new user to array
    users.push(newUser)

    // Write back to file
    await writeFile(usersPath, JSON.stringify(users, null, 2), "utf-8")

    return NextResponse.json({
      success: true,
      message: "Patient created successfully",
      patientId: newId,
      patient: newUser,
    })
  } catch (error) {
    console.error("Error creating patient:", error)
    return NextResponse.json(
      { error: "Failed to create patient", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}
