"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Search, Plus, Filter } from "lucide-react"
import { AnimatedButtonWrapper } from "@/components/animated-button-wrapper"

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

interface PatientListProps {
  patients: User[]
}

export function PatientList({ patients }: PatientListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPatients = patients.filter((patient) => {
    const name = patient.name.toLowerCase()
    return name.includes(searchQuery.toLowerCase()) || 
           patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  })

  return (
    <Card className="p-6 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-orange-400">Recently Added Patients</h2>
          <p className="text-sm text-white/70 mt-1">{filteredPatients.length} of 4 recent patients</p>
        </div>
        <Link href="/patients/new">
          <AnimatedButtonWrapper>
            <Button className="relative bg-orange-500 hover:bg-orange-600 text-white rounded-full z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none font-semibold">
              <Plus className="w-4 h-4 mr-2" />
              Add Patient
            </Button>
          </AnimatedButtonWrapper>
        </Link>
      </div>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-orange-400" />
          <Input
            type="search"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-11 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
          />
        </div>
        <Button variant="outline" className="rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white hover:bg-zinc-800 hover:border-orange-500/50">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      <div className="space-y-3">
        {filteredPatients.length > 0 ? (
          filteredPatients.map((patient) => {
            const initials = patient.name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .toUpperCase()
              .slice(0, 2)

            return (
              <div
                key={patient.id}
                onClick={() => router.push(`/patients/${patient.id}`)}
                className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 border border-orange-500/30 rounded-3xl shadow-md shadow-orange-500/10 hover:shadow-lg hover:shadow-orange-500/20 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
                    <span className="text-lg font-semibold text-orange-400">
                      {initials}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{patient.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-sm text-white/70">{patient.email}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white/70">{patient.address}</p>
                  <p className="text-sm text-white/70 mt-1">{patient.phone}</p>
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-8">
            <p className="text-white/50">No patients found</p>
          </div>
        )}
      </div>
    </Card>
  )
}
