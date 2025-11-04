"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Alert, AlertDescription } from "../components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    // Simulate authentication (replace with real auth when Supabase is connected)
    setTimeout(() => {
      if (email && password) {
        // Store mock session
        localStorage.setItem(
          "afyalink_user",
          JSON.stringify({
            email,
            name: "Grace Wanjiku",
            clinic: "Kibera Community Clinic",
          }),
        )
        router.push("/dashboard")
      } else {
        setError("Please enter both Practitioner ID and password")
        setIsLoading(false)
      }
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

      <div className="space-y-2">
        <Label htmlFor="email" className="text-white">Practitioner's ID</Label>
        <Input
          id="email"
          type="text"
          placeholder="AFY-12345"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-11 text-white placeholder:text-white/50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-11 text-white placeholder:text-white/50"
        />
        <div className="flex justify-end pt-1">
          <button type="button" className="text-sm text-orange-500 hover:text-orange-400 font-medium transition-colors">
            Forgot password?
          </button>
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
              Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>
      </div>

      <div className="text-center text-sm text-white/70">
        Don't have an account?{" "}
        <Link href="/signup" className="text-orange-500 hover:text-orange-400 font-medium transition-colors">
          Sign up
        </Link>
      </div>
    </form>
  )
}
