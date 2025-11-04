"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../../../components/ui/button"
import { Card } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Textarea } from "../../../components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/ui/select"
import { UserPlus } from "lucide-react"
import { PageWrapper } from "@/components/page-wrapper"
import { AnimatedButtonWrapper } from "@/components/animated-button-wrapper"

export default function NewPatientPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    router.push("/patients")
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

      <Card className="p-6 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10 max-w-[96rem] mx-auto">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Personal Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-orange-400 pb-2 border-b border-zinc-700/50">Personal Information</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="firstName" className="text-sm text-white">First Name *</Label>
                <Input id="firstName" required placeholder="John" className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="lastName" className="text-sm text-white">Last Name *</Label>
                <Input id="lastName" required placeholder="Doe" className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="dateOfBirth" className="text-sm text-white">Date of Birth *</Label>
                <Input id="dateOfBirth" type="date" required className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="gender" className="text-sm text-white">Gender *</Label>
                <Select required>
                  <SelectTrigger className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="nationalId" className="text-sm text-white">National ID / Passport</Label>
                <Input id="nationalId" placeholder="Optional" className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-orange-400 pb-2 border-b border-zinc-700/50">Contact Information</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="phone" className="text-sm text-white">Phone Number *</Label>
                <Input id="phone" type="tel" required placeholder="+254 700 000 000" className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="address" className="text-sm text-white">Address</Label>
                <Input id="address" placeholder="Village, district, region" className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" />
              </div>
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-orange-400 pb-2 border-b border-zinc-700/50">Emergency Contact</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="emergencyName" className="text-sm text-white">Contact Name</Label>
                <Input id="emergencyName" placeholder="Full name" className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emergencyPhone" className="text-sm text-white">Contact Phone</Label>
                <Input id="emergencyPhone" type="tel" placeholder="+254 700 000 000" className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emergencyRelation" className="text-sm text-white">Relationship</Label>
                <Input id="emergencyRelation" placeholder="Spouse, Parent, etc." className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-orange-400 pb-2 border-b border-zinc-700/50">Medical Information</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="bloodType" className="text-sm text-white">Blood Type</Label>
                <Select>
                  <SelectTrigger className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm">
                    <SelectValue placeholder="Select blood type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="A+">A+</SelectItem>
                    <SelectItem value="A-">A-</SelectItem>
                    <SelectItem value="B+">B+</SelectItem>
                    <SelectItem value="B-">B-</SelectItem>
                    <SelectItem value="AB+">AB+</SelectItem>
                    <SelectItem value="AB-">AB-</SelectItem>
                    <SelectItem value="O+">O+</SelectItem>
                    <SelectItem value="O-">O-</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="allergies" className="text-sm text-white">Known Allergies</Label>
                <Input id="allergies" placeholder="Medications, food, etc." className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="conditions" className="text-sm text-white">Chronic Conditions</Label>
                <Input id="conditions" placeholder="Diabetes, hypertension, etc." className="h-10 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20 text-sm" />
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
