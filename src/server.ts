import { McpServer, ResourceTemplate } from "@modelcontextprotocol/sdk/server/mcp.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { z } from "zod"
import fs from "node:fs/promises"
import { resolve } from "node:path"
import { CreateMessageResultSchema } from "@modelcontextprotocol/sdk/types.js"

// Helper functions to get statistics (duplicated here since server.ts doesn't have access to @ alias)
async function getTotalPatients(): Promise<number> {
    const users = await import("./data/users.json", {
        with: { type: "json" }
    }).then(m => m.default)
    return (users as any[]).length
}

async function getScheduledAppointments(): Promise<number> {
    // Import mock visits to calculate appointments
    const { mockVisits } = await import("./lib/mock-data.js")
    const recentVisits = mockVisits.filter((visit: any) => {
        const visitDate = new Date(visit.visit_date)
        const daysSince = (Date.now() - visitDate.getTime()) / (1000 * 60 * 60 * 24)
        return daysSince <= 30 && daysSince > 0
    })
    return Math.max(0, Math.floor(recentVisits.length / 3))
}

async function getVisitsToday(): Promise<number> {
    const { mockVisits } = await import("./lib/mock-data.js")
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const todayEnd = new Date(today)
    todayEnd.setHours(23, 59, 59, 999)
    
    return mockVisits.filter((visit: any) => {
        const visitDate = new Date(visit.visit_date)
        return visitDate >= today && visitDate <= todayEnd
    }).length
}

async function getActiveCases(): Promise<number> {
    const { mockVisits } = await import("./lib/mock-data.js")
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const activePatientIds = new Set(
        mockVisits
            .filter((visit: any) => {
                const visitDate = new Date(visit.visit_date)
                return visitDate >= thirtyDaysAgo
            })
            .map((visit: any) => visit.patient_id)
    )
    
    return activePatientIds.size
}

const server = new McpServer({
    name: "test",
    version: "1.0.0",
    capabilities: {
        resources: {},
        tools: {},
        prompts: {},
    }
})
server.resource(
    "users",
    "users://all",
    {
        description: "Get all users from the database",
        title: "Get all users",
        mimeType: "application/json",
    },
    async uri => {
        const users = await import("./data/users.json", {
            with: { type: "json" }
        }).then(m => m.default)


        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify(users),
                    mimeType: "application/json",
                }
            ],
        }
    }
)

server.resource("user-details", new ResourceTemplate("users://{userId}/profile", { list: undefined }), {
    description: "Get a user's details from the database",
    title: "User Details",
    mimeType: "application/json",
},
    async (uri, { userId }) => {
        const users = await import("./data/users.json", {
            with: { type: "json" }
        }).then(m => m.default)
        const user = users.find(u => u.id === parseInt(userId as string))
        if (user == null) {
            return {
                contents: [
                    {
                        uri: uri.href,
                        text: JSON.stringify({ error: "User not found" }),
                        mimeType: "application/json",
                    }
                ]
            }
        }
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify(user),
                    mimeType: "application/json",
                }
            ],
        }
    }
)

server.resource("patient-medical-report", new ResourceTemplate("patients://{patientId}/medical-report", { list: undefined }), {
    description: "Generate a comprehensive medical report for a specific patient based on their health data, gender, and medical conditions",
    title: "Patient Medical Report",
    mimeType: "application/json",
}, async (uri, { patientId }) => {
    try {
        const users = await import("./data/users.json", {
            with: { type: "json" }
        }).then(m => m.default)
        
        const patient = users.find((u: any) => u.id === parseInt(patientId as string))
        if (!patient) {
            return {
                contents: [
                    {
                        uri: uri.href,
                        text: JSON.stringify({ error: "Patient not found" }),
                        mimeType: "application/json",
                    }
                ]
            }
        }

        // Calculate age from date of birth
        const calculateAge = (dob: string) => {
            const birthDate = new Date(dob)
            const today = new Date()
            let age = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--
            }
            return age
        }

        const age = patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : null
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })

        // Generate gender-specific health considerations
        const genderConsiderations = patient.gender === "Female" 
            ? "Patient is female. Consider reproductive health screening, cervical cancer screening (if age-appropriate), and bone density monitoring for osteoporosis risk."
            : patient.gender === "Male"
            ? "Patient is male. Consider prostate health screening (if age-appropriate) and cardiovascular risk assessment."
            : ""

        // Generate HIV status-specific recommendations
        const hivRecommendations = patient.hivStatus?.includes("Positive")
            ? "CRITICAL: Patient is HIV-positive and on treatment. Monitor CD4 count, viral load, and adherence to antiretroviral therapy. Screen for opportunistic infections. Consider TB prophylaxis."
            : "Patient is HIV-negative. Continue routine HIV testing as per protocol."

        // Generate condition-specific clinical notes
        const conditionNotes = patient.medicalConditions?.map((condition: string) => {
            const notes: Record<string, string> = {
                "Hypertension": "Monitor blood pressure regularly. Assess cardiovascular risk factors. Consider lifestyle modifications including diet and exercise.",
                "Type 2 Diabetes": "Monitor HbA1c quarterly. Assess for diabetic complications including retinopathy, nephropathy, and neuropathy. Dietary counseling recommended.",
                "HIV/AIDS": "Monitor CD4 count and viral load. Assess adherence to ART. Screen for opportunistic infections. Regular follow-up essential.",
                "Asthma": "Assess asthma control. Review inhaler technique. Monitor for exacerbations. Consider asthma action plan.",
                "Tuberculosis (completed treatment)": "Patient has completed TB treatment. Monitor for recurrence. Continue regular follow-up.",
                "Chronic Kidney Disease Stage 3": "Monitor renal function (eGFR, creatinine). Assess for proteinuria. Consider nephrology referral if progression.",
                "Epilepsy": "Monitor seizure frequency. Assess medication compliance. Review antiepileptic drug levels if indicated.",
                "Hypothyroidism": "Monitor TSH levels. Assess medication compliance. Screen for symptoms of hypo/hyperthyroidism.",
                "Depression": "Assess mental health status. Monitor medication compliance. Consider therapy referral.",
                "Anemia": "Monitor hemoglobin levels. Assess for underlying cause. Consider iron studies.",
                "Hepatitis B": "Monitor liver function tests. Assess viral load. Consider antiviral therapy if indicated.",
                "Migraine": "Identify triggers. Assess frequency and severity. Consider preventive therapy if frequent.",
                "Anxiety": "Assess anxiety levels. Monitor medication compliance. Consider therapy referral.",
                "Diabetic Neuropathy": "Monitor for progression. Assess for foot complications. Consider pain management.",
                "Bronchial Asthma": "Assess asthma control in pediatric patient. Review inhaler technique with caregiver."
            }
            return notes[condition] || `Monitor ${condition}. Regular assessment recommended.`
        }).join("\n") || "No chronic conditions documented."

        // Generate medication review
        const medicationReview = patient.medications?.length 
            ? `Current Medications:\n${patient.medications.map((med: string) => `  • ${med}`).join("\n")}\n\nMedication Review:\n- Assess medication compliance and adherence\n- Review for drug interactions\n- Monitor for adverse effects\n- Consider medication reconciliation at each visit`
            : "No current medications documented."

        // Generate allergy alert
        const allergyAlert = patient.allergies?.length
            ? `⚠️ ALLERGY ALERT:\n${patient.allergies.map((allergy: string) => `  • ${allergy}`).join("\n")}\n\nIMPORTANT: Document allergies clearly in patient record. Avoid prescribing medications with known allergens.`
            : "No known allergies documented."

        // Generate comprehensive medical report
        const medicalReport = {
            patientId: patient.id,
            patientName: patient.name,
            generatedDate: new Date().toISOString(),
            reportDate: currentDate,
            report: `MEDICAL SUMMARY REPORT
AfyaLink Community Clinic
Report Generated: ${currentDate}

═══════════════════════════════════════════════════════════════

PATIENT DEMOGRAPHICS
───────────────────────────────────────────────────────────────
Name: ${patient.name}
Date of Birth: ${patient.dateOfBirth || "Not documented"}
Age: ${age ? `${age} years` : "Not calculated"}
Gender: ${patient.gender || "Not documented"}
Patient ID: ${patient.id}
Contact: ${patient.phone}
Email: ${patient.email}
Address: ${patient.address}

Emergency Contact:
${patient.emergencyContact ? `  Name: ${patient.emergencyContact.name}\n  Relationship: ${patient.emergencyContact.relationship}\n  Phone: ${patient.emergencyContact.phone}` : "  Not documented"}

═══════════════════════════════════════════════════════════════

VITAL HEALTH INFORMATION
───────────────────────────────────────────────────────────────
Blood Type: ${patient.bloodType || "Not documented"}
HIV Status: ${patient.hivStatus || "Not documented"}
${hivRecommendations}

═══════════════════════════════════════════════════════════════

MEDICAL CONDITIONS
───────────────────────────────────────────────────────────────
${patient.medicalConditions?.length ? patient.medicalConditions.map((cond: string) => `• ${cond}`).join("\n") : "No chronic conditions documented."}

Clinical Notes:
${conditionNotes}

${genderConsiderations}

═══════════════════════════════════════════════════════════════

${allergyAlert}

═══════════════════════════════════════════════════════════════

MEDICATION MANAGEMENT
───────────────────────────────────────────────────────────────
${medicationReview}

═══════════════════════════════════════════════════════════════

VISIT HISTORY
───────────────────────────────────────────────────────────────
Last Visit: ${patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not documented"}
Next Scheduled Appointment: ${patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not scheduled"}

═══════════════════════════════════════════════════════════════

CLINICAL ASSESSMENT & RECOMMENDATIONS
───────────────────────────────────────────────────────────────
${patient.hivStatus?.includes("Positive") ? "1. HIV MANAGEMENT: Continue ART monitoring. Assess CD4 count and viral load. Screen for opportunistic infections.\n" : ""}${patient.medicalConditions?.includes("Type 2 Diabetes") ? "2. DIABETES MANAGEMENT: Monitor glycemic control. Assess for complications. Provide dietary counseling.\n" : ""}${patient.medicalConditions?.includes("Hypertension") ? "3. HYPERTENSION MANAGEMENT: Monitor blood pressure. Assess cardiovascular risk. Lifestyle modifications.\n" : ""}${patient.medicalConditions?.some((c: string) => c.includes("Asthma") || c.includes("Epilepsy")) ? "4. CHRONIC CONDITION MONITORING: Regular follow-up appointments essential. Monitor disease control and medication compliance.\n" : ""}5. PREVENTIVE CARE: Continue routine health screenings as per age and gender-specific guidelines.
6. MEDICATION ADHERENCE: Assess and support patient adherence to prescribed medications.
7. LIFESTYLE COUNSELING: Provide guidance on diet, exercise, and health-promoting behaviors.

═══════════════════════════════════════════════════════════════

RISK ASSESSMENT
───────────────────────────────────────────────────────────────
${patient.hivStatus?.includes("Positive") ? "• HIGH RISK: HIV-positive status requires close monitoring and adherence support.\n" : ""}${patient.medicalConditions?.some((c: string) => c.includes("Diabetes") || c.includes("Hypertension")) ? "• MODERATE RISK: Cardiovascular and metabolic risk factors present. Regular monitoring required.\n" : ""}${patient.allergies?.length ? "• ALLERGY RISK: Documented allergies require careful medication selection.\n" : ""}• General health maintenance and preventive care recommended.

═══════════════════════════════════════════════════════════════

RECOMMENDATIONS FOR NEXT VISIT
───────────────────────────────────────────────────────────────
1. Review and update medication list
2. Assess control of chronic conditions
3. Monitor vital signs and perform physical examination
4. Review and update allergies if any changes
5. Provide health education and counseling
6. Schedule follow-up appointment as indicated

═══════════════════════════════════════════════════════════════

This report was generated by the AfyaLink Clinic Management System.
All patient information is confidential and protected by medical privacy regulations.

Report ID: MED-${patient.id}-${Date.now()}
Generated by: AfyaLink AI Medical Assistant
`
        }

        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify(medicalReport, null, 2),
                    mimeType: "application/json",
                }
            ],
        }
    } catch (error) {
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify({ error: `Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}` }),
                    mimeType: "application/json",
                }
            ],
        }
    }
})

server.resource("patients-by-health-status", new ResourceTemplate("patients://filter/{filterType}/{filterValue}", { list: undefined }), {
    description: "Get patients filtered by health status criteria (HIV status, gender, medical condition, blood type)",
    title: "Patients by Health Status",
    mimeType: "application/json",
}, async (uri, { filterType, filterValue }) => {
    try {
        const users = await import("./data/users.json", {
            with: { type: "json" }
        }).then(m => m.default)
        
        let filteredPatients: any[] = []
        
        switch (filterType) {
            case "hiv-status":
                filteredPatients = users.filter((u: any) => 
                    u.hivStatus?.toLowerCase().includes((filterValue as string).toLowerCase())
                )
                break
            case "gender":
                filteredPatients = users.filter((u: any) => 
                    u.gender?.toLowerCase() === (filterValue as string).toLowerCase()
                )
                break
            case "medical-condition":
                filteredPatients = users.filter((u: any) => 
                    u.medicalConditions?.some((c: string) => 
                        c.toLowerCase().includes((filterValue as string).toLowerCase())
                    )
                )
                break
            case "blood-type":
                filteredPatients = users.filter((u: any) => 
                    u.bloodType?.toLowerCase() === (filterValue as string).toLowerCase()
                )
                break
            default:
                return {
                    contents: [
                        {
                            uri: uri.href,
                            text: JSON.stringify({ error: "Invalid filter type. Use: hiv-status, gender, medical-condition, or blood-type" }),
                            mimeType: "application/json",
                        }
                    ]
                }
        }
        
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify({
                        filterType,
                        filterValue,
                        count: filteredPatients.length,
                        patients: filteredPatients
                    }, null, 2),
                    mimeType: "application/json",
                }
            ],
        }
    } catch (error) {
        return {
            contents: [
                {
                    uri: uri.href,
                    text: JSON.stringify({ error: `Failed to filter patients: ${error instanceof Error ? error.message : 'Unknown error'}` }),
                    mimeType: "application/json",
                }
            ],
        }
    }
})

server.tool("get-user-by-id", "Get a user's complete information by their ID", {
    userId: z.number().describe("The ID of the user to retrieve"),
}, {
    title: "Get User by ID",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
}, async (params) => {
    try {
        const { userId } = params
        
        const users = await import("./data/users.json", {
            with: { type: "json" }
        }).then(m => m.default)
        
        const user = users.find((u: any) => u.id === userId)
        
        if (!user) {
            return {
                content: [
                    { type: "text", text: `❌ User not found. User ID ${userId} does not exist in the database.` }
                ]
            }
        }
        
        // Format user information nicely
        const userInfo = `PATIENT INFORMATION
═══════════════════════════════════════════════════════════════

BASIC INFORMATION:
───────────────────────────────────────────────────────────────
Patient ID: ${user.id}
Name: ${user.name}
Email: ${user.email}
Phone: ${user.phone}
Address: ${user.address}

${user.dateOfBirth ? `Date of Birth: ${user.dateOfBirth}
Age: ${(() => {
    const birthDate = new Date(user.dateOfBirth)
    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--
    }
    return `${age} years`
})()}
Gender: ${user.gender || "Not documented"}` : ""}

${user.bloodType || user.hivStatus ? `HEALTH INFORMATION:
───────────────────────────────────────────────────────────────
${user.bloodType ? `Blood Type: ${user.bloodType}` : ""}
${user.hivStatus ? `HIV Status: ${user.hivStatus}` : ""}` : ""}

${user.medicalConditions?.length ? `MEDICAL CONDITIONS:
───────────────────────────────────────────────────────────────
${user.medicalConditions.map((cond: string) => `• ${cond}`).join("\n")}` : ""}

${user.allergies?.length ? `ALLERGIES:
───────────────────────────────────────────────────────────────
⚠️ ${user.allergies.map((allergy: string) => allergy).join("\n⚠️ ")}` : ""}

${user.medications?.length ? `CURRENT MEDICATIONS:
───────────────────────────────────────────────────────────────
${user.medications.map((med: string) => `• ${med}`).join("\n")}` : ""}

${user.emergencyContact ? `EMERGENCY CONTACT:
───────────────────────────────────────────────────────────────
Name: ${user.emergencyContact.name}
Relationship: ${user.emergencyContact.relationship}
Phone: ${user.emergencyContact.phone}` : ""}

${user.lastVisit || user.nextAppointment ? `VISIT INFORMATION:
───────────────────────────────────────────────────────────────
${user.lastVisit ? `Last Visit: ${new Date(user.lastVisit).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ""}
${user.nextAppointment ? `Next Appointment: ${new Date(user.nextAppointment).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ""}` : ""}

═══════════════════════════════════════════════════════════════`
        
        return {
            content: [
                { type: "text", text: userInfo }
            ]
        }
    } catch (error) {
        console.error("Error getting user by ID:", error)
        return {
            content: [
                { type: "text", text: `❌ Error retrieving user: ${error instanceof Error ? error.message : 'Unknown error'}` }
            ]
        }
    }
})

server.tool("create-user", "Create a new patient in the database with complete health information. All fields except name, email, address, and phone are optional, but should be provided when available.", {
    name: z.string().describe("Patient's full name"),
    email: z.string().describe("Patient's email address"),
    address: z.string().describe("Patient's full address"),
    phone: z.string().describe("Patient's phone number in +27 format"),
    dateOfBirth: z.string().optional().describe("Date of birth in YYYY-MM-DD format"),
    gender: z.enum(["Male", "Female"]).optional().describe("Patient's gender"),
    bloodType: z.enum(["O+", "O-", "A+", "A-", "B+", "B-", "AB+", "AB-"]).optional().describe("Patient's blood type"),
    hivStatus: z.string().optional().describe("HIV status: 'Negative', 'Positive', or 'Positive - On Treatment'"),
    medicalConditions: z.array(z.string()).optional().describe("Array of medical conditions (e.g., ['Hypertension', 'Diabetes'])"),
    allergies: z.array(z.string()).optional().describe("Array of allergies (e.g., ['Penicillin'] or ['None'])"),
    medications: z.array(z.string()).optional().describe("Array of medications with dosages (e.g., ['Metformin 500mg twice daily'])"),
    emergencyContact: z.object({
        name: z.string(),
        relationship: z.string(),
        phone: z.string()
    }).optional().describe("Emergency contact information"),
    lastVisit: z.string().optional().describe("Last visit date in YYYY-MM-DD format"),
    nextAppointment: z.string().optional().describe("Next appointment date in YYYY-MM-DD format"),
}, {
    title: "Create a new patient",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
}, async (params) => {
    try {
        const id = await createUser(params)
        
        // Format comprehensive response
        const responseText = `✅ PATIENT CREATED SUCCESSFULLY
═══════════════════════════════════════════════════════════════

BASIC INFORMATION:
───────────────────────────────────────────────────────────────
Patient ID: ${id}
Name: ${params.name}
Email: ${params.email}
Phone: ${params.phone}
Address: ${params.address}

${params.dateOfBirth ? `Date of Birth: ${params.dateOfBirth}
Gender: ${params.gender || 'Not specified'}` : ''}

${params.bloodType || params.hivStatus ? `HEALTH INFORMATION:
───────────────────────────────────────────────────────────────
${params.bloodType ? `Blood Type: ${params.bloodType}` : ''}
${params.hivStatus ? `HIV Status: ${params.hivStatus}` : ''}` : ''}

${params.medicalConditions && params.medicalConditions.length > 0 ? `MEDICAL CONDITIONS:
───────────────────────────────────────────────────────────────
${params.medicalConditions.map(cond => `• ${cond}`).join('\n')}` : ''}

${params.allergies && params.allergies.length > 0 ? `ALLERGIES:
───────────────────────────────────────────────────────────────
${params.allergies.filter(a => a !== 'None').length > 0 
  ? params.allergies.filter(a => a !== 'None').map(allergy => `⚠️ ${allergy}`).join('\n')
  : 'None'}` : ''}

${params.medications && params.medications.length > 0 ? `MEDICATIONS:
───────────────────────────────────────────────────────────────
${params.medications.map(med => `• ${med}`).join('\n')}` : ''}

${params.emergencyContact ? `EMERGENCY CONTACT:
───────────────────────────────────────────────────────────────
Name: ${params.emergencyContact.name}
Relationship: ${params.emergencyContact.relationship}
Phone: ${params.emergencyContact.phone}` : ''}

${params.lastVisit || params.nextAppointment ? `VISIT INFORMATION:
───────────────────────────────────────────────────────────────
${params.lastVisit ? `Last Visit: ${new Date(params.lastVisit).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
${params.nextAppointment ? `Next Appointment: ${new Date(params.nextAppointment).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}` : ''}

═══════════════════════════════════════════════════════════════
Patient has been saved to the database.`;
        
        return {
            content: [
                { type: "text", text: responseText }
            ]
        }
    } catch (error) {
        console.error("Error creating user:", error)
        return {
            content: [
                { type: "text", text: `Failed to save patient: ${error instanceof Error ? error.message : 'Unknown error'}` }
            ]
        }
    }
})

server.tool("create-random-user", "Generate a random patient with complete health data including demographics, medical conditions, allergies, medications, HIV status, and emergency contact. The AI will generate realistic patient data that matches the structure of users in the database.", {
    title: "Create Random Patient with Full Health Data",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: true,
  }, async () => {
    const res = await server.server.request(
      {
        method: "sampling/createMessage",
        params: {
          messages: [
            {
              role: "user",
              content: {
                type: "text",
                text: `You are a healthcare professional generating a realistic patient record for a South African clinic. Generate a COMPLETE patient record with ALL required fields. Return ONLY valid JSON with no markdown, no code blocks, no explanations - just the raw JSON object.

CRITICAL: You MUST include ALL of these fields in your JSON response:

{
  "name": "Full South African name (e.g., Thabo Mthembu, Lerato Ndlovu)",
  "email": "realistic email address",
  "address": "Full South African address (e.g., '123 Main Street, Johannesburg, Gauteng 2000')",
  "phone": "+27 XX XXX XXXX format",
  "dateOfBirth": "YYYY-MM-DD (choose a realistic birth date between 1950 and 2010)",
  "gender": "Male" or "Female",
  "bloodType": "O+", "O-", "A+", "A-", "B+", "B-", "AB+", or "AB-",
  "hivStatus": "Negative", "Positive", or "Positive - On Treatment",
  "medicalConditions": ["array of 1-3 conditions like 'Hypertension', 'Type 2 Diabetes', 'Asthma', 'HIV/AIDS', 'Tuberculosis'"],
  "allergies": ["array like ['Penicillin'] or ['None'] if no allergies"],
  "medications": ["array of 1-3 medications with dosages like 'Metformin 500mg twice daily'"],
  "emergencyContact": {
    "name": "Full name",
    "relationship": "Spouse", "Brother", "Sister", "Parent", or "Friend",
    "phone": "+27 XX XXX XXXX format"
  },
  "lastVisit": "YYYY-MM-DD (recent past date within last 6 months)",
  "nextAppointment": "YYYY-MM-DD (future date)"
}

IMPORTANT RULES:
1. Return ONLY the JSON object, no markdown, no code blocks, no backticks
2. Include ALL fields listed above - do not skip any
3. Use realistic South African names and addresses
4. Medical conditions and medications should be realistic and match each other
5. If HIV status is "Positive" or "Positive - On Treatment", include HIV-related medications
6. Dates must be in YYYY-MM-DD format

Return the JSON now:`,
              },
            },
          ],
          maxTokens: 2048,
        },
      },
      CreateMessageResultSchema
    );
  
    if (res.content.type !== "text") {
      return { content: [{ type: "text", text: "Failed to generate fake user" }] };
    }
  
    try {
      const cleaned = res.content.text
        .trim()
        .replace(/^```(?:json)?/i, "")
        .replace(/```$/i, "")
        .trim();
  
      const fakeUser = JSON.parse(cleaned);
      
      // Validate and transform the user data
      const transformedUser: any = {
        name: fakeUser.name || "Unknown User",
        email: fakeUser.email || "unknown@example.com",
        address: typeof fakeUser.address === 'string' 
          ? fakeUser.address 
          : (fakeUser.address?.street || fakeUser.address || ''),
        phone: fakeUser.phone || "+27 00 000 0000",
        dateOfBirth: fakeUser.dateOfBirth,
        gender: fakeUser.gender,
        bloodType: fakeUser.bloodType,
        hivStatus: fakeUser.hivStatus,
        medicalConditions: Array.isArray(fakeUser.medicalConditions) ? fakeUser.medicalConditions : [],
        allergies: Array.isArray(fakeUser.allergies) ? fakeUser.allergies : ["None"],
        medications: Array.isArray(fakeUser.medications) ? fakeUser.medications : [],
        emergencyContact: fakeUser.emergencyContact || {
          name: "Emergency Contact",
          relationship: "Friend",
          phone: "+27 00 000 0000"
        },
        lastVisit: fakeUser.lastVisit,
        nextAppointment: fakeUser.nextAppointment
      };
      
      const id = await createUser(transformedUser);
  
      // Format comprehensive response
      const responseText = `✅ PATIENT CREATED SUCCESSFULLY
═══════════════════════════════════════════════════════════════

BASIC INFORMATION:
───────────────────────────────────────────────────────────────
Patient ID: ${id}
Name: ${transformedUser.name}
Email: ${transformedUser.email}
Phone: ${transformedUser.phone}
Address: ${transformedUser.address}

${transformedUser.dateOfBirth ? `Date of Birth: ${transformedUser.dateOfBirth}
Gender: ${transformedUser.gender || 'Not specified'}` : ''}

${transformedUser.bloodType || transformedUser.hivStatus ? `HEALTH INFORMATION:
───────────────────────────────────────────────────────────────
${transformedUser.bloodType ? `Blood Type: ${transformedUser.bloodType}` : ''}
${transformedUser.hivStatus ? `HIV Status: ${transformedUser.hivStatus}` : ''}` : ''}

${transformedUser.medicalConditions && transformedUser.medicalConditions.length > 0 ? `MEDICAL CONDITIONS:
───────────────────────────────────────────────────────────────
${transformedUser.medicalConditions.map((cond: string) => `• ${cond}`).join('\n')}` : ''}

${transformedUser.allergies && transformedUser.allergies.length > 0 ? `ALLERGIES:
───────────────────────────────────────────────────────────────
${transformedUser.allergies.filter((a: string) => a !== 'None').length > 0 
  ? transformedUser.allergies.filter((a: string) => a !== 'None').map((allergy: string) => `⚠️ ${allergy}`).join('\n')
  : 'None'}` : ''}

${transformedUser.medications && transformedUser.medications.length > 0 ? `MEDICATIONS:
───────────────────────────────────────────────────────────────
${transformedUser.medications.map((med: string) => `• ${med}`).join('\n')}` : ''}

${transformedUser.emergencyContact ? `EMERGENCY CONTACT:
───────────────────────────────────────────────────────────────
Name: ${transformedUser.emergencyContact.name}
Relationship: ${transformedUser.emergencyContact.relationship}
Phone: ${transformedUser.emergencyContact.phone}` : ''}

${transformedUser.lastVisit || transformedUser.nextAppointment ? `VISIT INFORMATION:
───────────────────────────────────────────────────────────────
${transformedUser.lastVisit ? `Last Visit: ${new Date(transformedUser.lastVisit).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}
${transformedUser.nextAppointment ? `Next Appointment: ${new Date(transformedUser.nextAppointment).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}` : ''}` : ''}

═══════════════════════════════════════════════════════════════
Patient has been saved to the database with all health information.`;
  
      return { 
        content: [{ 
          type: "text", 
          text: responseText
        }] 
      };
    } catch (err) {
      console.error("Failed to parse fake user data:", err);
      return {
        content: [{ type: "text", text: `Failed to parse fake user data: ${err instanceof Error ? err.message : 'Unknown error'}` }],
      };
    }
  });
  

server.prompt("generate-fake-user", "Generate a fake user based on a given name", {
    name: z.string(),
}, ({ name }) => {
    return {
        messages: [{
            role: 'user',
            content: {
                type: "text",
                text: `Generate a fake user based on the name ${name}. The user should have a realistic email, address, and phone number`
            }
        }]
    }
})

server.tool("generate-patient-medical-report", "Generate a detailed medical report for a specific patient based on their health data, gender, medical conditions, and HIV status", {
    patientId: z.number().describe("The ID of the patient to generate a medical report for"),
    reportFormat: z.enum(["detailed", "summary", "clinical-notes"]).optional().default("detailed").describe("Format of the medical report: detailed (full report), summary (brief overview), or clinical-notes (clinical assessment only)"),
}, {
    title: "Generate Patient Medical Report",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
}, async (params) => {
    try {
        const { patientId, reportFormat = "detailed" } = params
        
        const users = await import("./data/users.json", {
            with: { type: "json" }
        }).then(m => m.default)
        
        const patient = users.find((u: any) => u.id === patientId)
        if (!patient) {
            return {
                content: [
                    { type: "text", text: `❌ Patient not found. Patient ID ${patientId} does not exist in the database.` }
                ]
            }
        }

        // Calculate age
        const calculateAge = (dob: string) => {
            const birthDate = new Date(dob)
            const today = new Date()
            let age = today.getFullYear() - birthDate.getFullYear()
            const monthDiff = today.getMonth() - birthDate.getMonth()
            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--
            }
            return age
        }

        const age = patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : null
        const currentDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })

        // Gender-specific health considerations
        const genderConsiderations = patient.gender === "Female" 
            ? `FEMALE HEALTH CONSIDERATIONS:
• Reproductive health screening recommended
• Cervical cancer screening (if age ${age && age >= 21 ? 'appropriate' : '≥21'})
• Breast health awareness
• Bone density monitoring (if age ≥65 or at risk)
• Pregnancy considerations if applicable`
            : patient.gender === "Male"
            ? `MALE HEALTH CONSIDERATIONS:
• Prostate health screening (if age ≥50 or earlier if at risk)
• Cardiovascular risk assessment
• Testicular health awareness`
            : ""

        // HIV status-specific clinical guidance
        const hivClinicalGuidance = patient.hivStatus?.includes("Positive")
            ? `HIV POSITIVE - CLINICAL MANAGEMENT:
╔═══════════════════════════════════════════════════════════╗
║ CRITICAL: Patient is HIV-positive and on antiretroviral   ║
║ therapy (ART). The following monitoring is essential:     ║
╚═══════════════════════════════════════════════════════════╝

1. IMMUNOLOGICAL MONITORING:
   • CD4 count: Monitor every 6 months (or as clinically indicated)
   • Assess immune function and recovery

2. VIROLOGICAL MONITORING:
   • Viral load: Monitor every 6 months
   • Target: Undetectable viral load (<50 copies/mL)
   • Assess treatment efficacy

3. ADHERENCE ASSESSMENT:
   • Regular assessment of medication adherence
   • Pill count or pharmacy refill records
   • Address barriers to adherence

4. OPPORTUNISTIC INFECTION SCREENING:
   • Tuberculosis: Annual screening or as indicated
   • Cryptococcal antigen (if CD4 <100)
   • Other OIs based on CD4 count

5. COMPREHENSIVE CARE:
   • STI screening
   • Hepatitis B and C screening
   • Mental health assessment
   • Substance use assessment

6. PREVENTION:
   • Condom use counseling
   • Pre-exposure prophylaxis (PrEP) for partners if indicated
   • Post-exposure prophylaxis (PEP) counseling`
            : `HIV STATUS: Negative

ROUTINE SCREENING:
• Continue HIV testing as per protocol (annual or as indicated)
• Pre-exposure prophylaxis (PrEP) counseling if at risk
• Post-exposure prophylaxis (PEP) counseling if needed`

        // Condition-specific clinical notes
        const conditionClinicalNotes: Record<string, string> = {
            "Hypertension": `HYPERTENSION MANAGEMENT:
• Target BP: <140/90 mmHg (or <130/80 if diabetes/CKD)
• Monitor: BP at each visit, annual lipid panel
• Lifestyle: DASH diet, sodium restriction, regular exercise
• Medication: Assess ACE inhibitor/ARB if indicated
• Complications: Monitor for target organ damage`,
            "Type 2 Diabetes": `TYPE 2 DIABETES MANAGEMENT:
• Target HbA1c: <7% (individualized)
• Monitor: HbA1c quarterly, annual microalbumin, annual eye exam
• Complications screening: Retinopathy, nephropathy, neuropathy
• Foot care: Annual foot exam, daily self-examination
• Lifestyle: Medical nutrition therapy, exercise counseling`,
            "HIV/AIDS": `HIV/AIDS MANAGEMENT:
• See HIV-specific guidelines above
• Multidisciplinary care approach
• Support services referral`,
            "Asthma": `ASTHMA MANAGEMENT:
• Assess control: ACT score or equivalent
• Review inhaler technique
• Monitor: Peak flow, symptom diary
• Action plan: Provide written asthma action plan
• Triggers: Identify and avoid triggers`,
            "Tuberculosis (completed treatment)": `TB POST-TREATMENT MONITORING:
• Monitor for recurrence (symptoms, CXR if indicated)
• Screen household contacts
• Consider isoniazid prophylaxis if indicated`,
            "Chronic Kidney Disease Stage 3": `CHRONIC KIDNEY DISEASE MANAGEMENT:
• Monitor: eGFR, creatinine, proteinuria
• Blood pressure: Target <130/80
• Medications: Adjust for renal function
• Referral: Nephrology if eGFR <30 or rapidly declining`,
            "Epilepsy": `EPILEPSY MANAGEMENT:
• Seizure control assessment
• Medication compliance
• Drug levels: Monitor if indicated
• Safety: Driving restrictions, seizure precautions`,
            "Hypothyroidism": `HYPOTHYROIDISM MANAGEMENT:
• Monitor: TSH every 6-12 months
• Medication: Levothyroxine, assess compliance
• Symptoms: Screen for hypo/hyperthyroidism`,
            "Depression": `DEPRESSION MANAGEMENT:
• PHQ-9 or equivalent screening
• Medication compliance
• Therapy: Consider referral
• Suicide risk assessment`,
            "Anemia": `ANEMIA MANAGEMENT:
• Monitor: Hemoglobin, complete blood count
• Workup: Iron studies, B12, folate if indicated
• Assess: Underlying cause`,
            "Hepatitis B": `HEPATITIS B MANAGEMENT:
• Monitor: LFTs, viral load
• Consider: Antiviral therapy if indicated
• Screen: Liver fibrosis/cirrhosis`,
            "Migraine": `MIGRAINE MANAGEMENT:
• Identify triggers
• Assess frequency and severity
• Preventive: Consider if ≥4/month
• Acute: Triptans, NSAIDs`,
            "Anxiety": `ANXIETY MANAGEMENT:
• GAD-7 or equivalent screening
• Medication compliance
• Therapy: Consider referral
• Relaxation techniques`,
            "Diabetic Neuropathy": `DIABETIC NEUROPATHY MANAGEMENT:
• Monitor: Foot examination, monofilament testing
• Pain management: Consider gabapentin, pregabalin
• Prevent: Foot ulcers, infections`,
            "Bronchial Asthma": `PEDIATRIC ASTHMA MANAGEMENT:
• Assess control with caregiver
• Review inhaler technique
• Monitor: Peak flow, symptoms
• Action plan: Provide to caregiver`
        }

        const conditionNotes = patient.medicalConditions?.map((condition: string) => {
            return conditionClinicalNotes[condition] || `Monitor ${condition}. Regular assessment recommended.`
        }).join("\n\n") || "No chronic conditions documented."

        // Generate report based on format
        let report = ""

        if (reportFormat === "summary") {
            report = `MEDICAL SUMMARY - ${patient.name.toUpperCase()}
Patient ID: ${patient.id} | Generated: ${currentDate}

DEMOGRAPHICS:
Age: ${age || "N/A"} | Gender: ${patient.gender || "N/A"} | Blood Type: ${patient.bloodType || "N/A"}

HIV STATUS: ${patient.hivStatus || "Not documented"}

ACTIVE CONDITIONS:
${patient.medicalConditions?.map((c: string) => `• ${c}`).join("\n") || "None documented"}

CURRENT MEDICATIONS:
${patient.medications?.map((m: string) => `• ${m}`).join("\n") || "None"}

ALLERGIES:
${patient.allergies?.map((a: string) => `• ${a}`).join("\n") || "None known"}

KEY RECOMMENDATIONS:
${patient.hivStatus?.includes("Positive") ? "• Continue ART monitoring\n" : ""}${patient.medicalConditions?.some((c: string) => c.includes("Diabetes")) ? "• Monitor glycemic control\n" : ""}${patient.medicalConditions?.some((c: string) => c.includes("Hypertension")) ? "• Monitor blood pressure\n" : ""}• Regular follow-up appointments
• Medication adherence support`
        } else if (reportFormat === "clinical-notes") {
            report = `CLINICAL NOTES - ${patient.name.toUpperCase()}
Patient ID: ${patient.id} | Date: ${currentDate}

${hivClinicalGuidance}

${conditionNotes ? `\nCHRONIC CONDITIONS:\n${conditionNotes}` : ""}

${genderConsiderations}

ALLERGIES: ${patient.allergies?.join(", ") || "None known"}
MEDICATIONS: ${patient.medications?.join(" | ") || "None"}

ASSESSMENT & PLAN:
${patient.hivStatus?.includes("Positive") ? "1. Continue HIV management as above\n" : ""}${patient.medicalConditions?.includes("Type 2 Diabetes") ? "2. Diabetes: Monitor HbA1c, assess complications\n" : ""}${patient.medicalConditions?.includes("Hypertension") ? "3. Hypertension: Monitor BP, assess cardiovascular risk\n" : ""}4. Preventive care: Age and gender-appropriate screenings
5. Medication review and adherence support`
        } else {
            // Detailed report
            report = `COMPREHENSIVE MEDICAL REPORT
AfyaLink Community Health Clinic
Report Generated: ${currentDate}

═══════════════════════════════════════════════════════════════

PATIENT INFORMATION
───────────────────────────────────────────────────────────────
Name: ${patient.name}
Patient ID: ${patient.id}
Date of Birth: ${patient.dateOfBirth || "Not documented"}
Age: ${age ? `${age} years` : "Not calculated"}
Gender: ${patient.gender || "Not documented"}
Blood Type: ${patient.bloodType || "Not documented"}

Contact Information:
  Phone: ${patient.phone}
  Email: ${patient.email}
  Address: ${patient.address}

Emergency Contact:
${patient.emergencyContact ? `  Name: ${patient.emergencyContact.name}\n  Relationship: ${patient.emergencyContact.relationship}\n  Phone: ${patient.emergencyContact.phone}` : "  Not documented"}

═══════════════════════════════════════════════════════════════

${hivClinicalGuidance}

═══════════════════════════════════════════════════════════════

MEDICAL CONDITIONS
───────────────────────────────────────────────────────────────
${patient.medicalConditions?.length ? patient.medicalConditions.map((cond: string) => `• ${cond}`).join("\n") : "No chronic conditions documented."}

${conditionNotes ? `\nCLINICAL NOTES BY CONDITION:\n${conditionNotes}` : ""}

═══════════════════════════════════════════════════════════════

${genderConsiderations}

═══════════════════════════════════════════════════════════════

CURRENT MEDICATIONS
───────────────────────────────────────────────────────────────
${patient.medications?.length ? patient.medications.map((med: string) => `• ${med}`).join("\n") : "No medications documented."}

MEDICATION REVIEW:
• Assess medication compliance and adherence
• Review for potential drug interactions
• Monitor for adverse effects
• Consider medication reconciliation at each visit
${patient.hivStatus?.includes("Positive") ? "• HIV medications: Assess ART adherence and efficacy\n" : ""}

═══════════════════════════════════════════════════════════════

ALLERGIES & ADVERSE REACTIONS
───────────────────────────────────────────────────────────────
${patient.allergies?.length ? patient.allergies.map((allergy: string) => `⚠️ ${allergy}`).join("\n") : "No known allergies documented."}

${patient.allergies?.length ? "\nIMPORTANT: Document allergies clearly. Avoid prescribing medications with known allergens. Consider alternative medications if needed." : ""}

═══════════════════════════════════════════════════════════════

VISIT HISTORY
───────────────────────────────────────────────────────────────
Last Visit: ${patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not documented"}
Next Scheduled Appointment: ${patient.nextAppointment ? new Date(patient.nextAppointment).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : "Not scheduled"}

═══════════════════════════════════════════════════════════════

CLINICAL ASSESSMENT
───────────────────────────────────────────────────────────────
${patient.hivStatus?.includes("Positive") ? "1. HIV Management: Continue ART monitoring, assess adherence, monitor CD4 and viral load.\n" : ""}${patient.medicalConditions?.includes("Type 2 Diabetes") ? "2. Diabetes: Monitor glycemic control (HbA1c), assess for complications (retinopathy, nephropathy, neuropathy), provide dietary counseling.\n" : ""}${patient.medicalConditions?.includes("Hypertension") ? "3. Hypertension: Monitor blood pressure, assess cardiovascular risk factors, lifestyle modifications.\n" : ""}${patient.medicalConditions?.some((c: string) => c.includes("Asthma")) ? "4. Respiratory: Assess asthma control, review inhaler technique, monitor for exacerbations.\n" : ""}${patient.medicalConditions?.some((c: string) => c.includes("Kidney") || c.includes("Renal")) ? "5. Renal: Monitor renal function, assess for progression, consider specialist referral if indicated.\n" : ""}6. Preventive Care: Continue age and gender-appropriate health screenings.
7. Medication Adherence: Assess and support patient adherence to prescribed medications.
8. Health Education: Provide counseling on lifestyle modifications, disease management, and health promotion.

═══════════════════════════════════════════════════════════════

RISK STRATIFICATION
───────────────────────────────────────────────────────────────
${patient.hivStatus?.includes("Positive") ? "• HIGH RISK: HIV-positive status requires close monitoring, adherence support, and comprehensive care.\n" : ""}${patient.medicalConditions?.some((c: string) => c.includes("Diabetes") || c.includes("Hypertension")) ? "• MODERATE-HIGH RISK: Cardiovascular and metabolic risk factors present. Regular monitoring and risk reduction strategies essential.\n" : ""}${patient.medicalConditions?.some((c: string) => c.includes("Kidney") || c.includes("Renal")) ? "• MODERATE RISK: Renal impairment requires monitoring and appropriate management.\n" : ""}${patient.allergies?.length ? "• ALLERGY RISK: Documented allergies require careful medication selection and documentation.\n" : ""}• General health maintenance and preventive care recommended for all patients.

═══════════════════════════════════════════════════════════════

RECOMMENDATIONS FOR NEXT VISIT
───────────────────────────────────────────────────────────────
1. Review and update medication list and assess adherence
2. Monitor control of chronic conditions
3. Perform comprehensive physical examination
4. Review and update allergy list
5. Assess vital signs (BP, weight, etc.)
6. ${patient.hivStatus?.includes("Positive") ? "Check CD4 count and viral load results\n7. " : ""}Provide health education and counseling
${patient.hivStatus?.includes("Positive") ? "8. " : "7. "}Schedule follow-up appointment as clinically indicated

═══════════════════════════════════════════════════════════════

This medical report was generated by the AfyaLink Clinic Management System.
All patient information is confidential and protected by medical privacy regulations.

Report ID: MED-${patient.id}-${Date.now()}
Generated by: AfyaLink AI Medical Assistant
Medical Professional Review Recommended
`
        }

        return {
            content: [
                { type: "text", text: report }
            ]
        }
    } catch (error) {
        console.error("Error generating patient medical report:", error)
        return {
            content: [
                { type: "text", text: `❌ Error generating medical report: ${error instanceof Error ? error.message : 'Unknown error'}` }
            ]
        }
    }
})

server.tool("generate-report", "Generate a comprehensive report based on patient and appointment statistics", {
    reportType: z.enum(["summary", "detailed", "patients", "appointments"]).optional().describe("Type of report to generate: summary (default), detailed, patients, or appointments"),
    includeTrends: z.boolean().optional().default(true).describe("Whether to include trend information in the report"),
}, {
    title: "Generate Report",
    readOnlyHint: true,
    destructiveHint: false,
    idempotentHint: true,
    openWorldHint: false,
}, async (params) => {
    try {
        const { reportType = "summary", includeTrends = true } = params
        
        // Get statistics
        const totalPatients = await getTotalPatients()
        const totalAppointments = await getScheduledAppointments()
        const visitsToday = await getVisitsToday()
        const activeCases = await getActiveCases()
        
        // Get current date
        const currentDate = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
        
        let report = ""
        
        if (reportType === "summary") {
            report = `📊 CLINIC REPORT - SUMMARY
Generated on: ${currentDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 KEY STATISTICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 Total Patients: ${totalPatients}
   • All registered patients in the system

📅 Scheduled Appointments: ${totalAppointments}
   • Currently scheduled upcoming appointments

🏥 Visits Today: ${visitsToday}
   • Patient visits scheduled for today

🔄 Active Cases: ${activeCases}
   • Patients with recent activity (last 30 days)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your clinic currently manages ${totalPatients} patient${totalPatients !== 1 ? 's' : ''} with ${totalAppointments} scheduled appointment${totalAppointments !== 1 ? 's' : ''}. 
Today, there ${visitsToday === 1 ? 'is' : 'are'} ${visitsToday} visit${visitsToday !== 1 ? 's' : ''} scheduled, and ${activeCases} active case${activeCases !== 1 ? 's' : ''} requiring ongoing attention.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        } else if (reportType === "detailed") {
            report = `📊 CLINIC REPORT - DETAILED ANALYSIS
Generated on: ${currentDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 COMPREHENSIVE STATISTICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PATIENT MANAGEMENT
   ────────────────────────
   Total Registered Patients: ${totalPatients}
   Active Cases (Last 30 Days): ${activeCases}
   Inactive Patients: ${totalPatients - activeCases}
   
   Patient Activity Rate: ${totalPatients > 0 ? Math.round((activeCases / totalPatients) * 100) : 0}%

2. APPOINTMENT SCHEDULING
   ────────────────────────
   Scheduled Appointments: ${totalAppointments}
   Visits Scheduled Today: ${visitsToday}
   
   ${totalAppointments > 0 ? `Average appointments per active patient: ${(totalAppointments / activeCases).toFixed(1)}` : 'No appointments scheduled'}

3. OPERATIONAL METRICS
   ────────────────────────
   • Patient-to-Appointment Ratio: ${totalPatients > 0 ? (totalAppointments / totalPatients).toFixed(2) : '0.00'} appointments per patient
   • Daily Visit Rate: ${visitsToday} visit${visitsToday !== 1 ? 's' : ''} today
   • Active Case Percentage: ${totalPatients > 0 ? Math.round((activeCases / totalPatients) * 100) : 0}% of total patients

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 INSIGHTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${totalPatients > 0 
    ? `• Your clinic serves ${totalPatients} patient${totalPatients !== 1 ? 's' : ''} with ${activeCases} currently active case${activeCases !== 1 ? 's' : ''}.`
    : '• No patients registered yet.'}
${totalAppointments > 0 
    ? `• You have ${totalAppointments} upcoming appointment${totalAppointments !== 1 ? 's' : ''} scheduled.`
    : '• No appointments currently scheduled.'}
${visitsToday > 0 
    ? `• Today, ${visitsToday} patient${visitsToday !== 1 ? 's are' : ' is'} scheduled for visit${visitsToday !== 1 ? 's' : ''}.`
    : '• No visits scheduled for today.'}
${activeCases > 0 
    ? `• ${activeCases} patient${activeCases !== 1 ? 's have' : ' has'} had activity in the last 30 days.`
    : '• No active cases in the last 30 days.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        } else if (reportType === "patients") {
            report = `👥 PATIENT REPORT
Generated on: ${currentDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PATIENT STATISTICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Patients: ${totalPatients}
Active Cases: ${activeCases}
Inactive Patients: ${totalPatients - activeCases}

Patient Activity Breakdown:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Active Patients (Last 30 Days): ${activeCases}
  ${totalPatients > 0 ? `Percentage: ${Math.round((activeCases / totalPatients) * 100)}%` : 'Percentage: 0%'}

• Inactive Patients: ${totalPatients - activeCases}
  ${totalPatients > 0 ? `Percentage: ${Math.round(((totalPatients - activeCases) / totalPatients) * 100)}%` : 'Percentage: 0%'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${totalPatients === 0 
    ? 'No patients are currently registered in the system.'
    : totalPatients === activeCases
    ? `All ${totalPatients} registered patient${totalPatients !== 1 ? 's have' : ' has'} been active in the last 30 days, indicating excellent patient engagement.`
    : `Out of ${totalPatients} total patient${totalPatients !== 1 ? 's' : ''}, ${activeCases} (${Math.round((activeCases / totalPatients) * 100)}%) have been active in the last 30 days.`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        } else if (reportType === "appointments") {
            report = `📅 APPOINTMENT REPORT
Generated on: ${currentDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 APPOINTMENT STATISTICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scheduled Appointments: ${totalAppointments}
Visits Today: ${visitsToday}
Upcoming Appointments: ${Math.max(0, totalAppointments - visitsToday)}

Appointment Breakdown:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Today's Scheduled Visits: ${visitsToday}
• Future Appointments: ${Math.max(0, totalAppointments - visitsToday)}

${totalPatients > 0 ? `
Appointment Distribution:
• Appointments per Patient: ${(totalAppointments / totalPatients).toFixed(2)}
• Appointments per Active Patient: ${activeCases > 0 ? (totalAppointments / activeCases).toFixed(2) : '0.00'}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${totalAppointments === 0 
    ? 'No appointments are currently scheduled.'
    : `You have ${totalAppointments} appointment${totalAppointments !== 1 ? 's' : ''} scheduled. ${visitsToday > 0 ? `Of these, ${visitsToday} ${visitsToday === 1 ? 'is' : 'are'} scheduled for today.` : 'No appointments are scheduled for today.'}`}

${totalAppointments > 0 && totalPatients > 0 
    ? `The appointment-to-patient ratio is ${(totalAppointments / totalPatients).toFixed(2)}, indicating ${totalAppointments >= totalPatients ? 'good' : 'moderate'} scheduling coverage.`
    : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        }
        
        return {
            content: [
                { type: "text", text: report }
            ]
        }
    } catch (error) {
        console.error("Error generating report:", error)
        return {
            content: [
                { type: "text", text: `Error generating report: ${error instanceof Error ? error.message : 'Unknown error'}` }
            ]
        }
    }
})

server.tool("save-report", "Save a generated report to the reports database. Requires explicit confirmation from the user before saving.", {
    reportType: z.enum(["summary", "detailed", "patients", "appointments"]).describe("Type of report to save"),
    confirmSave: z.boolean().describe("User confirmation to save the report. Must be true to proceed."),
}, {
    title: "Save Report to Database",
    readOnlyHint: false,
    destructiveHint: false,
    idempotentHint: false,
    openWorldHint: false,
}, async (params) => {
    try {
        const { reportType, confirmSave } = params
        
        // Check for confirmation
        if (!confirmSave) {
            return {
                content: [
                    { type: "text", text: "❌ Save cancelled. Please confirm that you want to save this report before proceeding." }
                ]
            }
        }
        
        // Get statistics to generate the report again (or you could pass the report content)
        const totalPatients = await getTotalPatients()
        const totalAppointments = await getScheduledAppointments()
        const visitsToday = await getVisitsToday()
        const activeCases = await getActiveCases()
        
        // Get current date
        const currentDate = new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        })
        
        // Generate the report content (same logic as generate-report)
        let report = ""
        
        if (reportType === "summary") {
            report = `📊 CLINIC REPORT - SUMMARY
Generated on: ${currentDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 KEY STATISTICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

👥 Total Patients: ${totalPatients}
   • All registered patients in the system

📅 Scheduled Appointments: ${totalAppointments}
   • Currently scheduled upcoming appointments

🏥 Visits Today: ${visitsToday}
   • Patient visits scheduled for today

🔄 Active Cases: ${activeCases}
   • Patients with recent activity (last 30 days)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 SUMMARY:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Your clinic currently manages ${totalPatients} patient${totalPatients !== 1 ? 's' : ''} with ${totalAppointments} scheduled appointment${totalAppointments !== 1 ? 's' : ''}. 
Today, there ${visitsToday === 1 ? 'is' : 'are'} ${visitsToday} visit${visitsToday !== 1 ? 's' : ''} scheduled, and ${activeCases} active case${activeCases !== 1 ? 's' : ''} requiring ongoing attention.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        } else if (reportType === "detailed") {
            report = `📊 CLINIC REPORT - DETAILED ANALYSIS
Generated on: ${currentDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📋 COMPREHENSIVE STATISTICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. PATIENT MANAGEMENT
   ────────────────────────
   Total Registered Patients: ${totalPatients}
   Active Cases (Last 30 Days): ${activeCases}
   Inactive Patients: ${totalPatients - activeCases}
   
   Patient Activity Rate: ${totalPatients > 0 ? Math.round((activeCases / totalPatients) * 100) : 0}%

2. APPOINTMENT SCHEDULING
   ────────────────────────
   Scheduled Appointments: ${totalAppointments}
   Visits Scheduled Today: ${visitsToday}
   
   ${totalAppointments > 0 ? `Average appointments per active patient: ${(totalAppointments / activeCases).toFixed(1)}` : 'No appointments scheduled'}

3. OPERATIONAL METRICS
   ────────────────────────
   • Patient-to-Appointment Ratio: ${totalPatients > 0 ? (totalAppointments / totalPatients).toFixed(2) : '0.00'} appointments per patient
   • Daily Visit Rate: ${visitsToday} visit${visitsToday !== 1 ? 's' : ''} today
   • Active Case Percentage: ${totalPatients > 0 ? Math.round((activeCases / totalPatients) * 100) : 0}% of total patients

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

💡 INSIGHTS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${totalPatients > 0 
    ? `• Your clinic serves ${totalPatients} patient${totalPatients !== 1 ? 's' : ''} with ${activeCases} currently active case${activeCases !== 1 ? 's' : ''}.`
    : '• No patients registered yet.'}
${totalAppointments > 0 
    ? `• You have ${totalAppointments} upcoming appointment${totalAppointments !== 1 ? 's' : ''} scheduled.`
    : '• No appointments currently scheduled.'}
${visitsToday > 0 
    ? `• Today, ${visitsToday} patient${visitsToday !== 1 ? 's are' : ' is'} scheduled for visit${visitsToday !== 1 ? 's' : ''}.`
    : '• No visits scheduled for today.'}
${activeCases > 0 
    ? `• ${activeCases} patient${activeCases !== 1 ? 's have' : ' has'} had activity in the last 30 days.`
    : '• No active cases in the last 30 days.'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        } else if (reportType === "patients") {
            report = `👥 PATIENT REPORT
Generated on: ${currentDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 PATIENT STATISTICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total Patients: ${totalPatients}
Active Cases: ${activeCases}
Inactive Patients: ${totalPatients - activeCases}

Patient Activity Breakdown:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Active Patients (Last 30 Days): ${activeCases}
  ${totalPatients > 0 ? `Percentage: ${Math.round((activeCases / totalPatients) * 100)}%` : 'Percentage: 0%'}

• Inactive Patients: ${totalPatients - activeCases}
  ${totalPatients > 0 ? `Percentage: ${Math.round(((totalPatients - activeCases) / totalPatients) * 100)}%` : 'Percentage: 0%'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${totalPatients === 0 
    ? 'No patients are currently registered in the system.'
    : totalPatients === activeCases
    ? `All ${totalPatients} registered patient${totalPatients !== 1 ? 's have' : ' has'} been active in the last 30 days, indicating excellent patient engagement.`
    : `Out of ${totalPatients} total patient${totalPatients !== 1 ? 's' : ''}, ${activeCases} (${Math.round((activeCases / totalPatients) * 100)}%) have been active in the last 30 days.`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        } else if (reportType === "appointments") {
            report = `📅 APPOINTMENT REPORT
Generated on: ${currentDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 APPOINTMENT STATISTICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scheduled Appointments: ${totalAppointments}
Visits Today: ${visitsToday}
Upcoming Appointments: ${Math.max(0, totalAppointments - visitsToday)}

Appointment Breakdown:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

• Today's Scheduled Visits: ${visitsToday}
• Future Appointments: ${Math.max(0, totalAppointments - visitsToday)}

${totalPatients > 0 ? `
Appointment Distribution:
• Appointments per Patient: ${(totalAppointments / totalPatients).toFixed(2)}
• Appointments per Active Patient: ${activeCases > 0 ? (totalAppointments / activeCases).toFixed(2) : '0.00'}
` : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📈 ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${totalAppointments === 0 
    ? 'No appointments are currently scheduled.'
    : `You have ${totalAppointments} appointment${totalAppointments !== 1 ? 's' : ''} scheduled. ${visitsToday > 0 ? `Of these, ${visitsToday} ${visitsToday === 1 ? 'is' : 'are'} scheduled for today.` : 'No appointments are scheduled for today.'}`}

${totalAppointments > 0 && totalPatients > 0 
    ? `The appointment-to-patient ratio is ${(totalAppointments / totalPatients).toFixed(2)}, indicating ${totalAppointments >= totalPatients ? 'good' : 'moderate'} scheduling coverage.`
    : ''}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`
        }
        
        // Save report to reports.json
        const reportData = {
            id: Date.now(),
            reportType,
            generatedAt: new Date().toISOString(),
            content: report,
            statistics: {
                totalPatients,
                totalAppointments,
                visitsToday,
                activeCases
            }
        }
        
        const reportsPath = resolve(process.cwd(), "src", "data", "reports.json")
        const existingReports = await fs.readFile(reportsPath, "utf-8")
            .then(data => JSON.parse(data))
            .catch(() => [])
        
        existingReports.push(reportData)
        
        await fs.writeFile(reportsPath, JSON.stringify(existingReports, null, 2))
        
        return {
            content: [
                { type: "text", text: `✅ Report saved successfully!\n\nReport ID: ${reportData.id}\nReport Type: ${reportType}\nSaved at: ${new Date(reportData.generatedAt).toLocaleString()}\n\nYour report has been saved to the database.` }
            ]
        }
    } catch (error) {
        console.error("Error saving report:", error)
        return {
            content: [
                { type: "text", text: `❌ Error saving report: ${error instanceof Error ? error.message : 'Unknown error'}` }
            ]
        }
    }
})

async function createUser(user: {
    name: string,
    email: string,
    address: string,
    phone: string,
    dateOfBirth?: string,
    gender?: string,
    bloodType?: string,
    hivStatus?: string,
    medicalConditions?: string[],
    allergies?: string[],
    medications?: string[],
    emergencyContact?: {
        name: string,
        relationship: string,
        phone: string,
    },
    lastVisit?: string,
    nextAppointment?: string,
}) {
    const users = await import("./data/users.json", {
        with: { type: "json" }
    }).then(m => m.default)

    const id = users.length + 1

    // Create user object with only provided fields
    const newUser: any = { id, ...user }
    users.push(newUser)

    const usersPath = resolve(process.cwd(), "src", "data", "users.json")
    await fs.writeFile(usersPath, JSON.stringify(users, null, 2))

    return id
}

async function main() {
    const transport = new StdioServerTransport()
    await server.connect(transport)
}

main()