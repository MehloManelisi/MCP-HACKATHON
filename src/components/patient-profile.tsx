"use client"

import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import type { Patient } from "@/lib/types"
import { Phone, MapPin, Calendar, Droplet, AlertTriangle, Heart, Share2, Edit, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

interface PatientProfileProps {
  patient: Patient
}

export function PatientProfile({ patient }: PatientProfileProps) {
  const router = useRouter()

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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => router.push("/dashboard")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="w-4 h-4 mr-2" />
            Share Record
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <div className="flex items-start gap-6">
        <div className="w-24 h-24 rounded-full bg-[#10b981]/10 flex items-center justify-center flex-shrink-0">
          <span className="text-3xl font-bold text-[#10b981]">
            {patient.first_name[0]}
            {patient.last_name[0]}
          </span>
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {patient.first_name} {patient.last_name}
              </h1>
              <p className="text-muted mt-1">
                {calculateAge(patient.date_of_birth)} years old • {patient.gender}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-dark flex items-center justify-center">
                <Phone className="w-5 h-5 text-muted" />
              </div>
              <div>
                <p className="text-sm text-muted">Phone</p>
                <p className="font-medium text-foreground">{patient.phone || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-dark flex items-center justify-center">
                <MapPin className="w-5 h-5 text-muted" />
              </div>
              <div>
                <p className="text-sm text-muted">Village</p>
                <p className="font-medium text-foreground">{patient.village || "Not provided"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-dark flex items-center justify-center">
                <Calendar className="w-5 h-5 text-muted" />
              </div>
              <div>
                <p className="text-sm text-muted">Date of Birth</p>
                <p className="font-medium text-foreground">{new Date(patient.date_of_birth).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-surface-dark flex items-center justify-center">
                <Droplet className="w-5 h-5 text-muted" />
              </div>
              <div>
                <p className="text-sm text-muted">Blood Type</p>
                <p className="font-medium text-foreground">{patient.blood_type || "Unknown"}</p>
              </div>
            </div>
          </div>

          {(patient.allergies || patient.chronic_conditions) && (
            <div className="mt-6 pt-6 border-t border-border">
              <h3 className="font-semibold text-foreground mb-4">Medical Information</h3>
              <div className="space-y-3">
                {patient.allergies && patient.allergies !== "None" && (
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-[#f97316] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Allergies</p>
                      <p className="text-sm text-muted">{patient.allergies}</p>
                    </div>
                  </div>
                )}
                {patient.chronic_conditions && patient.chronic_conditions !== "None" && (
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-[#ef4444] mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Chronic Conditions</p>
                      <p className="text-sm text-muted">{patient.chronic_conditions}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
