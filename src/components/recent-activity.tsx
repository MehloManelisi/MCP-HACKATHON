import { Card } from "../components/ui/card"
import { Clock, UserPlus, Share2, Brain, Database, FileCheck } from "lucide-react"

export function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: "patient",
      icon: UserPlus,
      title: "New patient added",
      patient: "David Ochieng",
      time: "2 hours ago",
      iconColor: "text-blue-400",
    },
    {
      id: 2,
      type: "ai",
      icon: Brain,
      title: "AI summary generated",
      patient: "Grace Wanjiku",
      time: "4 hours ago",
      iconColor: "text-orange-400",
    },
    {
      id: 3,
      type: "share",
      icon: Share2,
      title: "Record shared",
      patient: "Faith Achieng",
      time: "1 day ago",
      iconColor: "text-green-400",
    },
    {
      id: 4,
      type: "sync",
      icon: Database,
      title: "Data synchronized",
      patient: "Multiple clinics",
      time: "2 days ago",
      iconColor: "text-purple-400",
    },
    {
      id: 5,
      type: "update",
      icon: FileCheck,
      title: "Patient record updated",
      patient: "John Kamau",
      time: "3 days ago",
      iconColor: "text-cyan-400",
    },
  ]

  return (
    <Card className="p-6 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
      <div className="flex items-center gap-2 mb-6">
        <Clock className="w-5 h-5 text-orange-400" />
        <h2 className="text-xl font-bold text-orange-400">Recent Activity</h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const Icon = activity.icon
          return (
            <div key={activity.id} className="flex gap-3 p-3 bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 rounded-2xl border border-orange-500/30 shadow-md shadow-orange-500/10">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md flex-shrink-0">
                <Icon className={`w-5 h-5 ${activity.iconColor}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{activity.title}</p>
                <p className="text-sm text-white/70 truncate">{activity.patient}</p>
                <p className="text-xs text-white/50 mt-1">{activity.time}</p>
              </div>
            </div>
          )
        })}
      </div>

      <button className="w-full mt-6 text-sm text-orange-400 hover:text-orange-300 font-semibold transition-colors">
        View all activity
      </button>
    </Card>
  )
}
