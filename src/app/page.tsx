import Link from "next/link"
import { Button } from "../components/ui/button"
import { Card } from "../components/ui/card"
import { Activity, Users, FileText, Brain, Shield, Globe } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-orange-50">
      {/* Hero Section */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-slate-900">AfyaLink</span>
          </div>
          <Link href="/login">
            <Button className="bg-emerald-600 hover:bg-emerald-700">Get Started</Button>
          </Link>
        </div>
      </header>

      {/* Hero Content */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold text-slate-900 text-balance">
            Transforming Rural Healthcare in <span className="text-emerald-600">Africa</span>
          </h1>
          <p className="text-xl text-slate-600 text-balance max-w-2xl mx-auto">
            AI-powered health records system connecting rural clinics, digitizing patient data, and providing
            intelligent health insights to save lives.
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Link href="/login">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
                Launch Dashboard
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <Card className="p-6 space-y-4 border-2 hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center">
              <Users className="w-6 h-6 text-emerald-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Patient Management</h3>
            <p className="text-slate-600">
              Comprehensive digital records for every patient with easy search and access across clinics.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-2 hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
              <FileText className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Visit Tracking</h3>
            <p className="text-slate-600">
              Record symptoms, diagnoses, treatments, and vital signs for complete medical history.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-2 hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-blue-100 flex items-center justify-center">
              <Brain className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">AI Health Summaries</h3>
            <p className="text-slate-600">
              Intelligent analysis of patient data with risk factors, trends, and personalized recommendations.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-2 hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-purple-100 flex items-center justify-center">
              <Globe className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Cross-Clinic Sharing</h3>
            <p className="text-slate-600">
              Securely share patient records between clinics for continuity of care across regions.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-2 hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <Shield className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Secure & Private</h3>
            <p className="text-slate-600">
              Enterprise-grade security with role-based access control to protect sensitive health data.
            </p>
          </Card>

          <Card className="p-6 space-y-4 border-2 hover:border-emerald-200 transition-colors">
            <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
              <Activity className="w-6 h-6 text-teal-600" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">Offline Ready</h3>
            <p className="text-slate-600">
              Works in low-connectivity areas with offline mode and automatic sync when online.
            </p>
          </Card>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-12 text-white">
          <h2 className="text-3xl font-bold text-center mb-12">Making an Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-5xl font-bold mb-2">10K+</div>
              <div className="text-emerald-100">Patients Registered</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-emerald-100">Clinics Connected</div>
            </div>
            <div>
              <div className="text-5xl font-bold mb-2">25K+</div>
              <div className="text-emerald-100">Visits Recorded</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl font-bold text-slate-900">Ready to Transform Healthcare?</h2>
          <p className="text-xl text-slate-600">
            Join the movement to digitize rural healthcare and improve patient outcomes across Africa.
          </p>
          <Link href="/login">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-lg px-8">
              Start Using AfyaLink
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-slate-50 py-8">
        <div className="container mx-auto px-4 text-center text-slate-600">
          <p>&copy; 2025 AfyaLink. Built for the African MCP Hackathon.</p>
        </div>
      </footer>
    </div>
  )
}
