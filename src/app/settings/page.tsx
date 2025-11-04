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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-3xl bg-[#10b981]/10 flex items-center justify-center">
              <User className="w-6 h-6 text-[#10b981]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Profile</h2>
              <p className="text-sm text-muted-foreground">Personal information</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" defaultValue={mockUser.full_name} className="rounded-3xl mt-2" />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" defaultValue={mockUser.email} className="rounded-3xl mt-2" />
            </div>
            <div>
              <Label>Role</Label>
              <Badge className="mt-2 rounded-3xl">{mockUser.role}</Badge>
            </div>
            <AnimatedButtonWrapper className="w-full">
              <Button className="relative w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none font-semibold">
                Update Profile
              </Button>
            </AnimatedButtonWrapper>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-3xl bg-[#f97316]/10 flex items-center justify-center">
              <Building2 className="w-6 h-6 text-[#f97316]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Clinic Info</h2>
              <p className="text-sm text-muted-foreground">Clinic details</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="clinicName">Clinic Name</Label>
              <Input id="clinicName" defaultValue={mockClinic.name} className="rounded-3xl mt-2" />
            </div>
            <div>
              <Label htmlFor="location">Location</Label>
              <Textarea id="location" defaultValue={mockClinic.location} className="rounded-3xl mt-2" rows={3} />
            </div>
            <div>
              <Label htmlFor="phone">Contact Phone</Label>
              <Input id="phone" defaultValue={mockClinic.contact_phone} className="rounded-3xl mt-2" />
            </div>
            <AnimatedButtonWrapper className="w-full">
              <Button className="relative w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none font-semibold">
                Update Clinic
              </Button>
            </AnimatedButtonWrapper>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-3xl bg-blue-500/10 flex items-center justify-center">
              <Bell className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Notifications</h2>
              <p className="text-sm text-muted-foreground">Alert preferences</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-3xl bg-muted">
              <div>
                <p className="text-sm font-medium text-foreground">New Patients</p>
                <p className="text-xs text-muted-foreground">Get notified of new registrations</p>
              </div>
              <Badge className="bg-[#10b981] text-white rounded-3xl">On</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-3xl bg-muted">
              <div>
                <p className="text-sm font-medium text-foreground">Appointments</p>
                <p className="text-xs text-muted-foreground">Upcoming appointment reminders</p>
              </div>
              <Badge className="bg-[#10b981] text-white rounded-3xl">On</Badge>
            </div>
            <div className="flex items-center justify-between p-4 rounded-3xl bg-muted">
              <div>
                <p className="text-sm font-medium text-foreground">AI Summaries</p>
                <p className="text-xs text-muted-foreground">New AI health insights</p>
              </div>
              <Badge className="bg-[#10b981] text-white rounded-3xl">On</Badge>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-3xl bg-purple-500/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Security</h2>
              <p className="text-sm text-muted-foreground">Password and authentication</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input id="currentPassword" type="password" className="rounded-3xl mt-2" />
            </div>
            <div>
              <Label htmlFor="newPassword">New Password</Label>
              <Input id="newPassword" type="password" className="rounded-3xl mt-2" />
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input id="confirmPassword" type="password" className="rounded-3xl mt-2" />
            </div>
            <AnimatedButtonWrapper className="w-full">
              <Button className="relative w-full bg-orange-500 hover:bg-orange-600 text-white rounded-full z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none font-semibold">
                Change Password
              </Button>
            </AnimatedButtonWrapper>
          </div>
        </Card>

        <Card className="p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-3xl bg-pink-500/10 flex items-center justify-center">
              <Database className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-foreground">Data & Privacy</h2>
              <p className="text-sm text-muted-foreground">Manage your data</p>
            </div>
          </div>
          <div className="space-y-4">
            <div className="p-4 rounded-3xl bg-muted">
              <p className="text-sm font-medium text-foreground mb-2">Database Status</p>
              <Badge className="bg-[#10b981] text-white rounded-3xl">Connected</Badge>
              <p className="text-xs text-muted-foreground mt-2">Using mock data. Connect Supabase for production.</p>
            </div>
            <Button variant="outline" className="w-full rounded-3xl bg-transparent">
              Export All Data
            </Button>
            <Button
              variant="outline"
              className="w-full rounded-3xl text-red-600 border-red-600 hover:bg-red-50 bg-transparent"
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
