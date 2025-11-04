"use client"

import { useState, useEffect, useMemo } from "react"
import type React from "react"
import { Menu, X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
// import { SEARCH_DATA, type SearchItem } from "@/lib/search-data"
import { usePathname, useRouter } from "next/navigation"

type SearchItem = {
    href: string
    title: string
    subtitle?: string
}

type NavItem = {
    name: string
    href: string
    onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void
}

export function Navigation() {
    const [isNavVisible, setIsNavVisible] = useState(true)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [lastScrollY, setLastScrollY] = useState(0)
    const [activeSection, setActiveSection] = useState<string>("")
    // const [searchQuery, setSearchQuery] = useState("")
    // const results = useMemo(() => {
    //     const q = searchQuery.trim().toLowerCase()
    //     if (!q) return [] as SearchItem[]
    //     // return SEARCH_DATA.filter((item: SearchItem) =>
    //         [item.title, item.subtitle].filter(Boolean).some((text) =>
    //             (text || "").toLowerCase().includes(q)
    //         )
    //     ).slice(0, 8)
    // }, [searchQuery])
    const pathname = usePathname()
    const router = useRouter()

    const handleFeaturesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        setActiveSection("platforms-section")
        if (pathname === "/") {
            // Already on home page, scroll to section
            const element = document.getElementById("platforms-section")
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        } else {
            // Not on home page, navigate first then scroll
            router.push("/")
            // Wait for navigation, then scroll
            setTimeout(() => {
                const element = document.getElementById("platforms-section")
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" })
                    setActiveSection("platforms-section")
                }
            }, 100)
        }
    }

    const handleAboutUsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        setActiveSection("about-section")
        if (pathname === "/") {
            // Already on home page, scroll to section
            const element = document.getElementById("about-section")
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        } else {
            // Not on home page, navigate first then scroll
            router.push("/")
            // Wait for navigation, then scroll
            setTimeout(() => {
                const element = document.getElementById("about-section")
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" })
                    setActiveSection("about-section")
                }
            }, 100)
        }
    }

    const handleHowItWorksClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.preventDefault()
        setActiveSection("features-section")
        if (pathname === "/") {
            // Already on home page, scroll to section
            const element = document.getElementById("features-section")
            if (element) {
                element.scrollIntoView({ behavior: "smooth", block: "start" })
            }
        } else {
            // Not on home page, navigate first then scroll
            router.push("/")
            // Wait for navigation, then scroll
            setTimeout(() => {
                const element = document.getElementById("features-section")
                if (element) {
                    element.scrollIntoView({ behavior: "smooth", block: "start" })
                    setActiveSection("features-section")
                }
            }, 100)
        }
    }

    const navItems: NavItem[] = [
        { name: "HOME", href: "/" },
        { name: "FEATURES", href: "#platforms-section", onClick: handleFeaturesClick },
        { name: "HOW IT WORKS", href: "#features-section", onClick: handleHowItWorksClick },
        { name: "ABOUT US", href: "#about-section", onClick: handleAboutUsClick },
    ]

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.scrollY
            
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                // Scrolling down - hide navigation
                setIsNavVisible(false)
            } else if (currentScrollY < lastScrollY) {
                // Scrolling up - show navigation
                setIsNavVisible(true)
            }
            
            setLastScrollY(currentScrollY)
        }

        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [lastScrollY])

    // Track which section is in viewport
    useEffect(() => {
        if (pathname !== "/") return

        const sections = ["platforms-section", "features-section", "about-section"]
        const observerOptions = {
            root: null,
            rootMargin: "-20% 0px -70% 0px",
            threshold: 0
        }

        const observers: IntersectionObserver[] = []

        sections.forEach((sectionId) => {
            const element = document.getElementById(sectionId)
            if (!element) return

            const observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveSection(sectionId)
                    }
                })
            }, observerOptions)

            observer.observe(element)
            observers.push(observer)
        })

        // Also check on initial load
        const checkInitialSection = () => {
            const scrollPosition = window.scrollY + 200 // Offset for nav height
            sections.forEach((sectionId) => {
                const element = document.getElementById(sectionId)
                if (element) {
                    const rect = element.getBoundingClientRect()
                    const elementTop = rect.top + window.scrollY
                    const elementBottom = elementTop + rect.height

                    if (scrollPosition >= elementTop && scrollPosition < elementBottom) {
                        setActiveSection(sectionId)
                    }
                }
            })
        }

        checkInitialSection()

        return () => {
            observers.forEach((observer) => observer.disconnect())
        }
    }, [pathname])

    return (
        <div className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
            {/* Header Section - Hidden on mobile, visible on desktop when scrolling up */}
            <div className={`bg-black transition-all duration-300 hidden lg:block ${isNavVisible ? 'opacity-100 h-16 md:h-20' : 'opacity-0 h-0 overflow-hidden'}`}>
                <div className="max-w-8xl mx-auto px-2 sm:px-4 lg:px-8 ml-4">
                    <div className="relative flex items-center justify-between h-16 md:h-20">
                        {/* Left - Facebook Icon */}
                        <div className="flex items-center">
                            {/* Facebook icon removed */}
                        </div>

                        {/* Center - Logo */}
                        <div className="hidden lg:flex flex-col items-center absolute left-1/2 transform -translate-x-1/2">
                            <div className="flex items-center mb-1">
                                {/* Logo Image */}
                                <img 
                                    src="/logo.jpg" 
                                    alt="AfyaLink Logo" 
                                    className="h-12 md:h-16 w-auto rounded-lg"
                                />
                            </div>
                            {/* <div className="text-amber-200 text-xs font-semibold">THE</div>
                            <div className="flex items-center">
                                <span className="text-green-500 text-sm md:text-lg font-bold">VOICE</span>
                                <span className="text-amber-200 text-sm md:text-lg font-bold ml-1">LOUNGE</span>
                            </div> */}
                        </div>

                        {/* Right - Action Buttons */}
                        <div className="hidden sm:flex items-center space-x-2 md:space-x-3">
                            <div className="relative">
                                {/* Animated border */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"></div>
                                <div className="absolute -inset-0.5 bg-black rounded-full"></div>
                                <Button 
                                    variant="outline"
                                    className="relative bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-full group z-10"
                                    onClick={() => router.push('/login')}
                                >
                                    SIGN IN
                                </Button>
                            </div>
                            <Button 
                                className="bg-zinc-600 text-white hover:bg-zinc-700 rounded-full px-2 md:px-4 py-1 md:py-2 text-xs md:text-sm font-semibold flex items-center"
                                onClick={() => router.push('/signup')}
                            >
                                <span className="hidden lg:inline">SIGN UP</span>
                                <span className="lg:hidden">SIGN UP</span>
                            </Button>
                            {/* Profile Icon in Header */}
                            {/* <a
                                href="/profile"
                                className="p-2 rounded-full hover:bg-white/10 text-white cursor-pointer transition-colors"
                                title="Profile"
                                onClick={(e) => {
                                    console.log('Header profile icon clicked')
                                    console.log('Current pathname:', pathname)
                                    e.preventDefault()
                                    try {
                                        router.push('/profile')
                                        console.log('Header router.push called successfully')
                                    } catch (error) {
                                        console.error('Error with header router.push:', error)
                                        window.location.href = '/profile'
                                    }
                                }}
                            >
                                <User className="h-4 w-4 md:h-5 md:w-5" />
                            </a> */}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Bar - Always visible */}
            <nav className="bg-black border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
                    <div className="flex items-center justify-between h-14 md:h-16">
                        {/* Left - Hamburger Menu (Mobile Only) */}
                        <div className="flex items-center lg:hidden">
                            <Button
                                variant="ghost"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-white hover:text-white p-1"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </div>

                        {/* Center - Logo (Mobile) */}
                        <div className="flex items-center lg:hidden absolute left-1/2 transform -translate-x-1/2">
                            <div className="flex flex-col items-center">
                                <div className="flex items-center mb-1">
                                    <img 
                                        src="/logo.jpg" 
                                        alt="AfyaLink Logo" 
                                        className="h-12 w-auto rounded-lg"
                                    />
                                </div>
                                {/* <div className="text-amber-200 text-xs font-semibold">THE</div>
                                <div className="flex items-center">
                                    <span className="text-green-500 text-sm font-bold">VOICE</span>
                                    <span className="text-amber-200 text-sm font-bold ml-1">LOUNGE</span>
                                </div> */}
                            </div>
                        </div>

                        {/* Right - Stream Button (Mobile Only) */}
                        <div className="flex items-center lg:hidden">
                            <div className="relative">
                                {/* Animated border */}
                                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"></div>
                                <div className="absolute -inset-0.5 bg-black rounded-full"></div>
                                <Button 
                                    className="relative bg-orange-500 hover:bg-orange-600 text-white rounded-full px-2 py-0.5 text-xs font-semibold flex items-center z-10 h-6"
                                    onClick={() => router.push('/login')}
                                >
                                    SIGN IN
                                </Button>
                            </div>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="hidden lg:flex lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 z-10">
                            <div className="flex items-center space-x-4 xl:space-x-8">
                                {navItems.map((item) => {
                                    let isActive = false
                                    if (item.href === "/") {
                                        isActive = pathname === "/" && activeSection === ""
                                    } else if (item.href.startsWith("#")) {
                                        const sectionId = item.href.replace("#", "")
                                        isActive = pathname === "/" && activeSection === sectionId
                                    } else {
                                        isActive = pathname === item.href
                                    }
                                    return (
                                        <a
                                            key={item.name}
                                            href={item.href}
                                            onClick={item.onClick}
                                            className={`text-xs xl:text-sm font-semibold uppercase transition-colors relative text-white ${
                                                isActive 
                                                    ? 'text-orange-500 border-b-2 border-orange-500 pb-1' 
                                                    : 'hover:text-gray-300'
                                            }`}
                                        >
                                            {item.name}
                                        </a>
                                    )
                                })}
                            </div>
                        </div>

                        {/* Right - Search (Desktop) */}
                        {/* <div className="hidden md:flex items-center ml-auto relative z-30">
                            <form
                                className="relative w-48 lg:w-64"
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    const q = searchQuery.trim()
                                    if (q.length > 0) {
                                        router.push(`/?q=${encodeURIComponent(q)}`)
                                    } else {
                                        router.push('/')
                                    }
                                }}
                            >
                                <Search className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 md:h-5 md:w-5 text-gray-300" />
                                <Input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    aria-label="Search"
                                    className="pr-8 w-full bg-black/60 text-white placeholder:text-gray-400 border border-white/10 rounded-3xl"
                                />
                                {results.length > 0 && (
                                    <div className="absolute mt-2 left-0 right-0 bg-black/80 border border-white/10 rounded-xl overflow-hidden shadow-xl">
                                        <ul className="max-h-80 overflow-auto divide-y divide-white/5">
                                            {results.map((item: SearchItem, idx: number) => (
                                                <li key={idx}>
                                                    <a
                                                        href={item.href}
                                                        className="flex flex-col px-3 py-2 hover:bg-white/10 text-sm text-white"
                                                    >
                                                        <span className="font-semibold">{item.title}</span>
                                                        {item.subtitle && (
                                                            <span className="text-xs text-gray-300">{item.subtitle}</span>
                                                        )}
                                                    </a>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </form>
                        </div> */}
                    </div>

                </div>
            </nav>

            {/* Mobile Navigation Dropdown */}
            {isMenuOpen && (
                <div className="lg:hidden">
                    <div className="px-2 pt-2 pb-3 space-y-1 bg-black border-t border-gray-800">
                        {/* Close Button */}
                        <div className="flex justify-end mb-2">
                            <Button
                                variant="ghost"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-white hover:text-white p-1"
                            >
                                <X className="h-5 w-5" />
                            </Button>
                </div>

                        {/* Navigation Links */}
                            {navItems.map((item) => {
                                let isActive = false
                                if (item.href === "/") {
                                    isActive = pathname === "/" && activeSection === ""
                                } else if (item.href.startsWith("#")) {
                                    const sectionId = item.href.replace("#", "")
                                    isActive = pathname === "/" && activeSection === sectionId
                                } else {
                                    isActive = pathname === item.href
                                }
                                return (
                                    <a
                                        key={item.name}
                                        href={item.href}
                                        onClick={(e) => {
                                            setIsMenuOpen(false)
                                            if (item.onClick) {
                                                item.onClick(e)
                                            }
                                        }}
                                    className={`block px-3 py-2 text-sm font-semibold uppercase transition-colors ${
                                            isActive 
                                                ? 'text-orange-500 bg-orange-500/10 rounded border-l-4 border-orange-500' 
                                                : 'text-white hover:text-gray-300 hover:bg-white/5'
                                        }`}
                                    >
                                        {item.name}
                                    </a>
                                )
                            })}
                            
                        </div>
                    </div>
                )}
            </div>
    )
}
