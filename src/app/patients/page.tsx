"use client"

import Link from "next/link"
import { Button } from "../../components/ui/button"
import { Card } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Badge } from "../../components/ui/badge"
import { mockPatients } from "@/lib/mock-data"
import { Search, UserPlus, Phone, MapPin, Calendar } from "lucide-react"
import { calculateAge } from "@/lib/utils"
import { PageWrapper } from "@/components/page-wrapper"
import { AnimatedButtonWrapper } from "@/components/animated-button-wrapper"
import Image from "next/image"
import { useState, memo, useMemo } from "react"

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
function getPatientPhotoUrl(patientId: string, gender: string) {
  // Extract a numeric seed from patient ID
  const seed = patientId.replace(/-/g, '').slice(0, 10)
  const genderKey = gender === 'Female' ? 'women' : 'men'
  const photos = africanPhotos[genderKey]
  const photoIndex = parseInt(seed.slice(-2)) % photos.length
  return photos[photoIndex]
}

const PatientAvatar = memo(function PatientAvatar({ patient, index, gender }: { patient: { first_name: string; last_name: string; id: string }; index: number; gender: string }) {
  const [imageError, setImageError] = useState(false)
  const avatarUrl = useMemo(() => getPatientPhotoUrl(patient.id, gender), [patient.id, gender])

  if (imageError) {
    return (
      <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-orange-500/25 via-orange-500/20 to-orange-600/15 flex items-center justify-center border-2 border-orange-500/40 shadow-xl shadow-orange-500/20 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-orange-500/30 transition-all duration-300">
        <span className="text-lg font-bold text-orange-300">
          {patient.first_name[0]}
          {patient.last_name[0]}
        </span>
      </div>
    )
  }

  return (
    <div className="w-14 h-14 rounded-3xl bg-gradient-to-br from-orange-500/25 via-orange-500/20 to-orange-600/15 flex items-center justify-center border-2 border-orange-500/40 shadow-xl shadow-orange-500/20 group-hover:scale-110 group-hover:shadow-2xl group-hover:shadow-orange-500/30 transition-all duration-300 overflow-hidden relative">
      <Image
        src={avatarUrl}
        alt={`${patient.first_name} ${patient.last_name}`}
        width={56}
        height={56}
        className="w-full h-full object-cover rounded-3xl"
        onError={() => setImageError(true)}
        unoptimized
      />
    </div>
  )
})

function PatientsPage() {
  const totalPatients = useMemo(() => mockPatients.length, [])

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
            placeholder="Search patients by name, phone, or village..." 
            className="pl-12 h-12 rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20" 
          />
        </div>
      </Card>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockPatients.map((patient, index) => (
          <Link key={patient.id} href={`/patients/${patient.id}`}>
            <Card className="group bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl p-4 border border-orange-500/40 shadow-2xl shadow-orange-500/10 transition-all duration-300 cursor-pointer h-full overflow-hidden">
              <div className="flex flex-col h-full">
                {/* Patient Header */}
                <div className="flex items-start gap-3 mb-3 pb-3 border-b border-zinc-700/50">
                  <div className="relative flex-shrink-0">
                    <PatientAvatar patient={patient} index={index} gender={patient.gender} />
                    <div className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full border-2 border-zinc-900 shadow-lg scale-110 transition-transform duration-300"></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-bold text-orange-400 mb-1 transition-colors leading-tight">
                      {patient.first_name} {patient.last_name}
                    </h3>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant="outline" className="rounded-full border-zinc-700/60 bg-zinc-800/40 text-white/90 text-[10px] px-2 py-0.5 font-medium">
                        {patient.gender}
                      </Badge>
                      <div className="h-1 w-1 rounded-full bg-white/40"></div>
                      <span className="text-[10px] text-white/70 font-medium">
                        {calculateAge(patient.date_of_birth)} years
                      </span>
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
                      <span className="text-xs text-white font-semibold truncate block">{patient.village}</span>
                    </div>
                  </div>
                  
                  <div className="group/info flex items-center gap-2.5 p-2.5 bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-xl border border-orange-500/30 transition-all duration-300 shadow-md shadow-orange-500/10">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md scale-110 transition-transform duration-300 flex-shrink-0">
                      <Calendar className="w-3.5 h-3.5 text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] text-white/50 uppercase tracking-wider mb-0.5 font-semibold">Blood Type</div>
                      <span className="text-xs text-white font-semibold">
                        {patient.blood_type || "Unknown"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Chronic Conditions */}
                {patient.chronic_conditions && patient.chronic_conditions !== "None" && (
                  <div className="mt-3 pt-3 border-t border-zinc-700/50">
                    <div className="flex items-center gap-1.5 mb-1.5">
                      <div className="w-1 h-3 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
                      <span className="text-[9px] text-white/50 uppercase tracking-wider font-semibold">Condition</span>
                    </div>
                    <Badge className="bg-gradient-to-r from-orange-500/25 to-orange-600/15 text-orange-300 border border-orange-500/40 rounded-full px-3 py-1 text-[10px] font-semibold shadow-lg shadow-orange-500/10">
                      {patient.chronic_conditions}
                    </Badge>
                  </div>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
    </PageWrapper>
  )
}

export default memo(PatientsPage)
