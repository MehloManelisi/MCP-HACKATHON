"use client"

import { useState, useMemo, useEffect, memo } from "react"
import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Input } from "../../components/ui/input"
import { FileText, Download, Search, Eye, Calendar, Brain, X, ChevronLeft, ChevronRight } from "lucide-react"
import usersData from "@/data/users.json"
import { PageWrapper } from "@/components/page-wrapper"
import { AnimatedButtonWrapper } from "@/components/animated-button-wrapper"
import Image from "next/image"

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

// Curated list of 4 different Unsplash photos specifically of black/African people
const africanPhotos = {
  women: [
    "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&h=200&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=200&h=200&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=200&h=200&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=200&h=200&fit=crop&crop=faces",
  ],
  men: [
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop&crop=faces",
  ]
}

// Generate consistent photos using patient ID to ensure same photo per patient
function getPatientPhotoUrl(patientId: number, gender: string) {
  const seed = patientId.toString().slice(-2)
  const genderKey = gender === 'Female' ? 'women' : 'men'
  const photos = africanPhotos[genderKey]
  const photoIndex = parseInt(seed) % photos.length
  return photos[photoIndex]
}

const PatientAvatar = memo(function PatientAvatar({ patientId, gender, patientName }: { patientId: number; gender?: string; patientName: string }) {
  const [imageError, setImageError] = useState(false)
  const avatarUrl = useMemo(() => getPatientPhotoUrl(patientId, gender || 'Male'), [patientId, gender])
  const initials = patientName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  if (imageError) {
    return (
      <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-orange-500/25 via-orange-500/20 to-orange-600/15 flex items-center justify-center border-2 border-orange-500/40 shadow-xl shadow-orange-500/20 transition-all duration-300">
        <span className="text-lg font-bold text-orange-300">
          {initials}
        </span>
      </div>
    )
  }

  return (
    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-orange-500/25 via-orange-500/20 to-orange-600/15 flex items-center justify-center border-2 border-orange-500/40 shadow-xl shadow-orange-500/20 transition-all duration-300 overflow-hidden relative">
      <Image
        src={avatarUrl}
        alt={patientName}
        width={56}
        height={56}
        className="w-full h-full object-cover rounded-3xl"
        onError={() => setImageError(true)}
        unoptimized
      />
    </div>
  )
})

interface PDFReport {
  id: string
  patientId: number
  patientName: string
  generatedDate: string
  type: "Medical Summary" | "Visit Report" | "Health Analysis" | "summary" | "detailed" | "patients" | "appointments"
  size: string
  status: "Generated" | "Processing"
  gender?: string
}

export default function ReportsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [viewingReport, setViewingReport] = useState<PDFReport | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [savedReports, setSavedReports] = useState<any[]>([])
  const itemsPerPage = 6
  const patients = useMemo(() => usersData as User[], [])

  // Fetch saved reports from API
  useEffect(() => {
    fetch('/api/reports')
      .then(res => res.json())
      .then(data => {
        setSavedReports(data)
      })
      .catch(err => console.error('Error fetching reports:', err))
  }, [])

  // Create reports from saved reports and patient reports
  const mockReports: PDFReport[] = useMemo(() => {
    // First, add saved clinic reports (these don't have patient info)
    const clinicReports: PDFReport[] = savedReports.map((report, index) => {
      const contentLength = report.content?.length || 0
      const sizeInKB = Math.round(contentLength / 1024)
      return {
        id: `saved-${report.id}`,
        patientId: 0,
        patientName: "Clinic Statistics",
        generatedDate: report.generatedAt,
        type: report.reportType as any,
        size: `${sizeInKB} KB`,
        status: "Generated" as const,
      }
    })

    // Calculate statistics for health reports
    const totalPatients = patients.length
    const genderDistribution = patients.reduce((acc, p) => {
      const gender = p.gender || 'Unknown'
      acc[gender] = (acc[gender] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const hivStatusDistribution = patients.reduce((acc, p) => {
      const status = p.hivStatus || 'Unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const patientsWithConditions = patients.filter(p => p.medicalConditions && p.medicalConditions.length > 0).length
    
    // Generate health statistics reports
    const healthReports: PDFReport[] = [
      {
        id: "overall-health-report",
        patientId: 0,
        patientName: "Overall Health Statistics",
        generatedDate: new Date().toISOString(),
        type: "Health Analysis",
        size: `${Math.round((totalPatients * 150) / 1024)} KB`,
        status: "Generated" as const,
      },
      {
        id: "gender-distribution-report",
        patientId: 0,
        patientName: "Gender Distribution Analysis",
        generatedDate: new Date(Date.now() - 1 * 86400000).toISOString(),
        type: "Medical Summary",
        size: `${Math.round((Object.keys(genderDistribution).length * 50) / 1024)} KB`,
        status: "Generated" as const,
      },
      {
        id: "hiv-status-report",
        patientId: 0,
        patientName: "HIV Status Overview",
        generatedDate: new Date(Date.now() - 2 * 86400000).toISOString(),
        type: "Visit Report",
        size: `${Math.round((Object.keys(hivStatusDistribution).length * 50) / 1024)} KB`,
        status: "Generated" as const,
      },
    ]

    return [...clinicReports, ...healthReports]
  }, [savedReports, patients])

  const filteredReports = useMemo(() => 
    mockReports.filter((report) =>
      report.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.type.toLowerCase().includes(searchQuery.toLowerCase())
    ), [searchQuery]
  )

  // Pagination calculations
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedReports = filteredReports.slice(startIndex, endIndex)

  // Reset to page 1 when search changes or adjust page if it exceeds total pages
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Generate PDF content as text (for demo purposes)
  const generatePDFContent = (report: PDFReport): string => {
    // Check if this is a saved report from the API
    if (report.id.startsWith('saved-')) {
      const savedReport = savedReports.find(r => `saved-${r.id}` === report.id)
      if (savedReport?.content) {
        return savedReport.content
      }
    }
    
    // Calculate statistics
    const totalPatients = patients.length
    const genderDistribution = patients.reduce((acc, p) => {
      const gender = p.gender || 'Unknown'
      acc[gender] = (acc[gender] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const hivStatusDistribution = patients.reduce((acc, p) => {
      const status = p.hivStatus || 'Unknown'
      acc[status] = (acc[status] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    const patientsWithConditions = patients.filter(p => p.medicalConditions && p.medicalConditions.length > 0).length
    const patientsWithAllergies = patients.filter(p => p.allergies && p.allergies.length > 0).length
    const patientsOnMedications = patients.filter(p => p.medications && p.medications.length > 0).length
    
    // Generate report content based on report ID
    if (report.id === "overall-health-report") {
      const allConditions = patients.flatMap(p => p.medicalConditions || [])
      const conditionFrequency = allConditions.reduce((acc, cond) => {
        acc[cond] = (acc[cond] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      const topConditions = Object.entries(conditionFrequency)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
      
      return `📊 OVERALL HEALTH STATISTICS REPORT
Generated on: ${formatDate(report.generatedDate)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CLINIC OVERVIEW:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Patients: ${totalPatients}

Health Management Statistics:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Patients with Chronic Conditions: ${patientsWithConditions} (${totalPatients > 0 ? Math.round((patientsWithConditions / totalPatients) * 100) : 0}%)
• Patients with Allergies: ${patientsWithAllergies} (${totalPatients > 0 ? Math.round((patientsWithAllergies / totalPatients) * 100) : 0}%)
• Patients on Medications: ${patientsOnMedications} (${totalPatients > 0 ? Math.round((patientsOnMedications / totalPatients) * 100) : 0}%)

Gender Distribution:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${Object.entries(genderDistribution).map(([gender, count]) => {
  const percentage = totalPatients > 0 ? Math.round((count / totalPatients) * 100) : 0
  return `• ${gender}: ${count} patients (${percentage}%)`
}).join('\n')}

HIV Status Distribution:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${Object.entries(hivStatusDistribution).map(([status, count]) => {
  const percentage = totalPatients > 0 ? Math.round((count / totalPatients) * 100) : 0
  return `• ${status}: ${count} patients (${percentage}%)`
}).join('\n')}

Most Common Chronic Conditions:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${topConditions.length > 0 
  ? topConditions.map(([condition, count]) => `• ${condition}: ${count} patients`).join('\n')
  : 'No conditions recorded'}

RECOMMENDATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Continue regular health monitoring for all patients
• Focus on preventive care for patients with chronic conditions
• Ensure proper medication adherence monitoring
• Maintain comprehensive health records

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report ID: ${report.id}
Generated: ${new Date(report.generatedDate).toLocaleString()}
`
    } else if (report.id === "gender-distribution-report") {
      return `👥 GENDER DISTRIBUTION ANALYSIS
Generated on: ${formatDate(report.generatedDate)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PATIENT DEMOGRAPHICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Patients: ${totalPatients}

Gender Distribution:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${Object.entries(genderDistribution)
  .sort((a, b) => b[1] - a[1])
  .map(([gender, count]) => {
    const percentage = totalPatients > 0 ? Math.round((count / totalPatients) * 100) : 0
    return `${gender}: ${count} patients (${percentage}%)`
  }).join('\n')}

ANALYSIS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${Object.entries(genderDistribution).length > 0 
  ? `The clinic serves a diverse patient population with ${Object.keys(genderDistribution).length} distinct gender categories.`
  : 'No gender data available.'}

Health Considerations by Gender:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${Object.entries(genderDistribution).map(([gender, count]) => {
  const genderPatients = patients.filter(p => (p.gender || 'Unknown') === gender)
  const withConditions = genderPatients.filter(p => p.medicalConditions && p.medicalConditions.length > 0).length
  const percentage = count > 0 ? Math.round((withConditions / count) * 100) : 0
  return `• ${gender}: ${withConditions} of ${count} patients have chronic conditions (${percentage}%)`
}).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report ID: ${report.id}
Generated: ${new Date(report.generatedDate).toLocaleString()}
`
    } else if (report.id === "hiv-status-report") {
      const hivPositive = (hivStatusDistribution['Positive'] || 0) + (hivStatusDistribution['Positive - On Treatment'] || 0)
      const hivNegative = hivStatusDistribution['Negative'] || 0
      
      return `🩺 HIV STATUS OVERVIEW REPORT
Generated on: ${formatDate(report.generatedDate)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

HIV STATUS DISTRIBUTION:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Patients: ${totalPatients}

Status Breakdown:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${Object.entries(hivStatusDistribution)
  .sort((a, b) => b[1] - a[1])
  .map(([status, count]) => {
    const percentage = totalPatients > 0 ? Math.round((count / totalPatients) * 100) : 0
    return `• ${status}: ${count} patients (${percentage}%)`
  }).join('\n')}

SUMMARY STATISTICS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• HIV Positive (Total): ${hivPositive} patients (${totalPatients > 0 ? Math.round((hivPositive / totalPatients) * 100) : 0}%)
• HIV Negative: ${hivNegative} patients (${totalPatients > 0 ? Math.round((hivNegative / totalPatients) * 100) : 0}%)
• Unknown/Not Tested: ${totalPatients - hivPositive - hivNegative} patients

CLINICAL RECOMMENDATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
${hivPositive > 0 ? `• ${hivPositive} HIV-positive patient${hivPositive !== 1 ? 's require' : ' requires'} regular monitoring:
  - CD4 count monitoring every 6 months
  - Viral load testing every 6 months
  - Adherence assessment and support
  - Opportunistic infection screening
  - STI screening and prevention counseling

` : ''}• Continue regular HIV testing and counseling for all patients
• Ensure proper treatment adherence for HIV-positive patients
• Monitor treatment efficacy and adjust as needed
• Provide comprehensive care including mental health support

PREVENTION RECOMMENDATIONS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Promote HIV prevention education
• Encourage regular testing for at-risk populations
• Provide PrEP counseling where appropriate
• Support treatment as prevention for HIV-positive patients

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Report ID: ${report.id}
Generated: ${new Date(report.generatedDate).toLocaleString()}
`
    } else {
      // Fallback for other reports
      return `Clinic Health Report
Generated by AI Chatbot

Report Information:
Report Name: ${report.patientName}
Report Type: ${report.type}
Generated Date: ${formatDate(report.generatedDate)}
Status: ${report.status}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This report was automatically generated by the healthcare AI system.
Data is based on current patient records and should be reviewed regularly.

Report ID: ${report.id}
Generated: ${new Date(report.generatedDate).toLocaleString()}
`
    }
  }

  // Create downloadable PDF blob
  const createPDFBlob = (content: string): Blob => {
    // Create a simple text-based PDF representation
    // In a real app, you'd use a library like jsPDF or pdfkit
    const pdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj
2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj
3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj
4 0 obj
<<
/Length ${content.length}
>>
stream
BT
/F1 12 Tf
100 700 Td
(${content.replace(/[()\\]/g, '\\$&')}) Tj
ET
endstream
endobj
5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj
xref
0 6
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000300 00000 n 
0000000500 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
600
%%EOF`

    return new Blob([pdfContent], { type: 'application/pdf' })
  }

  const handleViewPDF = (reportId: string) => {
    const report = mockReports.find(r => r.id === reportId)
    if (report) {
      setViewingReport(report)
    }
  }

  const handleDownloadPDF = (reportId: string) => {
    const report = mockReports.find(r => r.id === reportId)
    if (!report) return

    const content = generatePDFContent(report)
    const blob = createPDFBlob(content)
    
    // Create download link
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${report.patientName.replace(/\s+/g, '_')}_${report.type.replace(/\s+/g, '_')}_${report.id}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
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
              <p className="text-2xl font-bold text-white">{mockReports.length}</p>
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
                {mockReports.filter(r => new Date(r.generatedDate).getMonth() === new Date().getMonth()).length}
              </p>
              <p className="text-[10px] text-white/70 uppercase tracking-wider font-semibold">This Month</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Search Section */}
      <Card className="bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl p-6 border border-zinc-700/50 shadow-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
          <Input 
            placeholder="Search reports by patient name or type..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-12 h-12 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20" 
          />
        </div>
      </Card>

      {/* Reports List */}
      <div className="space-y-4">
        {paginatedReports.map((report) => (
          <Card
            key={report.id}
            className="group bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl p-6 border border-orange-500/40 shadow-2xl shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4 flex-1">
                {report.patientId > 0 ? (
                  <PatientAvatar 
                    patientId={report.patientId} 
                    gender={report.gender} 
                    patientName={report.patientName} 
                  />
                ) : (
                  <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md flex-shrink-0">
                    <FileText className="w-7 h-7 text-orange-400" />
                  </div>
                )}
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-orange-400">{report.patientName}</h3>
                    <Badge className="rounded-full bg-gradient-to-r from-orange-500/25 to-orange-600/15 text-orange-300 border border-orange-500/40 text-xs px-3 py-0.5">
                      {report.type}
                    </Badge>
                    <Badge className="rounded-full bg-gradient-to-r from-green-500/25 to-green-600/15 text-green-300 border border-green-500/40 text-xs px-3 py-0.5">
                      {report.status}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-white/70 mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-medium">{formatDate(report.generatedDate)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-orange-400" />
                      <span className="text-xs font-medium">{report.size}</span>
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
                    Download
                  </Button>
                </AnimatedButtonWrapper>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredReports.length === 0 && (
        <Card className="p-12 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10 text-center">
          <FileText className="w-16 h-16 text-orange-400/50 mx-auto mb-4" />
          <p className="text-lg font-semibold text-white/70">No reports found</p>
          <p className="text-sm text-white/50 mt-2">Try adjusting your search query</p>
        </Card>
      )}

      {/* Pagination */}
      {filteredReports.length > 0 && totalPages > 1 && (
        <Card className="p-4 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/70">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredReports.length)} of {filteredReports.length} reports
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-full bg-zinc-800/50 border border-zinc-700/50 text-white hover:bg-zinc-800 hover:border-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                size="sm"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`rounded-full transition-all ${
                          currentPage === page
                            ? "bg-orange-500 hover:bg-orange-600 text-white border border-orange-500/40"
                            : "bg-zinc-800/50 border border-zinc-700/50 text-white hover:bg-zinc-800 hover:border-orange-500/50"
                        }`}
                        size="sm"
                      >
                        {page}
                      </Button>
                    )
                  } else if (page === currentPage - 2 || page === currentPage + 2) {
                    return (
                      <span key={page} className="text-white/50 px-2">
                        ...
                      </span>
                    )
                  }
                  return null
                })}
              </div>

              <Button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-full bg-zinc-800/50 border border-zinc-700/50 text-white hover:bg-zinc-800 hover:border-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                size="sm"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
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
                  <h2 className="text-xl font-bold text-orange-400">{viewingReport.patientName}</h2>
                  <p className="text-sm text-white/70">{viewingReport.type} • {formatDate(viewingReport.generatedDate)}</p>
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
                    Download
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

            {/* PDF Viewer Content */}
            <div className="flex-1 overflow-auto p-6">
              <div className="bg-white rounded-2xl p-8 shadow-lg min-h-full">
                <div className="max-w-4xl mx-auto">
                  <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Medical Report</h1>
                    <p className="text-sm text-gray-600">Generated by AI Chatbot</p>
                    <div className="w-20 h-1 bg-orange-500 rounded-full mt-4"></div>
                  </div>

                  <div className="space-y-6 text-gray-800">
                    <section>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Patient Information</h2>
                      <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                        <div className="flex justify-between">
                          <span className="font-semibold">Patient Name:</span>
                          <span>{viewingReport.patientName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Report Type:</span>
                          <span>{viewingReport.type}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Generated Date:</span>
                          <span>{formatDate(viewingReport.generatedDate)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="font-semibold">Status:</span>
                          <Badge className="bg-green-500/10 text-green-700 border-green-500/30">{viewingReport.status}</Badge>
                        </div>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Report Summary</h2>
                      <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                        <p className="text-gray-700 leading-relaxed mb-4">
                          This is a comprehensive medical report generated by our AI-powered chatbot system.
                          The report contains detailed analysis of patient health records, visit history, and medical summaries.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          The AI system has analyzed the patient's medical history, visit patterns, and health data
                          to provide insights and recommendations for continued care.
                        </p>
                      </div>
                    </section>

                    <section>
                      <h2 className="text-xl font-bold text-gray-900 mb-4">Key Findings</h2>
                      <ul className="space-y-2 list-disc list-inside text-gray-700">
                        <li>Patient records have been reviewed and analyzed</li>
                        <li>Medical history has been compiled and verified</li>
                        <li>Recommendations have been generated based on AI analysis</li>
                        <li>Treatment patterns and outcomes have been documented</li>
                      </ul>
                    </section>

                    <section className="pt-6 border-t border-gray-200">
                      <p className="text-xs text-gray-500 text-center">
                        This report was automatically generated by the healthcare AI system and contains sensitive medical information.
                        Please handle with confidentiality.
                      </p>
                      <p className="text-xs text-gray-400 text-center mt-2">
                        Report ID: {viewingReport.id} • Generated: {new Date(viewingReport.generatedDate).toLocaleString()}
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
