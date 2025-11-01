"use client"

import { useState } from "react"
import { Card } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import type { Visit } from "../lib/types"
import { Plus, Calendar, Activity, Pill, FileText, ChevronDown, ChevronUp } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog"
import { NewVisitForm } from "../components/new-visit-form"

interface PatientVisitsProps {
  visits: Visit[]
  patientId: string
}

export function PatientVisits({ visits, patientId }: PatientVisitsProps) {
  const [expandedVisit, setExpandedVisit] = useState<string | null>(null)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-foreground">Visit History</h2>
          <p className="text-sm text-muted mt-1">{visits.length} total visits</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-[#10b981] hover:bg-[#059669] text-white">
              <Plus className="w-4 h-4 mr-2" />
              New Visit
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Record New Visit</DialogTitle>
              <DialogDescription>Add a new visit record for this patient</DialogDescription>
            </DialogHeader>
            <NewVisitForm patientId={patientId} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {visits.map((visit) => (
          <div key={visit.id} className="border border-border rounded-lg overflow-hidden">
            <div
              className="p-4 cursor-pointer hover:bg-surface-dark transition-colors"
              onClick={() => setExpandedVisit(expandedVisit === visit.id ? null : visit.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Calendar className="w-4 h-4 text-muted" />
                    <span className="font-medium text-foreground">{formatDate(visit.visit_date)}</span>
                    <span className="text-sm text-muted">{formatTime(visit.visit_date)}</span>
                  </div>
                  <p className="text-foreground font-medium">{visit.chief_complaint}</p>
                  {visit.diagnosis && (
                    <Badge variant="outline" className="mt-2">
                      {visit.diagnosis}
                    </Badge>
                  )}
                </div>
                {expandedVisit === visit.id ? (
                  <ChevronUp className="w-5 h-5 text-muted" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted" />
                )}
              </div>
            </div>

            {expandedVisit === visit.id && (
              <div className="px-4 pb-4 space-y-4 border-t border-border pt-4">
                {visit.symptoms && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Activity className="w-4 h-4 text-muted" />
                      <h4 className="font-medium text-foreground">Symptoms</h4>
                    </div>
                    <p className="text-sm text-muted pl-6">{visit.symptoms}</p>
                  </div>
                )}

                {visit.vital_signs && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Vital Signs</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-6">
                      {visit.vital_signs.temperature && (
                        <div className="bg-surface-dark rounded-lg p-3">
                          <p className="text-xs text-muted">Temperature</p>
                          <p className="font-medium text-foreground">{visit.vital_signs.temperature}°C</p>
                        </div>
                      )}
                      {visit.vital_signs.blood_pressure && (
                        <div className="bg-surface-dark rounded-lg p-3">
                          <p className="text-xs text-muted">Blood Pressure</p>
                          <p className="font-medium text-foreground">{visit.vital_signs.blood_pressure}</p>
                        </div>
                      )}
                      {visit.vital_signs.heart_rate && (
                        <div className="bg-surface-dark rounded-lg p-3">
                          <p className="text-xs text-muted">Heart Rate</p>
                          <p className="font-medium text-foreground">{visit.vital_signs.heart_rate} bpm</p>
                        </div>
                      )}
                      {visit.vital_signs.weight && (
                        <div className="bg-surface-dark rounded-lg p-3">
                          <p className="text-xs text-muted">Weight</p>
                          <p className="font-medium text-foreground">{visit.vital_signs.weight} kg</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {visit.treatment && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-muted" />
                      <h4 className="font-medium text-foreground">Treatment</h4>
                    </div>
                    <p className="text-sm text-muted pl-6">{visit.treatment}</p>
                  </div>
                )}

                {visit.medications && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Pill className="w-4 h-4 text-muted" />
                      <h4 className="font-medium text-foreground">Medications</h4>
                    </div>
                    <p className="text-sm text-muted pl-6">{visit.medications}</p>
                  </div>
                )}

                {visit.notes && (
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Notes</h4>
                    <p className="text-sm text-muted pl-6">{visit.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
