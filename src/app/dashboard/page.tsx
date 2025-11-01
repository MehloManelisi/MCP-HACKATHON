import { SidebarTrigger } from "../../components/ui/sidebar"
import { DashboardStats } from "@/components/dashboard-stats"
import { PatientList } from "@/components/patient-list"
import { RecentActivity } from "@/components/recent-activity"
import { Separator } from "../../components/ui/separator"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex-1">
          <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">Welcome back! Here's what's happening today.</p>
        </div>
      </header>

      <main className="p-6">
        <DashboardStats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <PatientList />
          </div>
          <div>
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  )
}
