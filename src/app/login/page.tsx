import { LoginForm } from "@/components/login-form"
import { Heart } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#10b981] to-[#059669] p-12 flex-col justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <Heart className="w-7 h-7" fill="currentColor" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AfyaLink</h1>
            <p className="text-sm text-white/80">Rural Health Records</p>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-4xl font-bold leading-tight text-balance">
            Transforming Healthcare Access Across Africa
          </h2>
          <p className="text-lg text-white/90 leading-relaxed">
            Empowering rural clinics with AI-powered patient records, seamless cross-clinic sharing, and intelligent
            health insights.
          </p>

          <div className="grid grid-cols-3 gap-4 pt-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">10K+</div>
              <div className="text-sm text-white/80">Patients</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">50+</div>
              <div className="text-sm text-white/80">Clinics</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <div className="text-3xl font-bold">5</div>
              <div className="text-sm text-white/80">Countries</div>
            </div>
          </div>
        </div>

        <div className="text-sm text-white/60">Built for Africa, powered by AI</div>
      </div>

      {/* Right side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-surface">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-10 h-10 bg-[#10b981] rounded-xl flex items-center justify-center text-white">
              <Heart className="w-6 h-6" fill="currentColor" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">AfyaLink</h1>
              <p className="text-sm text-muted">Rural Health Records</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back</h2>
            <p className="text-muted">Sign in to access your clinic dashboard</p>
          </div>

          <LoginForm />
        </div>
      </div>
    </div>
  )
}
