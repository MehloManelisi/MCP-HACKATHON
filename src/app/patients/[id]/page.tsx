import { DashboardHeader } from "../../../components/dashboard-header.js"
import { PatientProfile } from "../../../components/patient-profile.js"
import { PatientVisits } from "../../../components/patient-visits.js"
import { AISummaryCard } from "../../../components/ai-summary-card.js"
import { mockPatients, mockVisits } from "../../../lib/mock-data.js"
import { notFound } from "next/navigation"

export default async function PatientPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const patient = mockPatients.find((p) => p.id === id)

  if (!patient) {
    notFound()
  }

  const patientVisits = mockVisits.filter((v) => v.patient_id === id)

  return (
    <div className="min-h-screen bg-surface">
      <DashboardHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PatientProfile patient={patient} />
            <PatientVisits visits={patientVisits} patientId={patient.id} />
          </div>
          <div>
            <AISummaryCard patient={patient} visits={patientVisits} />
          </div>
        </div>
      </main>
    </div>
  )
}
