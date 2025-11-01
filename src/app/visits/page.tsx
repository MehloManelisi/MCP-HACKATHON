import { Card } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { mockVisits, mockPatients } from "@/lib/mock-data"
import { Search, Calendar, User, Activity, Thermometer } from "lucide-react"
import Link from "next/link"

export default function VisitsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Visit History</h1>
        <p className="text-muted-foreground mt-1">View all patient visits and medical records</p>
      </div>

      <Card className="p-6 rounded-3xl">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input placeholder="Search visits by patient name or diagnosis..." className="pl-10 rounded-3xl" />
        </div>

        <div className="space-y-4">
          {mockVisits.map((visit) => {
            const patient = mockPatients.find((p) => p.id === visit.patient_id)
            if (!patient) return null

            return (
              <Link key={visit.id} href={`/patients/${patient.id}`}>
                <Card className="p-6 rounded-3xl hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#10b981]">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-3xl bg-[#10b981]/10 flex items-center justify-center">
                        <Activity className="w-6 h-6 text-[#10b981]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{visit.chief_complaint}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <User className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {patient.first_name} {patient.last_name}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(visit.visit_date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-foreground">Diagnosis:</span>
                      <p className="text-sm text-muted-foreground mt-1">{visit.diagnosis}</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-4 h-4 text-[#f97316]" />
                        <div>
                          <p className="text-xs text-muted-foreground">Temperature</p>
                          <p className="text-sm font-medium">{visit.vital_signs?.temperature ?? "N/A"}°C</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Blood Pressure</p>
                        <p className="text-sm font-medium">{visit.vital_signs?.blood_pressure ?? "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Heart Rate</p>
                        <p className="text-sm font-medium">{visit.vital_signs?.heart_rate ?? "N/A"} bpm</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Weight</p>
                        <p className="text-sm font-medium">{visit.vital_signs?.weight ?? "N/A"} kg</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Badge className="bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 rounded-3xl">
                        {visit.diagnosis}
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
