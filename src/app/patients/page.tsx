"use client"

import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Search, UserPlus, Phone, MapPin, Mail, ChevronLeft, ChevronRight, FileText } from "lucide-react"
import { PageWrapper } from "@/components/page-wrapper"
import { AnimatedButtonWrapper } from "@/components/animated-button-wrapper"
import { useState, useMemo, useEffect } from "react"
import usersData from "@/data/users.json"
import { getTotalPatients } from "@/lib/dashboard-utils"

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

const ITEMS_PER_PAGE = 6

function PatientAvatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-orange-500/25 via-orange-500/20 to-orange-600/15 flex items-center justify-center border-2 border-orange-500/40 shadow-xl shadow-orange-500/20 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-orange-500/30 transition-all duration-300">
      <span className="text-lg font-bold text-orange-300">{initials}</span>
    </div>
  )
}

export default function PatientsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const allPatients = (usersData as User[]).sort((a, b) => b.id - a.id)

  const filteredPatients = useMemo(() => {
    if (!searchQuery.trim()) {
      return allPatients
    }

    const query = searchQuery.toLowerCase()
    return allPatients.filter((patient) => {
      return (
        patient.name.toLowerCase().includes(query) ||
        patient.email.toLowerCase().includes(query) ||
        patient.phone.includes(query) ||
        patient.address.toLowerCase().includes(query)
      )
    })
  }, [allPatients, searchQuery])

  const totalPages = Math.ceil(filteredPatients.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex)

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(Math.max(1, Math.min(newPage, totalPages)))
  }

  return (
    <PageWrapper title="Patients" description="Manage and view all patient records">
      <div className="space-y-6">
        {/* Header with stats and action */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-2xl p-4 border border-orange-500/30">
              <div className="text-2xl font-bold text-white">{getTotalPatients()}</div>
              <div className="text-xs text-white/70 uppercase tracking-wider">Total Patients</div>
            </div>
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
              placeholder="Search patients by name, email, phone, or address..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-12 h-12 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20"
            />
          </div>
        </Card>

        {/* Patient Cards Grid */}
        {paginatedPatients.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedPatients.map((patient) => (
                <Link key={patient.id} href={`/patients/${patient.id}`}>
                  <Card className="group bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl p-4 border border-orange-500/40 shadow-2xl shadow-orange-500/10 transition-all duration-300 cursor-pointer h-full overflow-hidden hover:shadow-orange-500/20">
                    <div className="flex flex-col h-full">
                      {/* Patient Header */}
                      <div className="flex items-start gap-3 mb-3 pb-3 border-b border-zinc-700/50">
                        <div className="relative flex-shrink-0">
                          <PatientAvatar name={patient.name} />
                          <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full border-2 border-zinc-900 shadow-lg scale-110 transition-transform duration-300"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base font-bold text-orange-400 mb-1 transition-colors leading-tight">
                            {patient.name}
                          </h3>
                        </div>
                      </div>

                      {/* Patient Info */}
                      <div className="space-y-2 flex-1">
                        <div className="group/info flex items-center gap-2.5 p-2.5 bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-xl border border-orange-500/30 transition-all duration-300 shadow-md shadow-orange-500/10">
                          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md scale-110 transition-transform duration-300 flex-shrink-0">
                            <Mail className="w-3.5 h-3.5 text-orange-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5 font-semibold">Email</div>
                            <span className="text-xs text-white font-semibold truncate block">{patient.email}</span>
                          </div>
                        </div>

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
                            <div className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5 font-semibold">Address</div>
                            <span className="text-xs text-white font-semibold truncate block">{patient.address}</span>
                          </div>
                        </div>

                        {/* Health Information */}
                        {(patient.bloodType || patient.hivStatus || patient.medicalConditions) && (
                          <div className="group/info flex items-center gap-2.5 p-2.5 bg-gradient-to-r from-red-500/10 via-zinc-800/40 to-zinc-800/40 rounded-xl border border-red-500/30 transition-all duration-300 shadow-md shadow-red-500/10">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-red-500/20 to-red-600/10 flex items-center justify-center border border-red-500/30 shadow-md scale-110 transition-transform duration-300 flex-shrink-0">
                              <FileText className="w-3.5 h-3.5 text-red-400" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5 font-semibold">Health Info</div>
                              <div className="flex flex-wrap gap-1.5">
                                {patient.bloodType && (
                                  <span className="text-[10px] text-white/90 font-semibold">Blood: {patient.bloodType}</span>
                                )}
                                {patient.hivStatus && (
                                  <span className="text-[10px] text-white/90 font-semibold">HIV: {patient.hivStatus.split(' - ')[0]}</span>
                                )}
                                {patient.medicalConditions && patient.medicalConditions.length > 0 && (
                                  <span className="text-[10px] text-white/90 font-semibold">
                                    Conditions: {patient.medicalConditions.length}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="rounded-full bg-zinc-800/50 border-zinc-700/50 text-white hover:bg-zinc-800 hover:border-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Previous
                </Button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          onClick={() => handlePageChange(page)}
                          className={`rounded-full ${
                            currentPage === page
                              ? "bg-orange-500 hover:bg-orange-600 text-white"
                              : "bg-zinc-800/50 border-zinc-700/50 text-white hover:bg-zinc-800 hover:border-orange-500/50"
                          }`}
                        >
                          {page}
                        </Button>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return <span key={page} className="text-white/50">...</span>
                    }
                    return null
                  })}
                </div>

                <Button
                  variant="outline"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="rounded-full bg-zinc-800/50 border-zinc-700/50 text-white hover:bg-zinc-800 hover:border-orange-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            )}

            {/* Pagination Info */}
            <div className="text-center text-sm text-white/70">
              Showing {startIndex + 1} to {Math.min(endIndex, filteredPatients.length)} of {filteredPatients.length} patients
            </div>
          </>
        ) : (
          <Card className="bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl p-12 border border-orange-500/40 shadow-2xl">
            <div className="text-center">
              <p className="text-white/70 text-lg">No patients found</p>
              {searchQuery && (
                <p className="text-white/50 text-sm mt-2">
                  Try adjusting your search: "{searchQuery}"
                </p>
              )}
            </div>
          </Card>
        )}
      </div>
    </PageWrapper>
  )
}
