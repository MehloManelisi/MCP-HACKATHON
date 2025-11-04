import type React from "react"
import { cn } from "@/lib/utils"

interface AnimatedButtonWrapperProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedButtonWrapper({ children, className }: AnimatedButtonWrapperProps) {
  return (
    <div className={cn("relative inline-block", className)}>
      {/* Animated border with breathing effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"></div>
      <div className="absolute -inset-0.5 bg-zinc-900 rounded-full"></div>
      {/* Glowing effect */}
      <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full opacity-30 blur-sm animate-ping"></div>
      <div className="relative z-10">
        {children}
      </div>
    </div>
  )
}

