"use client"

import { useState, useEffect } from "react"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { FileText, Download, Search, Eye, Calendar, Brain, X, Sparkles, User, ClipboardList, BarChart3 } from "lucide-react"
import Link from "next/link"
import { PageWrapper } from "@/components/page-wrapper"
import { AnimatedButtonWrapper } from "@/components/animated-button-wrapper"
import jsPDF from "jspdf"

interface SavedReport {
  id: number
  reportType: "summary" | "detailed" | "patients" | "appointments"
  generatedAt: string
  content: string
  statistics: {
    totalPatients: number
    totalAppointments: number
    visitsToday: number
    activeCases: number
  }
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewingReport, setViewingReport] = useState<SavedReport | null>(null)
  const [reports, setReports] = useState<SavedReport[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Load reports from reports.json
    fetch("/api/reports")
      .then((res) => res.json())
      .then((data) => {
        setReports(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error loading reports:", error)
        setIsLoading(false)
      })
  }, [])

  const filteredReports = reports.filter((report) => {
    const query = searchQuery.toLowerCase()
    return (
      report.reportType.toLowerCase().includes(query) ||
      report.content.toLowerCase().includes(query) ||
      report.id.toString().includes(query)
    )
  })

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getReportTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      summary: "Summary Report",
      detailed: "Detailed Analysis",
      patients: "Patient Report",
      appointments: "Appointment Report",
    }
    return labels[type] || type
  }

  const generatePDF = (report: SavedReport) => {
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Set up fonts and colors
    const primaryColor: [number, number, number] = [255, 140, 0] // Orange
    const textColor: [number, number, number] = [51, 51, 51]
    const lightGray: [number, number, number] = [240, 240, 240]

    // Title
    doc.setFillColor(primaryColor[0], primaryColor[1], primaryColor[2])
    doc.rect(10, 10, 190, 25, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("CLINIC REPORT", 105, 25, { align: "center" })
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(getReportTypeLabel(report.reportType).toUpperCase(), 105, 32, { align: "center" })

    // Reset text color
    doc.setTextColor(textColor[0], textColor[1], textColor[2])

    // Report metadata
    let yPos = 45
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Report ID: ${report.id}`, 10, yPos)
    yPos += 6
    doc.text(`Generated: ${formatDate(report.generatedAt)}`, 10, yPos)
    yPos += 6
    doc.text(`Report Type: ${getReportTypeLabel(report.reportType)}`, 10, yPos)

    // Statistics box
    yPos += 12
    doc.setFillColor(lightGray[0], lightGray[1], lightGray[2])
    doc.roundedRect(10, yPos - 8, 190, 35, 3, 3, "F")
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("KEY STATISTICS", 15, yPos)
    yPos += 8
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Total Patients: ${report.statistics.totalPatients}`, 15, yPos)
    yPos += 6
    doc.text(`Scheduled Appointments: ${report.statistics.totalAppointments}`, 15, yPos)
    yPos += 6
    doc.text(`Visits Today: ${report.statistics.visitsToday}`, 15, yPos)
    yPos += 6
    doc.text(`Active Cases: ${report.statistics.activeCases}`, 15, yPos)

    // Report content
    yPos += 15
    doc.setFontSize(12)
    doc.setFont("helvetica", "bold")
    doc.text("REPORT CONTENT", 10, yPos)
    yPos += 8

    // Process content - remove emojis and format for PDF
    const cleanContent = report.content
      .replace(/[📊📋👥📅🏥🔄📈💡]/g, "")
      .replace(/━━━+/g, "")
      .replace(/\n{3,}/g, "\n\n")

    // Split content into lines and add to PDF
    const lines = doc.splitTextToSize(cleanContent, 180)
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")

    lines.forEach((line: string) => {
      if (yPos > 270) {
        // New page if needed
        doc.addPage()
        yPos = 20
      }
      doc.text(line, 10, yPos)
      yPos += 6
    })

    // Footer
    const pageCount = (doc as any).internal.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(8)
      doc.setTextColor(128, 128, 128)
      doc.text(
        `Page ${i} of ${pageCount} • Generated by AfyaLink Clinic System`,
        105,
        285,
        { align: "center" }
      )
      doc.text(`Report ID: ${report.id}`, 10, 285)
    }

    return doc
  }

  const handleViewPDF = (reportId: number) => {
    const report = reports.find((r) => r.id === reportId)
    if (report) {
      setViewingReport(report)
    }
  }

  const handleDownloadPDF = (reportId: number) => {
    const report = reports.find((r) => r.id === reportId)
    if (!report) return

    const doc = generatePDF(report)
    const fileName = `Clinic_Report_${getReportTypeLabel(report.reportType).replace(/\s+/g, "_")}_${report.id}.pdf`
    doc.save(fileName)
  }

  if (isLoading) {
    return (
      <PageWrapper title="Patient Reports" description="PDF reports generated by AI chatbot">
        <Card className="p-12 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-400 mx-auto mb-4"></div>
          <p className="text-white/70">Loading reports...</p>
        </Card>
      </PageWrapper>
    )
  }

  return (
    <PageWrapper title="Patient Reports" description="PDF reports generated by AI chatbot">
      <div className="space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-4 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
                <FileText className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{reports.length}</p>
                <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">Total Reports</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
                <Brain className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">AI Generated</p>
                <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">All Reports</p>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
                <Calendar className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">
                  {reports.filter((r) => new Date(r.generatedAt).getMonth() === new Date().getMonth()).length}
                </p>
                <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">This Month</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Available Report Types Section */}
        <Card className="bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl p-6 border border-orange-500/40 shadow-2xl shadow-orange-500/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
              <Sparkles className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-orange-400">Available Report Types</h2>
              <p className="text-sm text-white/70">Generate these reports using the AI chatbot</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Clinic Statistics Reports */}
            <div className="bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-2xl p-4 border border-orange-500/30 shadow-md shadow-orange-500/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
                  <BarChart3 className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-bold text-white">Clinic Statistics</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-orange-500/25 text-orange-300 border border-orange-500/40 text-xs px-2 py-0.5">Summary</Badge>
                  <span className="text-xs text-white/70">Overview of clinic statistics</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-orange-500/25 text-orange-300 border border-orange-500/40 text-xs px-2 py-0.5">Detailed</Badge>
                  <span className="text-xs text-white/70">Comprehensive analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-orange-500/25 text-orange-300 border border-orange-500/40 text-xs px-2 py-0.5">Patients</Badge>
                  <span className="text-xs text-white/70">Patient-focused report</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-orange-500/25 text-orange-300 border border-orange-500/40 text-xs px-2 py-0.5">Appointments</Badge>
                  <span className="text-xs text-white/70">Appointment statistics</span>
                </div>
              </div>
              <p className="text-[10px] text-white/50 mt-3">Ask chatbot: "Generate a summary report"</p>
            </div>

            {/* Patient Medical Reports */}
            <div className="bg-gradient-to-r from-blue-500/10 via-zinc-800/40 to-zinc-800/40 rounded-2xl p-4 border border-blue-500/30 shadow-md shadow-blue-500/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/30 shadow-md">
                  <User className="w-5 h-5 text-blue-400" />
                </div>
                <h3 className="font-bold text-white">Patient Medical</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-blue-500/25 text-blue-300 border border-blue-500/40 text-xs px-2 py-0.5">Detailed</Badge>
                  <span className="text-xs text-white/70">Full medical report</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-blue-500/25 text-blue-300 border border-blue-500/40 text-xs px-2 py-0.5">Summary</Badge>
                  <span className="text-xs text-white/70">Brief overview</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-blue-500/25 text-blue-300 border border-blue-500/40 text-xs px-2 py-0.5">Clinical Notes</Badge>
                  <span className="text-xs text-white/70">Clinical assessment</span>
                </div>
              </div>
              <p className="text-[10px] text-white/50 mt-3">Ask chatbot: "Generate medical report for patient ID 1"</p>
            </div>

            {/* Health Status Reports */}
            <div className="bg-gradient-to-r from-green-500/10 via-zinc-800/40 to-zinc-800/40 rounded-2xl p-4 border border-green-500/30 shadow-md shadow-green-500/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-green-600/10 flex items-center justify-center border border-green-500/30 shadow-md">
                  <ClipboardList className="w-5 h-5 text-green-400" />
                </div>
                <h3 className="font-bold text-white">Health Status</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-green-500/25 text-green-300 border border-green-500/40 text-xs px-2 py-0.5">HIV Status</Badge>
                  <span className="text-xs text-white/70">Filter by HIV status</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-green-500/25 text-green-300 border border-green-500/40 text-xs px-2 py-0.5">Gender</Badge>
                  <span className="text-xs text-white/70">Filter by gender</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-green-500/25 text-green-300 border border-green-500/40 text-xs px-2 py-0.5">Conditions</Badge>
                  <span className="text-xs text-white/70">Filter by condition</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="rounded-full bg-green-500/25 text-green-300 border border-green-500/40 text-xs px-2 py-0.5">Blood Type</Badge>
                  <span className="text-xs text-white/70">Filter by blood type</span>
                </div>
              </div>
              <p className="text-[10px] text-white/50 mt-3">Ask chatbot: "Show me all HIV-positive patients"</p>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-zinc-700/50">
            <Link href="/chatbot">
              <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white rounded-full font-semibold">
                <Brain className="w-4 h-4 mr-2" />
                Generate New Report with AI Chatbot
              </Button>
            </Link>
          </div>
        </Card>

        {/* Search Section */}
        <Card className="bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl p-6 border border-zinc-700/50 shadow-2xl">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
            <Input
              placeholder="Search saved reports by type, content, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        </Card>

        {/* Saved Reports Section */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
            <FileText className="w-4 h-4 text-orange-400" />
          </div>
          <h2 className="text-xl font-bold text-orange-400">Saved Reports</h2>
          <Badge className="rounded-full bg-orange-500/25 text-orange-300 border border-orange-500/40 text-xs px-3 py-1">
            {reports.length} saved
          </Badge>
        </div>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card
              key={report.id}
              className="group bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl p-6 border border-orange-500/40 shadow-2xl shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md flex-shrink-0">
                    <FileText className="w-7 h-7 text-orange-400" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-orange-400">
                        {getReportTypeLabel(report.reportType)}
                      </h3>
                      <Badge className="rounded-full bg-gradient-to-r from-orange-500/25 to-orange-600/15 text-orange-300 border border-orange-500/40 text-xs px-3 py-0.5">
                        {report.reportType}
                      </Badge>
                      <Badge className="rounded-full bg-gradient-to-r from-green-500/25 to-green-600/15 text-green-300 border border-green-500/40 text-xs px-3 py-0.5">
                        Saved
                      </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-white/70 mb-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-medium">{formatDate(report.generatedAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Brain className="w-4 h-4 text-orange-400" />
                        <span className="text-xs font-medium">Report ID: {report.id}</span>
                      </div>
                    </div>

                    {/* Statistics Preview */}
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      <div className="bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-xl p-2 border border-orange-500/30">
                        <p className="text-xs text-white/50">Patients</p>
                        <p className="text-sm font-bold text-white">{report.statistics.totalPatients}</p>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-xl p-2 border border-orange-500/30">
                        <p className="text-xs text-white/50">Appointments</p>
                        <p className="text-sm font-bold text-white">{report.statistics.totalAppointments}</p>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-xl p-2 border border-orange-500/30">
                        <p className="text-xs text-white/50">Visits Today</p>
                        <p className="text-sm font-bold text-white">{report.statistics.visitsToday}</p>
                      </div>
                      <div className="bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-xl p-2 border border-orange-500/30">
                        <p className="text-xs text-white/50">Active Cases</p>
                        <p className="text-sm font-bold text-white">{report.statistics.activeCases}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  <Button
                    onClick={() => handleViewPDF(report.id)}
                    className="rounded-full bg-zinc-800/50 border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/50 transition-all"
                    size="sm"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View
                  </Button>
                  <AnimatedButtonWrapper>
                    <Button
                      onClick={() => handleDownloadPDF(report.id)}
                      className="relative bg-orange-500 hover:bg-orange-600 text-white rounded-full z-10 transform hover:scale-105 transition-all duration-300 font-semibold"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </AnimatedButtonWrapper>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredReports.length === 0 && !isLoading && (
          <Card className="p-12 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10 text-center">
            <FileText className="w-16 h-16 text-orange-400/50 mx-auto mb-4" />
            <p className="text-lg font-semibold text-white/70">No reports found</p>
            <p className="text-sm text-white/50 mt-2">
              {reports.length === 0
                ? "Generate reports using the AI chatbot to see them here"
                : "Try adjusting your search query"}
            </p>
          </Card>
        )}

        {/* PDF Viewer Modal */}
        {viewingReport && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="relative w-full h-full max-w-6xl mx-4 my-4 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/20 flex flex-col">
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-zinc-700/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
                    <FileText className="w-6 h-6 text-orange-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-orange-400">
                      {getReportTypeLabel(viewingReport.reportType)}
                    </h2>
                    <p className="text-sm text-white/70">
                      {formatDate(viewingReport.generatedAt)} • ID: {viewingReport.id}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AnimatedButtonWrapper>
                    <Button
                      onClick={() => handleDownloadPDF(viewingReport.id)}
                      className="relative bg-orange-500 hover:bg-orange-600 text-white rounded-full z-10 transform hover:scale-105 transition-all duration-300 font-semibold"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </Button>
                  </AnimatedButtonWrapper>
                  <Button
                    onClick={() => setViewingReport(null)}
                    className="rounded-full bg-zinc-800/50 border border-zinc-700/50 text-white hover:bg-zinc-800 hover:border-orange-500/50 transition-all"
                    size="sm"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Report Content */}
              <div className="flex-1 overflow-auto p-6">
                <div className="bg-white rounded-2xl p-8 shadow-lg min-h-full">
                  <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                      <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        {getReportTypeLabel(viewingReport.reportType)}
                      </h1>
                      <p className="text-sm text-gray-600">Generated by AI Chatbot</p>
                      <div className="w-20 h-1 bg-orange-500 rounded-full mt-4"></div>
                    </div>

                    {/* Statistics */}
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200 mb-6">
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Key Statistics</h2>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Total Patients</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {viewingReport.statistics.totalPatients}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Appointments</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {viewingReport.statistics.totalAppointments}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Visits Today</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {viewingReport.statistics.visitsToday}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Active Cases</p>
                          <p className="text-2xl font-bold text-orange-600">
                            {viewingReport.statistics.activeCases}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Report Content */}
                    <div className="space-y-6 text-gray-800">
                      <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Report Content</h2>
                        <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                          <pre className="whitespace-pre-wrap text-sm text-gray-700 font-mono">
                            {viewingReport.content}
                          </pre>
                        </div>
                      </section>

                      <section className="pt-6 border-t border-gray-200">
                        <p className="text-xs text-gray-500 text-center">
                          This report was automatically generated by the healthcare AI system and contains sensitive
                          medical information. Please handle with confidentiality.
                        </p>
                        <p className="text-xs text-gray-400 text-center mt-2">
                          Report ID: {viewingReport.id} • Generated: {formatDate(viewingReport.generatedAt)}
                        </p>
                      </section>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  )
}
