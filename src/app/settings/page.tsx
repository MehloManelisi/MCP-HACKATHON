import { Card } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import { Badge } from "../../components/ui/badge"
import { User, Building2, Bell, Shield, Database } from "lucide-react"
import { mockClinic, mockUser } from "@/lib/mock-data"
import { PageWrapper } from "@/components/page-wrapper"
import { AnimatedButtonWrapper } from "@/components/animated-button-wrapper"

export default function SettingsPage() {
  return (
    <PageWrapper title="Settings" description="Manage your clinic and account settings">
    <div className="space-y-6">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
              <User className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Profile</h2>
              <p className="text-sm text-white/70">Personal information</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-white">Full Name</Label>
              <Input id="name" defaultValue={mockUser.full_name} className="rounded-3xl mt-2 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20" />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input id="email" type="email" defaultValue={mockUser.email} className="rounded-3xl mt-2 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20" />
            </div>
            <div>
              <Label className="text-white">Role</Label>
              <Badge className="mt-2 rounded-3xl bg-gradient-to-r from-orange-500/25 to-orange-600/15 text-orange-300 border border-orange-500/40">{mockUser.role}</Badge>
            </div>
            <AnimatedButtonWrapper className="w-full">
              <Button className="relative w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none font-semibold">
                Update Profile
              </Button>
            </AnimatedButtonWrapper>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-orange-500/20 to-orange-600/10 flex items-center justify-center border border-orange-500/30 shadow-md">
              <Building2 className="w-6 h-6 text-orange-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Clinic Info</h2>
              <p className="text-sm text-white/70">Clinic details</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="clinicName" className="text-white">Clinic Name</Label>
              <Input id="clinicName" defaultValue={mockClinic.name} className="rounded-3xl mt-2 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20" />
            </div>
            <div>
              <Label htmlFor="location" className="text-white">Location</Label>
              <Textarea id="location" defaultValue={mockClinic.location} className="rounded-3xl mt-2 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20" rows={3} />
            </div>
            <div>
              <Label htmlFor="phone" className="text-white">Contact Phone</Label>
              <Input id="phone" defaultValue={mockClinic.contact_phone} className="rounded-3xl mt-2 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20" />
            </div>
            <AnimatedButtonWrapper className="w-full">
              <Button className="relative w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none font-semibold">
                Update Clinic
              </Button>
            </AnimatedButtonWrapper>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-blue-500/20 to-blue-600/10 flex items-center justify-center border border-blue-500/30 shadow-md">
              <Bell className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Notifications</h2>
              <p className="text-sm text-white/70">Alert preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-3xl bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 border border-orange-500/30 shadow-md shadow-orange-500/10">
              <div>
                <p className="text-sm font-medium text-white">New Patients</p>
                <p className="text-xs text-white/70">Get notified of new registrations</p>
              </div>
              <Badge className="bg-gradient-to-r from-orange-500/25 to-orange-600/15 text-orange-300 border border-orange-500/40 rounded-3xl">On</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-3xl bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 border border-orange-500/30 shadow-md shadow-orange-500/10">
              <div>
                <p className="text-sm font-medium text-white">Appointments</p>
                <p className="text-xs text-white/70">Upcoming appointment reminders</p>
              </div>
              <Badge className="bg-gradient-to-r from-orange-500/25 to-orange-600/15 text-orange-300 border border-orange-500/40 rounded-3xl">On</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-3xl bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 border border-orange-500/30 shadow-md shadow-orange-500/10">
              <div>
                <p className="text-sm font-medium text-white">AI Summaries</p>
                <p className="text-xs text-white/70">New AI health insights</p>
              </div>
              <Badge className="bg-gradient-to-r from-orange-500/25 to-orange-600/15 text-orange-300 border border-orange-500/40 rounded-3xl">On</Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-6 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-purple-500/20 to-purple-600/10 flex items-center justify-center border border-purple-500/30 shadow-md">
              <Shield className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Security</h2>
              <p className="text-sm text-white/70">Password and authentication</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword" className="text-white">Current Password</Label>
              <Input id="currentPassword" type="password" className="rounded-3xl mt-2 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20" />
            </div>
            <div>
              <Label htmlFor="newPassword" className="text-white">New Password</Label>
              <Input id="newPassword" type="password" className="rounded-3xl mt-2 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20" />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
              <Input id="confirmPassword" type="password" className="rounded-3xl mt-2 bg-zinc-800/50 border-zinc-700/50 text-white placeholder:text-white/50 focus:border-orange-500/50 focus:ring-2 focus:ring-orange-500/20" />
            </div>
            <AnimatedButtonWrapper className="w-full">
              <Button className="relative w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none font-semibold">
                Change Password
              </Button>
            </AnimatedButtonWrapper>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-zinc-800/95 to-zinc-900/95 backdrop-blur-xl rounded-3xl border border-orange-500/40 shadow-2xl shadow-orange-500/10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-3xl bg-gradient-to-br from-pink-500/20 to-pink-600/10 flex items-center justify-center border border-pink-500/30 shadow-md">
              <Database className="w-6 h-6 text-pink-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Data & Privacy</h2>
              <p className="text-sm text-white/70">Manage your data</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-gradient-to-r from-orange-500/10 via-zinc-800/40 to-zinc-800/40 border border-orange-500/30 shadow-md shadow-orange-500/10">
              <p className="text-sm font-medium text-white mb-2">Database Status</p>
              <Badge className="bg-gradient-to-r from-orange-500/25 to-orange-600/15 text-orange-300 border border-orange-500/40 rounded-3xl">Connected</Badge>
              <p className="text-xs text-white/70 mt-2">Using mock data. Connect Supabase for production.</p>
            </div>
            <Button variant="outline" className="w-full rounded-3xl bg-zinc-800/50 border-zinc-700/50 text-white hover:bg-zinc-800 hover:border-orange-500/50">
              Export All Data
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-3xl text-red-400 border-red-500/50 hover:bg-red-500/20 hover:border-red-500 bg-zinc-800/50"
            >
              Delete All Data
            </Button>
          </div>
        </Card>
      </div>
    </div>
    </PageWrapper>
  )
}
