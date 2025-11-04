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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-3xl bg-[#10b981]/10 flex items-center justify-center">
          <UserPlus className="w-6 h-6 text-[#10b981]" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Register New Patient</h1>
          <p className="text-muted-foreground mt-1">Enter patient information to create a new health record</p>
        </div>
      </div>

      <Card className="p-8 rounded-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Personal Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground pb-3 border-b">Personal Information</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" required placeholder="John" className="rounded-3xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" required placeholder="Doe" className="rounded-3xl" />
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                <Input id="dateOfBirth" type="date" required className="rounded-3xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="gender">Gender *</Label>
                <Select required>
                  <SelectTrigger className="rounded-3xl">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="nationalId">National ID / Passport</Label>
              <Input id="nationalId" placeholder="Optional identification number" className="rounded-3xl" />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground pb-3 border-b">Contact Information</h2>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input id="phone" type="tel" required placeholder="+254 700 000 000" className="rounded-3xl" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea id="address" placeholder="Village, district, region" rows={3} className="rounded-3xl" />
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground pb-3 border-b">Emergency Contact</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyName">Contact Name</Label>
                <Input id="emergencyName" placeholder="Full name" className="rounded-3xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyPhone">Contact Phone</Label>
                <Input id="emergencyPhone" type="tel" placeholder="+254 700 000 000" className="rounded-3xl" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyRelation">Relationship</Label>
              <Input id="emergencyRelation" placeholder="e.g., Spouse, Parent, Sibling" className="rounded-3xl" />
            </div>
          </div>

          {/* Medical Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground pb-3 border-b">Medical Information</h2>
            <div className="space-y-2">
              <Label htmlFor="bloodType">Blood Type</Label>
              <Select>
                <SelectTrigger className="rounded-3xl">
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
            <div className="space-y-2">
              <Label htmlFor="allergies">Known Allergies</Label>
              <Textarea
                id="allergies"
                placeholder="List any known allergies (medications, food, etc.)"
                rows={3}
                className="rounded-3xl"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="conditions">Chronic Conditions</Label>
              <Textarea
                id="conditions"
                placeholder="List any chronic conditions (diabetes, hypertension, etc.)"
                rows={3}
                className="rounded-3xl"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-4 pt-4">
            <AnimatedButtonWrapper className="flex-1">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="relative w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubmitting ? "Registering..." : "Register Patient"}
              </Button>
            </AnimatedButtonWrapper>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
              className="rounded-3xl"
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
