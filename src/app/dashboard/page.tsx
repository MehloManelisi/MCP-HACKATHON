import { DashboardStats } from "@/components/dashboard-stats"
import { PatientList } from "@/components/patient-list"
import { RecentActivity } from "@/components/recent-activity"
import { PageWrapper } from "@/components/page-wrapper"
import { getDashboardStats, getRecentlyAddedPatients } from "@/lib/dashboard-utils"

export default function DashboardPage() {
  // Get dashboard statistics
  const stats = getDashboardStats()

  // Get the last 4 added patients for both components
  const recentlyAddedPatients = getRecentlyAddedPatients(4)

  return (
    <PageWrapper title="Dashboard" description="Welcome back! Here's what's happening today.">
        <DashboardStats
          totalPatients={stats.totalPatients}
          visitsToday={stats.visitsToday}
          appointments={stats.appointments}
          activeCases={stats.activeCases}
        />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2">
          <PatientList patients={recentlyAddedPatients} />
        </div>
        <div>
          <RecentActivity recentlyAddedPatients={recentlyAddedPatients} />
        </div>
      </div>
    </PageWrapper>
  )
}
