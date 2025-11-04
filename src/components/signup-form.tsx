"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import Link from "next/link"

export function SignupForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [practitionerId, setPractitionerId] = useState("")
  const [clinicName, setClinicName] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const validatePractitionerId = (id: string): boolean => {
    // Format: AFY- followed by numbers (e.g., AFY-12345)
    const pattern = /^AFY-\d+$/i
    return pattern.test(id.trim())
  }

  const validateEmail = (email: string): boolean => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(email.trim())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    if (!validatePractitionerId(practitionerId)) {
      setError("Invalid Practitioner ID format. Please use format: AFY-12345")
      return
    }

    if (!clinicName.trim()) {
      setError("Please enter your clinic name")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setIsLoading(true)

    // Simulate registration (replace with real auth when Supabase is connected)
    setTimeout(() => {
      // Store mock session
      localStorage.setItem(
        "afyalink_user",
        JSON.stringify({
          email,
          name: fullName,
          clinic: clinicName,
        }),
      )
      router.push("/dashboard")
    }, 1000)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-white">Full Name</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="h-11 text-white placeholder:text-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-white">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="practitionerId" className="text-white">Practitioner's ID</Label>
          <Input
            id="practitionerId"
            type="text"
            placeholder="AFY-12345"
            value={practitionerId}
            onChange={(e) => setPractitionerId(e.target.value)}
            pattern="AFY-[0-9]+"
            title="Format: AFY- followed by numbers (e.g., AFY-12345)"
            required
            className="h-11 text-white placeholder:text-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="clinicName" className="text-white">Clinic Name</Label>
          <Input
            id="clinicName"
            type="text"
            placeholder="Your Clinic Name"
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            required
            className="h-11 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="password" className="text-white">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 text-white placeholder:text-white/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-white">Confirm Password</Label>
          <Input
            id="confirmPassword"
            type="password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="h-11 text-white placeholder:text-white/50"
          />
        </div>
      </div>

      <div className="relative inline-block w-full">
        {/* Animated border with breathing effect */}
        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"></div>
        <div className="absolute -inset-0.5 bg-zinc-900 rounded-full"></div>
        {/* Glowing effect */}
        <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full opacity-30 blur-sm animate-ping"></div>
        <Button
          type="submit"
          disabled={isLoading}
          className="relative w-full h-11 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-full z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating account...
            </>
          ) : (
            "Sign up"
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-white/70">
        Already have an account?{" "}
        <Link 
          href="/login" 
          className="text-orange-500 hover:text-orange-400 font-medium transition-colors"
          onClick={(e) => {
            e.preventDefault()
            router.push("/login")
          }}
        >
          Sign in
        </Link>
      </div>
    </form>
  )
}

