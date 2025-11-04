import { Card } from "../components/ui/card"
import { Users, Activity, Calendar, TrendingUp } from "lucide-react"

export function DashboardStats() {
  const stats = [
    {
      label: "Total Patients",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-[#10b981]",
      bgColor: "bg-[#10b981]/10",
    },
    {
      label: "Visits Today",
      value: "23",
      change: "+5%",
      trend: "up",
      icon: Activity,
      color: "text-[#3b82f6]",
      bgColor: "bg-[#3b82f6]/10",
    },
    {
      label: "Appointments",
      value: "18",
      change: "-3%",
      trend: "down",
      icon: Calendar,
      color: "text-[#f97316]",
      bgColor: "bg-[#f97316]/10",
    },
    {
      label: "Active Cases",
      value: "156",
      change: "+8%",
      trend: "up",
      icon: TrendingUp,
      color: "text-[#8b5cf6]",
      bgColor: "bg-[#8b5cf6]/10",
    },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.label} className="p-4 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10 transition-all duration-300">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
                <Icon className="w-5 h-5 text-orange-400" />
              </div>
              <span className={`text-[10px] font-semibold ${stat.trend === "up" ? "text-orange-400" : "text-red-400"}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-xl font-bold text-white">{stat.value}</p>
              <p className="text-[10px] text-white/70 mt-1 uppercase tracking-wider font-semibold">{stat.label}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
