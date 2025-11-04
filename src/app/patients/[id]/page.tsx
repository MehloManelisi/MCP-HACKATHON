import { PatientProfile } from "../../../components/patient-profile"
import { PatientVisits } from "../../../components/patient-visits"
import { AISummaryCard } from "../../../components/ai-summary-card"
import { mockPatients, mockVisits } from "../../../lib/mock-data"
import { notFound } from "next/navigation"
import { PageWrapper } from "@/components/page-wrapper"

export default function PatientPage({ params }: { params: { id: string } }) {
  const patient = mockPatients.find((p) => p.id === params.id)

  if (!patient) {
    notFound()
  }

  const patientVisits = mockVisits.filter((v) => v.patient_id === params.id)

  return (
    <PageWrapper title={`${patient.first_name} ${patient.last_name}`} description="Patient profile and visit history">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <PatientProfile patient={patient} />
            <PatientVisits visits={patientVisits} patientId={patient.id} />
          </div>
          <div>
            <AISummaryCard patient={patient} visits={patientVisits} />
          </div>
        </div>
    </PageWrapper>
  )
}
