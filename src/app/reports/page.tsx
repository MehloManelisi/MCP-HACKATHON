import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { FileText, Download, TrendingUp, Users, Activity, Calendar } from "lucide-react"
import { mockPatients, mockVisits } from "@/lib/mock-data"

export default function ReportsPage() {
  const totalPatients = mockPatients.length
  const totalVisits = mockVisits.length
  const thisMonthVisits = mockVisits.filter((v) => new Date(v.visit_date).getMonth() === new Date().getMonth()).length

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">View clinic statistics and generate reports</p>
        </div>
        <Button className="bg-[#10b981] hover:bg-[#059669] rounded-3xl">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 rounded-3xl bg-[#10b981]/5 border-[#10b981]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-3xl bg-[#10b981] flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-[#10b981]" />
          </div>
          <p className="text-sm text-muted-foreground">Total Patients</p>
          <p className="text-3xl font-bold text-foreground mt-1">{totalPatients}</p>
          <p className="text-xs text-[#10b981] mt-2">+12% from last month</p>
        </Card>

        <Card className="p-6 rounded-3xl bg-[#f97316]/5 border-[#f97316]">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-3xl bg-[#f97316] flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-[#f97316]" />
          </div>
          <p className="text-sm text-muted-foreground">Total Visits</p>
          <p className="text-3xl font-bold text-foreground mt-1">{totalVisits}</p>
          <p className="text-xs text-[#f97316] mt-2">+8% from last month</p>
        </Card>

        <Card className="p-6 rounded-3xl bg-blue-500/5 border-blue-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-3xl bg-blue-500 flex items-center justify-center">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-sm text-muted-foreground">This Month</p>
          <p className="text-3xl font-bold text-foreground mt-1">{thisMonthVisits}</p>
          <p className="text-xs text-blue-500 mt-2">+15% from last month</p>
        </Card>

        <Card className="p-6 rounded-3xl bg-purple-500/5 border-purple-500">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-3xl bg-purple-500 flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <TrendingUp className="w-5 h-5 text-purple-500" />
          </div>
          <p className="text-sm text-muted-foreground">AI Summaries</p>
          <p className="text-3xl font-bold text-foreground mt-1">{totalPatients}</p>
          <p className="text-xs text-purple-500 mt-2">100% coverage</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 rounded-3xl">
          <h2 className="text-xl font-semibold text-foreground mb-4">Common Diagnoses</h2>
          <div className="space-y-4">
            {[
              { name: "Hypertension", count: 12, color: "#10b981" },
              { name: "Diabetes", count: 8, color: "#f97316" },
              { name: "Respiratory Infections", count: 15, color: "#3b82f6" },
              { name: "Malaria", count: 6, color: "#8b5cf6" },
            ].map((diagnosis) => (
              <div key={diagnosis.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: diagnosis.color }} />
                  <span className="text-sm text-foreground">{diagnosis.name}</span>
                </div>
                <Badge className="rounded-3xl" variant="outline">
                  {diagnosis.count} cases
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 rounded-3xl">
          <h2 className="text-xl font-semibold text-foreground mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {mockVisits.slice(0, 4).map((visit) => {
              const patient = mockPatients.find((p) => p.id === visit.patient_id)
              if (!patient) return null

              return (
                <div key={visit.id} className="flex items-start gap-3 pb-4 border-b last:border-0">
                  <div className="w-10 h-10 rounded-3xl bg-[#10b981]/10 flex items-center justify-center flex-shrink-0">
                    <Activity className="w-5 h-5 text-[#10b981]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                      {patient.first_name} {patient.last_name}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{visit.diagnosis}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(visit.visit_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>
    </div>
  )
}
