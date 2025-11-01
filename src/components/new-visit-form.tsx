"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Textarea } from "../components/ui/textarea"
import { Loader2 } from "lucide-react"

interface NewVisitFormProps {
  patientId: string
}

export function NewVisitForm({ patientId }: NewVisitFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    chief_complaint: "",
    symptoms: "",
    diagnosis: "",
    treatment: "",
    medications: "",
    temperature: "",
    blood_pressure: "",
    heart_rate: "",
    weight: "",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      console.log("[v0] New visit data:", { patientId, ...formData })
      setIsLoading(false)
      alert("Visit recorded successfully!")
    }, 1000)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="chief_complaint">Chief Complaint *</Label>
        <Input
          id="chief_complaint"
          name="chief_complaint"
          placeholder="e.g., Headache and fever"
          value={formData.chief_complaint}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="symptoms">Symptoms</Label>
        <Textarea
          id="symptoms"
          name="symptoms"
          placeholder="Describe the symptoms..."
          value={formData.symptoms}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="temperature">Temperature (°C)</Label>
          <Input
            id="temperature"
            name="temperature"
            type="number"
            step="0.1"
            placeholder="37.0"
            value={formData.temperature}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="blood_pressure">Blood Pressure</Label>
          <Input
            id="blood_pressure"
            name="blood_pressure"
            placeholder="120/80"
            value={formData.blood_pressure}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="heart_rate">Heart Rate (bpm)</Label>
          <Input
            id="heart_rate"
            name="heart_rate"
            type="number"
            placeholder="72"
            value={formData.heart_rate}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            name="weight"
            type="number"
            step="0.1"
            placeholder="70"
            value={formData.weight}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="diagnosis">Diagnosis</Label>
        <Input
          id="diagnosis"
          name="diagnosis"
          placeholder="e.g., Upper respiratory tract infection"
          value={formData.diagnosis}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="treatment">Treatment Plan</Label>
        <Textarea
          id="treatment"
          name="treatment"
          placeholder="Describe the treatment plan..."
          value={formData.treatment}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="medications">Medications</Label>
        <Textarea
          id="medications"
          name="medications"
          placeholder="List medications and dosages..."
          value={formData.medications}
          onChange={handleChange}
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Additional Notes</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Any additional notes..."
          value={formData.notes}
          onChange={handleChange}
          rows={2}
        />
      </div>

      <Button type="submit" disabled={isLoading} className="w-full bg-[#10b981] hover:bg-[#059669] text-white">
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Recording Visit...
          </>
        ) : (
          "Record Visit"
        )}
      </Button>
    </form>
  )
}
