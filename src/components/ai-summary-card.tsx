"use client"

import { useState } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import type { Patient, Visit } from "../lib/types"
import { Sparkles, AlertTriangle, Lightbulb, TrendingUp, Loader2, RefreshCw } from "lucide-react"

interface AISummaryCardProps {
  patient: Patient
  visits: Visit[]
}

export function AISummaryCard({ patient, visits }: AISummaryCardProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState<{
    text: string
    riskFactors: string[]
    recommendations: string[]
    trends: string[]
  } | null>(null)

  const generateSummary = async () => {
    setIsGenerating(true)

    // Simulate AI generation with MCP pattern
    // In production, this would call the MCP server
    setTimeout(() => {
      const mockSummary = {
        text: `${patient.first_name} ${patient.last_name} is a ${calculateAge(patient.date_of_birth)}-year-old ${patient.gender.toLowerCase()} with ${patient.chronic_conditions || "no chronic conditions"}. Recent visits show ${visits.length > 0 ? "ongoing management of health concerns" : "no recent visits"}. ${patient.chronic_conditions && patient.chronic_conditions !== "None" ? `Active management of ${patient.chronic_conditions.toLowerCase()} is recommended.` : "Overall health appears stable."}`,
        riskFactors: getRiskFactors(patient, visits),
        recommendations: getRecommendations(patient, visits),
        trends: getTrends(visits),
      }
      setSummary(mockSummary)
      setIsGenerating(false)
    }, 2000)
  }

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

  const getRiskFactors = (patient: Patient, visits: Visit[]): string[] => {
    const factors: string[] = []

    if (patient.chronic_conditions && patient.chronic_conditions !== "None") {
      factors.push(`Chronic condition: ${patient.chronic_conditions}`)
    }

    if (patient.allergies && patient.allergies !== "None") {
      factors.push(`Allergies: ${patient.allergies}`)
    }

    // Analyze recent visits for patterns
    const recentVisits = visits.slice(0, 3)
    const hasHighBP = recentVisits.some((v) => {
      const bp = v.vital_signs?.blood_pressure
      if (bp) {
        const [systolic] = bp.split("/").map(Number)
        return systolic > 140
      }
      return false
    })

    if (hasHighBP) {
      factors.push("Elevated blood pressure readings")
    }

    if (factors.length === 0) {
      factors.push("No significant risk factors identified")
    }

    return factors
  }

  const getRecommendations = (patient: Patient, visits: Visit[]): string[] => {
    const recommendations: string[] = []

    if (patient.chronic_conditions?.includes("Hypertension")) {
      recommendations.push("Regular blood pressure monitoring")
      recommendations.push("Low-sodium diet and regular exercise")
    }

    if (patient.chronic_conditions?.includes("Diabetes")) {
      recommendations.push("Blood glucose monitoring")
      recommendations.push("Dietary counseling and medication adherence")
    }

    if (patient.chronic_conditions?.includes("Asthma")) {
      recommendations.push("Avoid triggers and maintain inhaler")
      recommendations.push("Regular respiratory assessments")
    }

    if (visits.length > 0) {
      const daysSinceLastVisit = Math.floor(
        (Date.now() - new Date(visits[0].visit_date).getTime()) / (1000 * 60 * 60 * 24),
      )

      if (daysSinceLastVisit > 90) {
        recommendations.push("Schedule routine follow-up visit")
      }
    }

    if (recommendations.length === 0) {
      recommendations.push("Continue routine health maintenance")
      recommendations.push("Annual health screening recommended")
    }

    return recommendations
  }

  const getTrends = (visits: Visit[]): string[] => {
    const trends: string[] = []

    if (visits.length >= 2) {
      const recentVisits = visits.slice(0, 3)

      // Check weight trend
      const weights = recentVisits
        .map((v) => v.vital_signs?.weight)
        .filter(Boolean)
        .map(Number)

      if (weights.length >= 2) {
        const weightChange = weights[0] - weights[weights.length - 1]
        if (Math.abs(weightChange) > 2) {
          trends.push(`Weight ${weightChange > 0 ? "increase" : "decrease"} of ${Math.abs(weightChange).toFixed(1)}kg`)
        }
      }

      // Check visit frequency
      if (visits.length >= 3) {
        trends.push(`${visits.length} visits recorded`)
      }
    }

    if (trends.length === 0) {
      trends.push("Insufficient data for trend analysis")
    }

    return trends
  }

  return (
    <Card className="p-6 sticky top-24">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#10b981] to-[#059669] flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-foreground">AI Health Summary</h2>
          <p className="text-xs text-muted">Powered by MCP</p>
        </div>
      </div>

      {!summary ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[#10b981]" />
          </div>
          <h3 className="font-semibold text-foreground mb-2">Generate AI Summary</h3>
          <p className="text-sm text-muted mb-6">
            Get intelligent insights about this patient's health history and recommendations
          </p>
          <Button
            onClick={generateSummary}
            disabled={isGenerating}
            className="bg-[#10b981] hover:bg-[#059669] text-white"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate Summary
              </>
            )}
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <p className="text-sm text-foreground leading-relaxed">{summary.text}</p>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-[#f97316]" />
              <h3 className="font-semibold text-foreground">Risk Factors</h3>
            </div>
            <div className="space-y-2">
              {summary.riskFactors.map((factor, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#f97316] mt-1.5 flex-shrink-0" />
                  <span>{factor}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="w-4 h-4 text-[#10b981]" />
              <h3 className="font-semibold text-foreground">Recommendations</h3>
            </div>
            <div className="space-y-2">
              {summary.recommendations.map((rec, index) => (
                <div key={index} className="flex items-start gap-2 text-sm text-muted">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-1.5 flex-shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#3b82f6]" />
              <h3 className="font-semibold text-foreground">Health Trends</h3>
            </div>
            <div className="space-y-2">
              {summary.trends.map((trend, index) => (
                <Badge key={index} variant="outline" className="mr-2">
                  {trend}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={generateSummary} disabled={isGenerating} variant="outline" className="w-full bg-transparent">
            <RefreshCw className="mr-2 h-4 w-4" />
            Regenerate Summary
          </Button>

          <p className="text-xs text-muted text-center">AI-generated summary • Always verify with clinical judgment</p>
        </div>
      )}
    </Card>
  )
}
