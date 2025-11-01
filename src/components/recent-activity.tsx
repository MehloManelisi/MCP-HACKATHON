import { Card } from "../components/ui/card"
import { Clock, FileText, UserPlus, Share2 } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "visit",
      icon: FileText,
      title: "New visit recorded",
      patient: "Amina Mwangi",
      time: "2 hours ago",
      color: "text-[#10b981]",
      bgColor: "bg-[#10b981]/10",
    },
    {
      id: 2,
      type: "patient",
      icon: UserPlus,
      title: "New patient added",
      patient: "David Ochieng",
      time: "5 hours ago",
      color: "text-[#3b82f6]",
      bgColor: "bg-[#3b82f6]/10",
    },
    {
      id: 3,
      type: "share",
      icon: Share2,
      title: "Record shared",
      patient: "Faith Achieng",
      time: "1 day ago",
      color: "text-[#f97316]",
      bgColor: "bg-[#f97316]/10",
    },
    {
      id: 4,
      type: "visit",
      icon: FileText,
      title: "Follow-up visit",
      patient: "John Kamau",
      time: "2 days ago",
      color: "text-[#10b981]",
      bgColor: "bg-[#10b981]/10",
    },
  ]

  return (
    <Card className="p-6 rounded-3xl border-border/50">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-muted-foreground" />
        <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex gap-3">
              <div
                className={`w-10 h-10 rounded-3xl ${activity.bgColor} flex items-center justify-center flex-shrink-0`}
              >
                <Icon className={`w-5 h-5 ${activity.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                <p className="text-sm text-muted-foreground truncate">{activity.patient}</p>
                <p className="text-xs text-muted-foreground/70 mt-1">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>

      <button className="w-full mt-6 text-sm text-[#10b981] hover:text-[#059669] font-medium transition-colors">
        View all activity
      </button>
    </Card>
  )
}
