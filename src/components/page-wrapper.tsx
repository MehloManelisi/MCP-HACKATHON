import type React from "react"
import { SidebarTrigger } from "./ui/sidebar"
import { Separator } from "./ui/separator"

interface PageWrapperProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function PageWrapper({ children, title, description }: PageWrapperProps) {
  return (
    <div className="min-h-screen bg-zinc-600">
      <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-zinc-800 bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 px-6">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-6" />
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white">{title}</h1>
          {description && <p className="text-sm text-white/70">{description}</p>}
        </div>
      </header>

      <main className="p-6 max-w-[96rem] mx-auto">
        {children}
      </main>
    </div>
  )
}

