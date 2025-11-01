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
          <Card key={stat.label} className="p-6 rounded-3xl border-border/50 hover:border-border transition-colors">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-3xl ${stat.bgColor} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${stat.color}`} />
              </div>
              <span className={`text-sm font-semibold ${stat.trend === "up" ? "text-[#10b981]" : "text-[#ef4444]"}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </Card>
        )
      })}
    </div>
  )
}
