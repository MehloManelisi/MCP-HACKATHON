"use client"

import { Home, Users, Settings, FileText, LogOut, MessageSquare } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "../components/ui/sidebar"

const menuItems = [
  {
    title: "Chatbot",
    icon: MessageSquare,
    href: "/chatbot",
  },
  {
    title: "Dashboard",
    icon: Home,
    href: "/dashboard",
  },
  {
    title: "Patients",
    icon: Users,
    href: "/patients",
  },
  {
    title: "Reports",
    icon: FileText,
    href: "/reports",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar className="bg-zinc-900/95 backdrop-blur supports-[backdrop-filter]:bg-zinc-900/60 border-r border-zinc-800">
      <SidebarHeader className="p-4 pb-2">
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-9 h-9 rounded-2xl overflow-hidden flex items-center justify-center shadow-lg shadow-orange-500/20 relative">
            <Image
              src="/logo.jpg"
              alt="AfyaLink Logo"
              width={36}
              height={36}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">AfyaLink</h2>
            <p className="text-[10px] text-white/70">Health Records</p>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator className="bg-zinc-800" />

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-3 px-2">Main Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href
                const isChatbot = item.href === "/chatbot"
                
                if (isChatbot) {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <div className="relative w-full">
                        <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl animate-pulse"></div>
                        <div className="absolute -inset-0.5 bg-zinc-900 rounded-2xl"></div>
                        <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl opacity-30 blur-sm animate-ping"></div>
                        <SidebarMenuButton 
                          asChild 
                          className="relative w-full rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-semibold z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none border-0 shadow-lg shadow-orange-500/20"
                        >
                          <Link href={item.href} className="gap-3 justify-center">
                            <item.icon className="w-4 h-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </div>
                    </SidebarMenuItem>
                  )
                }
                
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton 
                      asChild 
                      className={`rounded-2xl transition-all duration-300 ${
                        isActive 
                          ? "bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/40 text-orange-400 shadow-md shadow-orange-500/10" 
                          : "text-white/70 hover:bg-zinc-800/50 hover:text-white border border-transparent hover:border-orange-500/30"
                      }`}
                    >
                      <Link href={item.href} className="gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                          isActive 
                            ? "bg-gradient-to-br from-orange-500/30 to-orange-600/20 border border-orange-500/40 shadow-md" 
                            : "bg-zinc-800/50 border border-zinc-700/50"
                        }`}>
                          <item.icon className={`w-4 h-4 ${isActive ? "text-orange-400" : "text-white/70"}`} />
                        </div>
                        <span className="font-semibold">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="bg-zinc-700/50 my-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs text-white/50 uppercase tracking-wider font-semibold mb-3 px-2">Settings</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className={`rounded-2xl transition-all duration-300 ${
                    pathname === "/settings"
                      ? "bg-gradient-to-r from-orange-500/20 to-orange-600/10 border border-orange-500/40 text-orange-400 shadow-md shadow-orange-500/10" 
                      : "text-white/70 hover:bg-zinc-800/50 hover:text-white border border-transparent hover:border-orange-500/30"
                  }`}
                >
                  <Link href="/settings" className="gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      pathname === "/settings"
                        ? "bg-gradient-to-br from-orange-500/30 to-orange-600/20 border border-orange-500/40 shadow-md" 
                        : "bg-zinc-800/50 border border-zinc-700/50"
                    }`}>
                      <Settings className={`w-4 h-4 ${pathname === "/settings" ? "text-orange-400" : "text-white/70"}`} />
                    </div>
                    <span className="font-semibold">Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-zinc-700/50 p-4">
        <SidebarMenu>
          <SidebarMenuItem>
            <div className="relative w-full">
              <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl animate-pulse"></div>
              <div className="absolute -inset-0.5 bg-zinc-900 rounded-2xl"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-red-500 to-red-600 rounded-2xl opacity-30 blur-sm animate-ping"></div>
              <SidebarMenuButton 
                asChild 
                className="relative w-full rounded-2xl bg-red-500 hover:bg-red-600 text-white font-semibold z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none border-0 shadow-lg shadow-red-500/20"
              >
                <Link href="/login" className="gap-3 justify-center">
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </Link>
              </SidebarMenuButton>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
