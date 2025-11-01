import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { mockPatients } from "@/lib/mock-data"
import { Search, UserPlus, Phone, MapPin, Calendar } from "lucide-react"
import { calculateAge } from "@/lib/utils"

export default function PatientsPage() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Patients</h1>
          <p className="text-muted-foreground mt-1">Manage and view all patient records</p>
        </div>
        <Link href="/patients/new">
          <Button className="bg-[#10b981] hover:bg-[#059669] rounded-3xl">
            <UserPlus className="w-4 h-4 mr-2" />
            New Patient
          </Button>
        </Link>
      </div>

      <Card className="p-6 rounded-3xl">
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input placeholder="Search patients by name, phone, or village..." className="pl-10 rounded-3xl" />
        </div>

        <div className="space-y-4">
          {mockPatients.map((patient) => (
            <Link key={patient.id} href={`/patients/${patient.id}`}>
              <Card className="p-6 rounded-3xl hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-[#10b981]">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-3xl bg-[#10b981]/10 flex items-center justify-center">
                        <span className="text-lg font-bold text-[#10b981]">
                          {patient.first_name[0]}
                          {patient.last_name[0]}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-foreground">
                          {patient.first_name} {patient.last_name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="rounded-3xl">
                            {patient.gender}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {calculateAge(patient.date_of_birth)} years old
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-4 h-4" />
                        <span>{patient.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4" />
                        <span>{patient.village}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>Blood Type: {patient.blood_type || "Unknown"}</span>
                      </div>
                    </div>

                    {patient.chronic_conditions && patient.chronic_conditions !== "None" && (
                      <div className="mt-3">
                        <Badge className="bg-[#f97316]/10 text-[#f97316] hover:bg-[#f97316]/20 rounded-3xl">
                          {patient.chronic_conditions}
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </Card>
    </div>
  )
}
