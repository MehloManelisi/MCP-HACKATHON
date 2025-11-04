"use client"

import { SignupForm } from "@/components/signup-form"
import { Shield, Zap, Globe, TrendingUp, Users, FileText, Network, Brain, Lock, Smartphone, ArrowLeft } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export default function SignupPage() {
  return (
    <div className="min-h-screen flex bg-zinc-900 relative">
      {/* Back Button */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 z-50 flex items-center gap-2 text-white/70 hover:text-white transition-colors group"
      >
        <div className="w-10 h-10 rounded-full bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700/50 hover:border-orange-500/50 flex items-center justify-center transition-all group-hover:scale-110">
          <ArrowLeft className="w-5 h-5" />
        </div>
      </Link>
      {/* Left side - Branding with modern design */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        {/* Video background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'cover',
            transform: 'translateZ(0)',
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
          }}
        >
          <source src="/doctors.mp4" type="video/mp4" />
        </video>
        
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/70 to-black/60"></div>
        
        <div className="relative z-10 p-8 flex flex-col justify-between text-white w-full">
          {/* Logo and branding */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl overflow-hidden flex items-center justify-center shadow-lg shadow-orange-500/30 relative">
              <Image
                src="/logo.jpg"
                alt="AfyaLink Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">AfyaLink</h1>
              <p className="text-xs text-white/70">Rural Health Records</p>
            </div>
          </div>

          {/* Main content */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h2 className="text-3xl font-bold leading-tight text-balance bg-gradient-to-r from-white via-white to-white/90 bg-clip-text text-transparent">
                Transforming Healthcare Access Across Africa
              </h2>
              <p className="text-base text-white/80 leading-relaxed max-w-md">
                Empowering rural clinics with AI-powered patient records, seamless cross-clinic sharing, and intelligent
                health insights.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-3">
              <div className="group bg-gradient-to-br from-orange-500/20 via-black/40 to-black/60 backdrop-blur-md rounded-xl p-3 border border-orange-500/30 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/25 to-orange-600/15 flex items-center justify-center border border-orange-500/30 mb-2 shadow-md shadow-orange-500/10 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-semibold text-xs text-white mb-1.5 leading-tight">Digital Patient Records</h3>
                <p className="text-[11px] text-white/75 leading-relaxed">Create, update, and access patient records instantly from any device.</p>
              </div>

              <div className="group bg-gradient-to-br from-orange-500/20 via-black/40 to-black/60 backdrop-blur-md rounded-xl p-3 border border-orange-500/30 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/25 to-orange-600/15 flex items-center justify-center border border-orange-500/30 mb-2 shadow-md shadow-orange-500/10 group-hover:scale-110 transition-transform duration-300">
                  <Network className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-semibold text-xs text-white mb-1.5 leading-tight">Cross-Clinic Sharing</h3>
                <p className="text-[11px] text-white/75 leading-relaxed">Share patient data securely between clinics seamlessly.</p>
              </div>

              <div className="group bg-gradient-to-br from-orange-500/20 via-black/40 to-black/60 backdrop-blur-md rounded-xl p-3 border border-orange-500/30 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/25 to-orange-600/15 flex items-center justify-center border border-orange-500/30 mb-2 shadow-md shadow-orange-500/10 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-semibold text-xs text-white mb-1.5 leading-tight">AI-Powered Insights</h3>
                <p className="text-[11px] text-white/75 leading-relaxed">Get intelligent recommendations and alerts for better clinical decisions.</p>
              </div>

              <div className="group bg-gradient-to-br from-orange-500/20 via-black/40 to-black/60 backdrop-blur-md rounded-xl p-3 border border-orange-500/30 hover:border-orange-500/40 hover:shadow-lg hover:shadow-orange-500/10 transition-all duration-300">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/25 to-orange-600/15 flex items-center justify-center border border-orange-500/30 mb-2 shadow-md shadow-orange-500/10 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-5 h-5 text-orange-400" />
                </div>
                <h3 className="font-semibold text-xs text-white mb-1.5 leading-tight">Mobile Access</h3>
                <p className="text-[11px] text-white/75 leading-relaxed">Access patient records and manage care from any mobile device, anywhere.</p>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="flex items-center gap-4 pt-3 border-t border-zinc-700/50">
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs text-white/70">End-to-end encryption</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-orange-400" />
                <span className="text-xs text-white/70">HIPAA Compliant</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-white/50 flex items-center gap-2">
            <span>Built for Africa, powered by AI</span>
            <TrendingUp className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>

      {/* Right side - Sign Up Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-gradient-to-br from-zinc-900 to-zinc-800">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex items-center justify-center shadow-lg relative">
              <Image
                src="/logo.jpg"
                alt="AfyaLink Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover"
                unoptimized
              />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">AfyaLink</h1>
              <p className="text-sm text-white/70">Rural Health Records</p>
            </div>
          </div>

          {/* Sign up card */}
          <div className="bg-gradient-to-br from-orange-500/20 via-black/40 to-black/60 backdrop-blur-xl rounded-2xl p-8 border border-orange-500/30 shadow-2xl shadow-orange-500/20">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-white mb-2">Create your account</h2>
              <p className="text-white/70">Join AfyaLink and start managing patient records</p>
            </div>

            <SignupForm />
          </div>

          {/* Footer text */}
          <p className="text-center text-sm text-white/50 mt-6">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  )
}

