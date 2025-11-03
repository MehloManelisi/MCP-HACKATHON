import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Calendar, Clock, User, Plus, Phone } from "lucide-react"
import { mockPatients } from "@/lib/mock-data"

interface Appointment {
  id: string
  patient_id: string
  date: string
  time: string
  reason: string
  status: "scheduled" | "completed" | "cancelled"
}

// Mock appointments data
const mockAppointments: Appointment[] = [
  {
    id: "1",
    patient_id: mockPatients[0].id,
    date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    time: "09:00",
    reason: "Follow-up consultation",
    status: "scheduled",
  },
  {
    id: "2",
    patient_id: mockPatients[1].id,
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    time: "10:30",
    reason: "Routine checkup",
    status: "scheduled",
  },
  {
    id: "3",
    patient_id: mockPatients[2].id,
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
    time: "14:00",
    reason: "Diabetes management",
    status: "scheduled",
  },
]

export default function AppointmentsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Appointments</h1>
          <p className="text-muted-foreground mt-1">Manage upcoming patient appointments</p>
        </div>
        <Button className="bg-[#10b981] hover:bg-[#059669] rounded-3xl">
          <Plus className="w-4 h-4 mr-2" />
          New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 rounded-3xl bg-[#10b981]/5 border-[#10b981]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-3xl bg-[#10b981] flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Today</p>
              <p className="text-2xl font-bold text-foreground">0</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl bg-[#f97316]/5 border-[#f97316]">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-3xl bg-[#f97316] flex items-center justify-center">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">This Week</p>
              <p className="text-2xl font-bold text-foreground">{mockAppointments.length}</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl bg-blue-500/5 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-3xl bg-blue-500 flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Patients</p>
              <p className="text-2xl font-bold text-foreground">{mockPatients.length}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 rounded-3xl">
        <h2 className="text-xl font-semibold text-foreground mb-6">Upcoming Appointments</h2>
        <div className="space-y-4">
          {mockAppointments.map((appointment) => {
            const patient = mockPatients.find((p) => p.id === appointment.patient_id)
            if (!patient) return null

            return (
              <Card key={appointment.id} className="p-6 rounded-3xl border-2 hover:border-[#10b981] transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-3xl bg-[#10b981]/10 flex items-center justify-center">
                      <span className="text-xl font-bold text-[#10b981]">
                        {patient.first_name[0]}
                        {patient.last_name[0]}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {patient.first_name} {patient.last_name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1">{appointment.reason}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(appointment.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{appointment.time}</span>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{patient.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge className="bg-[#10b981]/10 text-[#10b981] hover:bg-[#10b981]/20 rounded-3xl">
                      Scheduled
                    </Badge>
                    <Button variant="outline" className="rounded-3xl bg-transparent">
                      View Details
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
