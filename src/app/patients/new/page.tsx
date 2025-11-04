"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Card } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { UserPlus, AlertCircle } from "lucide-react"
import { PageWrapper } from "@/components/page-wrapper"
import { AnimatedButtonWrapper } from "@/components/animated-button-wrapper"

export default function NewPatientPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Form state
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [address, setAddress] = useState("")
  const [dateOfBirth, setDateOfBirth] = useState("")
  const [gender, setGender] = useState("")
  const [bloodType, setBloodType] = useState("")
  const [hivStatus, setHivStatus] = useState("")
  const [medicalConditions, setMedicalConditions] = useState("")
  const [allergies, setAllergies] = useState("")
  const [medications, setMedications] = useState("")
  const [emergencyContactName, setEmergencyContactName] = useState("")
  const [emergencyContactPhone, setEmergencyContactPhone] = useState("")
  const [emergencyContactRelationship, setEmergencyContactRelationship] = useState("")
  const [lastVisit, setLastVisit] = useState("")
  const [nextAppointment, setNextAppointment] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      // Prepare the data
      const patientData: any = {
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
      }

      // Add optional fields
      if (dateOfBirth) patientData.dateOfBirth = dateOfBirth
      if (gender) patientData.gender = gender === "male" ? "Male" : gender === "female" ? "Female" : gender
      if (bloodType) patientData.bloodType = bloodType
      if (hivStatus) patientData.hivStatus = hivStatus
      if (medicalConditions.trim()) patientData.medicalConditions = medicalConditions.split(",").map(c => c.trim()).filter(c => c)
      if (allergies.trim()) patientData.allergies = allergies.split(",").map(a => a.trim()).filter(a => a)
      if (medications.trim()) patientData.medications = medications.split(",").map(m => m.trim()).filter(m => m)
      if (lastVisit) patientData.lastVisit = lastVisit
      if (nextAppointment) patientData.nextAppointment = nextAppointment

      // Add emergency contact if provided
      if (emergencyContactName.trim()) {
        patientData.emergencyContact = {
          name: emergencyContactName.trim(),
          relationship: emergencyContactRelationship.trim() || "Friend",
          phone: emergencyContactPhone.trim(),
        }
      }

      // Call API to create patient
      const response = await fetch("/api/patients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patientData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to create patient")
      }

      // Success - redirect to patients page
      router.push("/patients")
    } catch (err) {
      console.error("Error creating patient:", err)
      setError(err instanceof Error ? err.message : "Failed to create patient. Please try again.")
      setIsSubmitting(false)
    }
  }

  return (
    <PageWrapper title="New Patient" description="Add a new patient to the system">
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
          <UserPlus className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Register New Patient</h1>
          <p className="text-sm text-white/70 mt-0.5">Enter patient information to create a new health record</p>
        </div>
      </div>

      {error && (
        <Card className="p-4 bg-gradient-to-br from-red-900/20 to-red-800/10 backdrop-blur-xl rounded-3xl border border-red-500/40 shadow-2xl">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-sm text-red-300">{error}</p>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10 max-w-[96rem] mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-orange-400 pb-2 border-b border-zinc-700/50">Personal Information</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm text-white">Full Name *</Label>
                <Input 
                  id="name" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe" 
                  className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm text-white">Email Address *</Label>
                <Input 
                  id="email" 
                  type="email"
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@example.com" 
                  className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" 
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="dateOfBirth" className="text-sm text-white">Date of Birth</Label>
                <Input 
                  id="dateOfBirth" 
                  type="date" 
                  value={dateOfBirth}
                  onChange={(e) => setDateOfBirth(e.target.value)}
                  className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-sm text-white">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-orange-400 pb-2 border-b border-zinc-700/50">Contact Information</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm text-white">Phone Number *</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  required 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+27 71 234 5678" 
                  className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-sm text-white">Address *</Label>
                <Input 
                  id="address" 
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main Street, Johannesburg, Gauteng 2000" 
                  className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" 
                />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-orange-400 pb-2 border-b border-zinc-700/50">Emergency Contact</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="emergencyName" className="text-sm text-white">Contact Name</Label>
                <Input 
                  id="emergencyName" 
                  value={emergencyContactName}
                  onChange={(e) => setEmergencyContactName(e.target.value)}
                  placeholder="Full name" 
                  className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emergencyPhone" className="text-sm text-white">Contact Phone</Label>
                <Input 
                  id="emergencyPhone" 
                  type="tel" 
                  value={emergencyContactPhone}
                  onChange={(e) => setEmergencyContactPhone(e.target.value)}
                  placeholder="+27 71 234 5678" 
                  className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emergencyRelation" className="text-sm text-white">Relationship</Label>
                <Input 
                  id="emergencyRelation" 
                  value={emergencyContactRelationship}
                  onChange={(e) => setEmergencyContactRelationship(e.target.value)}
                  placeholder="Spouse, Parent, etc." 
                  className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" 
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-orange-400 pb-2 border-b border-zinc-700/50">Medical Information</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="bloodType" className="text-sm text-white">Blood Type</Label>
                <Select value={bloodType} onValueChange={setBloodType}>
                  <SelectTrigger className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="hivStatus" className="text-sm text-white">HIV Status</Label>
                <Select value={hivStatus} onValueChange={setHivStatus}>
                  <SelectTrigger className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm">
                    <SelectValue placeholder="Select HIV status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Negative">Negative</SelectItem>
                    <SelectItem value="Positive">Positive</SelectItem>
                    <SelectItem value="Positive - On Treatment">Positive - On Treatment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="conditions" className="text-sm text-white">Medical Conditions (comma-separated)</Label>
                <Input 
                  id="conditions" 
                  value={medicalConditions}
                  onChange={(e) => setMedicalConditions(e.target.value)}
                  placeholder="Hypertension, Diabetes, etc." 
                  className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="allergies" className="text-sm text-white">Allergies (comma-separated)</Label>
                <Input 
                  id="allergies" 
                  value={allergies}
                  onChange={(e) => setAllergies(e.target.value)}
                  placeholder="Penicillin, Sulfa drugs, etc." 
                  className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="medications" className="text-sm text-white">Medications (comma-separated)</Label>
                <Input 
                  id="medications" 
                  value={medications}
                  onChange={(e) => setMedications(e.target.value)}
                  placeholder="Metformin 500mg, Amlodipine 10mg, etc." 
                  className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" 
                />
              </div>
            </div>
          </div>

          {/* Visit Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-orange-400 pb-2 border-b border-zinc-700/50">Visit Information</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="lastVisit" className="text-sm text-white">Last Visit</Label>
                <Input 
                  id="lastVisit" 
                  type="date"
                  value={lastVisit}
                  onChange={(e) => setLastVisit(e.target.value)}
                  className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" 
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nextAppointment" className="text-sm text-white">Next Appointment</Label>
                <Input 
                  id="nextAppointment" 
                  type="date"
                  value={nextAppointment}
                  onChange={(e) => setNextAppointment(e.target.value)}
                  className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" 
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-center gap-3 pt-3">
            <AnimatedButtonWrapper>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="relative w-48 bg-orange-500 hover:bg-orange-600 text-white rounded-full z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? "Registering..." : "Register Patient"}
              </Button>
            </AnimatedButtonWrapper>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="w-32 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white hover:bg-zinc-800 hover:border-orange-500/50"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
    </PageWrapper>
  )
}
