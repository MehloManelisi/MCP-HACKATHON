import { Card } from "../components/ui/card"
import { Clock, UserPlus } from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  address: string
  phone: string
  dateOfBirth?: string
  gender?: string
  bloodType?: string
  hivStatus?: string
  medicalConditions?: string[]
  allergies?: string[]
  medications?: string[]
  emergencyContact?: {
    name: string
    relationship: string
    phone: string
  }
  lastVisit?: string
  nextAppointment?: string
}

interface RecentActivityProps {
  recentlyAddedPatients: User[]
}

export function RecentActivity({ recentlyAddedPatients }: RecentActivityProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-orange-400" />
        <h2 className="text-xl font-bold text-orange-400">Recently Added Patients</h2>
      </div>

      <div className="space-y-4">
        {recentlyAddedPatients.length > 0 ? (
          recentlyAddedPatients.map((patient) => (
            <div key={patient.id} className="flex gap-3 p-3 bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-2xl border border-orange-500/30 shadow-md shadow-orange-500/10">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md flex-shrink-0">
                <UserPlus className="w-5 h-5 text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">New patient added</p>
                <p className="text-sm text-white/70 truncate">{patient.name}</p>
                <p className="text-xs text-white/50 mt-1">{patient.email}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-white/50 text-center py-4">No patients added yet</p>
        )}
      </div>

      <button className="w-full mt-6 text-sm text-orange-400 hover:text-orange-300 font-semibold transition-colors">
        View all patients
      </button>
    </Card>
  )
}
