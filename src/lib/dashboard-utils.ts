import usersData from "@/data/users.json"
import { mockVisits } from "./mock-data"
import type { Visit } from "./types"

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

/**
 * Gets the last N recently added patients from the users data
 * @param limit - Number of patients to return (default: 4)
 * @returns Array of patients sorted by ID (highest = most recent)
 */
export function getRecentlyAddedPatients(limit: number = 4): User[] {
  return (usersData as User[])
    .sort((a, b) => b.id - a.id)
    .slice(0, limit)
}

/**
 * Gets the total number of patients from users.json
 * @returns Total count of patients
 */
export function getTotalPatients(): number {
  return (usersData as User[]).length
}

/**
 * Gets the number of visits that occurred today
 * @returns Count of visits today
 */
export function getVisitsToday(): number {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayEnd = new Date(today)
  todayEnd.setHours(23, 59, 59, 999)

  return mockVisits.filter((visit) => {
    const visitDate = new Date(visit.visit_date)
    return visitDate >= today && visitDate <= todayEnd
  }).length
}

/**
 * Gets the number of scheduled appointments
 * Note: This uses mock appointments data. In a real app, this would come from a database.
 * @returns Count of scheduled appointments
 */
export function getScheduledAppointments(): number {
  // Mock appointments - in production, this would come from a database
  // For now, we'll estimate based on patients who have recent visits
  // or use a simple calculation
  const recentVisits = mockVisits.filter((visit) => {
    const visitDate = new Date(visit.visit_date)
    const daysSince = (Date.now() - visitDate.getTime()) / (1000 * 60 * 60 * 24)
    return daysSince <= 30 && daysSince > 0
  })
  
  // Estimate: approximately 1 appointment per 3 recent visits
  return Math.max(0, Math.floor(recentVisits.length / 3))
}

/**
 * Gets the number of active cases (patients with recent visits or ongoing conditions)
 * @returns Count of active cases
 */
export function getActiveCases(): number {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const activePatientIds = new Set(
    mockVisits
      .filter((visit) => {
        const visitDate = new Date(visit.visit_date)
        return visitDate >= thirtyDaysAgo
      })
      .map((visit) => visit.patient_id)
  )

  return activePatientIds.size
}

/**
 * Calculates percentage change between two values
 * @param current - Current value
 * @param previous - Previous value
 * @returns Formatted percentage change string (e.g., "+12%", "-3%")
 */
export function calculatePercentageChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%"
  const change = ((current - previous) / previous) * 100
  const sign = change >= 0 ? "+" : ""
  return `${sign}${Math.round(change)}%`
}

/**
 * Gets dashboard statistics with calculated values
 * @returns Object containing all dashboard stats
 */
export function getDashboardStats() {
  const totalPatients = getTotalPatients()
  const visitsToday = getVisitsToday()
  const appointments = getScheduledAppointments()
  const activeCases = getActiveCases()

  // Calculate changes (mock previous values for demonstration)
  // In production, these would come from historical data
  const previousTotalPatients = Math.max(1, totalPatients - Math.floor(totalPatients * 0.12))
  const previousVisitsToday = Math.max(0, visitsToday - 5)
  const previousAppointments = Math.max(0, appointments + 3)
  const previousActiveCases = Math.max(1, activeCases - Math.floor(activeCases * 0.08))

  return {
    totalPatients: {
      value: totalPatients.toLocaleString(),
      change: calculatePercentageChange(totalPatients, previousTotalPatients),
      trend: "up" as const,
    },
    visitsToday: {
      value: visitsToday.toString(),
      change: calculatePercentageChange(visitsToday, previousVisitsToday),
      trend: visitsToday >= previousVisitsToday ? ("up" as const) : ("down" as const),
    },
    appointments: {
      value: appointments.toString(),
      change: calculatePercentageChange(appointments, previousAppointments),
      trend: appointments >= previousAppointments ? ("up" as const) : ("down" as const),
    },
    activeCases: {
      value: activeCases.toString(),
      change: calculatePercentageChange(activeCases, previousActiveCases),
      trend: "up" as const,
    },
  }
}

