"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Search, Plus, Filter } from "lucide-react"
import { mockPatients } from "@/lib/mock-data"
import type { Patient } from "@/lib/types"

export function PatientList() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [patients] = useState<Patient[]>(mockPatients)

  const filteredPatients = patients.filter((patient) => {
    const fullName = `${patient.first_name} ${patient.last_name}`.toLowerCase()
    return fullName.includes(searchQuery.toLowerCase())
  })

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

  return (
    <Card className="p-6 rounded-3xl border-border/50">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Patients</h2>
          <p className="text-sm text-muted-foreground mt-1">{filteredPatients.length} total patients</p>
        </div>
        <Button className="bg-[#10b981] hover:bg-[#059669] text-white rounded-3xl">
          <Plus className="w-4 h-4 mr-2" />
          Add Patient
        </Button>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 rounded-3xl"
          />
        </div>
        <Button variant="outline" className="rounded-3xl bg-transparent">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="space-y-3">
        {filteredPatients.map((patient) => (
          <div
            key={patient.id}
            onClick={() => router.push(`/patients/${patient.id}`)}
            className="flex items-center justify-between p-4 border border-border/50 rounded-3xl hover:bg-accent/50 hover:border-border cursor-pointer transition-all"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-3xl bg-[#10b981]/10 flex items-center justify-center">
                <span className="text-lg font-semibold text-[#10b981]">
                  {patient.first_name[0]}
                  {patient.last_name[0]}
                </span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">
                  {patient.first_name} {patient.last_name}
                </h3>
                <div className="flex items-center gap-3 mt-1">
                  <span className="text-sm text-muted-foreground">
                    {calculateAge(patient.date_of_birth)} years • {patient.gender}
                  </span>
                  {patient.chronic_conditions && patient.chronic_conditions !== "None" && (
                    <Badge variant="outline" className="text-xs rounded-3xl">
                      {patient.chronic_conditions}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">{patient.village}</p>
              <p className="text-sm text-muted-foreground mt-1">{patient.phone}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
