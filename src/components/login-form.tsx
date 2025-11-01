"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
        setError("Please enter both email and password")
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
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="nurse@clinic.org"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-11"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button type="button" className="text-sm text-[#10b981] hover:text-[#059669] font-medium">
            Forgot password?
          </button>
        </div>
        <Input
          id="password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-11"
        />
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-11 bg-[#10b981] hover:bg-[#059669] text-white font-medium"
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

      <div className="text-center text-sm text-muted">Demo credentials: Any email and password</div>
    </form>
  )
}
