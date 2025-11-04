import { DashboardStats } from "@/components/dashboard-stats"
import { PatientList } from "@/components/patient-list"
import { RecentActivity } from "@/components/recent-activity"
import { PageWrapper } from "@/components/page-wrapper"

export default function DashboardPage() {
  return (
    <PageWrapper title="Dashboard" description="Welcome back! Here's what's happening today.">
        <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-6">
        <div className="lg:col-span-2">
          <PatientList />
        </div>
        <div>
          <RecentActivity />
        </div>
      </div>
    </PageWrapper>
  )
}
