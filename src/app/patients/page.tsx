"use client"

import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import usersData from "@/data/users.json"
import { Search, UserPlus, Phone, MapPin, Droplet, Activity, ChevronLeft, ChevronRight } from "lucide-react"
import { calculateAge } from "@/lib/utils"
import { PageWrapper } from "@/components/page-wrapper"
import { AnimatedButtonWrapper } from "@/components/animated-button-wrapper"
import { useState, memo, useMemo, useEffect } from "react"

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

const PatientAvatar = memo(function PatientAvatar({ patient }: { patient: User }) {
  const initials = patient.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-orange-500/25 via-orange-500/20 to-orange-600/15 flex items-center justify-center border-2 border-orange-500/40 shadow-xl shadow-orange-500/20 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-orange-500/30 transition-all duration-300">
      <span className="text-lg font-bold text-orange-300">
        {initials}
      </span>
    </div>
  )
})

function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5
  
  // Get all patients sorted by ID (highest = most recent)
  const allPatients = useMemo(() => {
    return (usersData as User[]).sort((a, b) => b.id - a.id)
  }, [])
  
  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) return allPatients
    
    const query = searchQuery.toLowerCase()
    return allPatients.filter(patient => 
      patient.name.toLowerCase().includes(query) ||
      patient.email.toLowerCase().includes(query) ||
      patient.phone.toLowerCase().includes(query) ||
      patient.address.toLowerCase().includes(query) ||
      (patient.bloodType && patient.bloodType.toLowerCase().includes(query)) ||
      (patient.medicalConditions && patient.medicalConditions.some(cond => cond.toLowerCase().includes(query)))
    )
  }, [allPatients, searchQuery])

  // Pagination calculations
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex)

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const totalPatients = useMemo(() => allPatients.length, [allPatients])

  return (
    <PageWrapper title="Patients" description="Manage and view all patient records">
    <div className="space-y-6">
      {/* Header with stats and action */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-2xl p-4 border border-orange-500/30">
            <div className="text-2xl font-bold text-white">{totalPatients}</div>
            <div className="text-xs text-white/70 uppercase tracking-wider">Total Patients</div>
          </div>
          {searchQuery && (
            <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-2xl p-4 border border-blue-500/30">
              <div className="text-2xl font-bold text-white">{filteredPatients.length}</div>
              <div className="text-xs text-white/70 uppercase tracking-wider">Filtered Results</div>
            </div>
          )}
          {!searchQuery && (
            <div className="bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-2xl p-4 border border-green-500/30">
              <div className="text-2xl font-bold text-white">{itemsPerPage}</div>
              <div className="text-xs text-white/70 uppercase tracking-wider">Per Page</div>
            </div>
          )}
        </div>
        <Link href="/patients/new">
          <AnimatedButtonWrapper>
            <Button className="relative bg-orange-500 hover:bg-orange-600 text-white rounded-full z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none font-semibold">
              <UserPlus className="w-4 h-4 mr-2" />
              New Patient
            </Button>
          </AnimatedButtonWrapper>
        </Link>
      </div>

      {/* Search Section */}
      <Card className="bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl p-6 border border-zinc-700/50 shadow-2xl">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-orange-400 w-5 h-5" />
          <Input 
            placeholder="Search patients by name, email, phone, address, blood type, or condition..." 
            className="pl-12 h-12 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </Card>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedPatients.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-white/70 text-lg">No patients found matching your search.</p>
          </div>
        ) : (
          paginatedPatients.map((patient) => (
            <Link key={patient.id} href={`/patients/${patient.id}`}>
              <Card className="group bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl p-4 border border-orange-500/40 shadow-2xl shadow-orange-500/10 transition-all duration-300 cursor-pointer h-full overflow-hidden">
                <div className="flex flex-col h-full">
                  {/* Patient Header */}
                  <div className="flex items-start gap-3 mb-3 pb-3 border-b border-zinc-700/50">
                    <div className="relative flex-shrink-0">
                      <PatientAvatar patient={patient} />
                      <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full border-2 border-zinc-900 shadow-lg scale-110 transition-transform duration-300"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-orange-400 mb-1 transition-colors leading-tight">
                        {patient.name}
                      </h3>
                      <div className="flex items-center gap-2 flex-wrap">
                        {patient.gender && (
                          <>
                            <Badge variant="outline" className="rounded-full border-zinc-700/60 bg-zinc-800/40 text-white/90 text-[10px] px-2 py-0.5 font-medium">
                              {patient.gender}
                            </Badge>
                            <div className="h-1 w-1 rounded-full bg-white/40"></div>
                          </>
                        )}
                        {patient.dateOfBirth && (
                          <span className="text-[10px] text-white/70 font-medium">
                            {calculateAge(patient.dateOfBirth)} years
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="space-y-2 flex-1">
                    <div className="group/info flex items-center gap-2.5 p-2.5 bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-xl border border-orange-500/30 transition-all duration-300 shadow-md shadow-orange-500/10">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md scale-110 transition-transform duration-300 flex-shrink-0">
                        <Phone className="w-3.5 h-3.5 text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5 font-semibold">Phone</div>
                        <span className="text-xs text-white font-semibold truncate block">{patient.phone}</span>
                      </div>
                    </div>
                    
                    <div className="group/info flex items-center gap-2.5 p-2.5 bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-xl border border-orange-500/30 transition-all duration-300 shadow-md shadow-orange-500/10">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md scale-110 transition-transform duration-300 flex-shrink-0">
                        <MapPin className="w-3.5 h-3.5 text-orange-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5 font-semibold">Location</div>
                        <span className="text-xs text-white font-semibold truncate block">{patient.address}</span>
                      </div>
                    </div>
                    
                    {patient.bloodType && (
                      <div className="group/info flex items-center gap-2.5 p-2.5 bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-xl border border-orange-500/30 transition-all duration-300 shadow-md shadow-orange-500/10">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md scale-110 transition-transform duration-300 flex-shrink-0">
                          <Droplet className="w-3.5 h-3.5 text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5 font-semibold">Blood Type</div>
                          <span className="text-xs text-white font-semibold">
                            {patient.bloodType}
                          </span>
                        </div>
                      </div>
                    )}

                    {patient.hivStatus && (
                      <div className="group/info flex items-center gap-2.5 p-2.5 bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-xl border border-orange-500/30 transition-all duration-300 shadow-md shadow-orange-500/10">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md scale-110 transition-transform duration-300 flex-shrink-0">
                          <Activity className="w-3.5 h-3.5 text-orange-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5 font-semibold">HIV Status</div>
                          <Badge className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            patient.hivStatus === 'Positive' 
                              ? 'bg-red-500/25 text-red-300 border-red-500/40' 
                              : 'bg-green-500/25 text-green-300 border-green-500/40'
                          } border`}>
                            {patient.hivStatus}
                          </Badge>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Medical Conditions */}
                  {patient.medicalConditions && patient.medicalConditions.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-zinc-700/50">
                      <div className="flex items-center gap-1.5 mb-1.5">
                        <div className="w-1 h-3 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                        <span className="text-[9px] text-white/50 uppercase tracking-wider font-semibold">Conditions</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {patient.medicalConditions.slice(0, 2).map((condition, idx) => (
                          <Badge key={idx} className="bg-gradient-to-r from-orange-500/25 to-orange-600/15 text-orange-300 border border-orange-500/40 rounded-full px-3 py-1 text-[10px] font-semibold shadow-lg shadow-orange-500/10">
                            {condition}
                          </Badge>
                        ))}
                        {patient.medicalConditions.length > 2 && (
                          <Badge className="bg-gradient-to-r from-zinc-700/50 to-zinc-800/50 text-white/70 border border-zinc-600/40 rounded-full px-3 py-1 text-[10px] font-semibold">
                            +{patient.medicalConditions.length - 2} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredPatients.length > 0 && totalPages > 1 && (
        <Card className="p-4 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
          <div className="flex items-center justify-between">
            <div className="text-sm text-white/70">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length} patients
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
    </div>
    </PageWrapper>
  )
}

export default memo(PatientsPage)
