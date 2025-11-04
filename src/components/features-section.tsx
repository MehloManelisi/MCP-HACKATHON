"use client"

import { ArrowRight, LogIn, Search, FileText, Sparkles, Shield, Target, Server, Globe, Users, Brain, TrendingUp, LucideIcon } from "lucide-react"
import { useState, useEffect } from "react"

type Feature = {
    title: string
    image?: string
    description?: string
    steps?: Array<{ icon: LucideIcon; text: string }>
    vision?: Array<{ icon: LucideIcon; text: string }>
    flow?: Array<{ label: string; icon: string }>
    closing?: string
    showLearnMore?: boolean
    learnMoreLink?: string
}

export function FeaturesSection() {
    const [displayText, setDisplayText] = useState("")
    const fullText = "How It Works"
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setDisplayText("")
                    setCurrentIndex(0)
                } else {
                    // keep running
                }
            },
            { threshold: 0.3 }
        )

        const element = document.getElementById('features-section')
        if (element) {
            observer.observe(element)
        }

        return () => {
            if (element) {
                observer.unobserve(element)
            }
        }
    }, [])

    useEffect(() => {
        if (currentIndex < fullText.length) {
            const timeout = setTimeout(() => {
                setDisplayText(prev => prev + fullText[currentIndex])
                setCurrentIndex(prev => prev + 1)
            }, 100)

            return () => clearTimeout(timeout)
        }
    }, [currentIndex, fullText])

    const features: Feature[] = [
        {
            title: "🤖 How It Works",
            image: "/nurse.jpg",
            description: "AfyaLink's simple 4-step process",
            steps: [
                { icon: LogIn, text: "Clinic logs in securely" },
                { icon: Search, text: "Search or register a patient by ID" },
                { icon: FileText, text: "Add visit records or prescriptions" },
                { icon: Sparkles, text: "Click \"Summarize\" — AI generates a summary" }
            ],
            showLearnMore: false,
            learnMoreLink: "#"
        },
        {
            title: "🔐 Powered by MCP",
            image: "/tablet.jpg",
            description: "Model Context Protocol ensures privacy and accuracy",
            steps: [
                { icon: Shield, text: "Privacy — only relevant patient data used" },
                { icon: Target, text: "Accuracy — AI sees structured visit data only" },
                { icon: Server, text: "Local processing — open-source AI, low cost" }
            ],
            flow: [
                { label: "Clinic", icon: "🏥" },
                { label: "MCP", icon: "🔐" },
                { label: "AI Model", icon: "🤖" },
                { label: "Summary", icon: "📄" }
            ],
            showLearnMore: false,
            learnMoreLink: "#"
        },
        {
            title: "🌱 Vision",
            image: "/AI.jpg",
            description: "To build a connected, intelligent, and accessible healthcare network for every African community.",
            vision: [
                { icon: Globe, text: "Every patient's health history is available — instantly, anywhere" },
                { icon: Users, text: "Clinics collaborate instead of working in isolation" },
                { icon: Brain, text: "AI supports nurses and doctors in making informed, data-driven decisions" },
                { icon: TrendingUp, text: "Healthcare data empowers governments to plan better for citizens' needs" }
            ],
            closing: "AfyaLink isn't just a tool — it's a bridge connecting technology, healthcare, and humanity across Africa.",
            showLearnMore: false,
            learnMoreLink: "#"
        },
    ]

    return (
        <section id="features-section" className="py-20 bg-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {displayText}
                        <span className="animate-pulse">|</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className={`relative h-96 rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-500 shadow-2xl hover:shadow-orange-500/20 ${
                                feature.steps || feature.vision 
                                    ? 'bg-gradient-to-br from-zinc-800/95 via-zinc-900/95 to-zinc-800/95 border border-zinc-700/50 backdrop-blur-sm hover:border-orange-500/30' 
                                    : 'bg-gradient-to-br from-zinc-900/90 to-zinc-800/90 border border-zinc-700/30'
                            }`}
                        >
                            {!feature.steps && !feature.vision && (
                                <>
                                    <img
                                        src={feature.image}
                                        alt={feature.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent"></div>
                                    <div className="absolute inset-0 bg-gradient-to-br from-orange-500/0 via-transparent to-orange-500/0 group-hover:from-orange-500/5 group-hover:via-orange-500/2 group-hover:to-orange-500/5 transition-all duration-500"></div>
                                </>
                            )}

                            {/* Always visible title at bottom - moves to top on hover */}
                            <div className={`absolute ${feature.steps || feature.vision ? 'top-5' : 'bottom-5'} left-5 right-5 text-center ${!feature.steps && !feature.vision ? 'group-hover:bottom-auto group-hover:top-5' : ''} transition-all duration-500 z-20`}>
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:mb-4 drop-shadow-lg">{feature.title}</h3>
                            </div>

                            {/* Steps display for How It Works card */}
                            {feature.steps && (
                                <div className="absolute top-20 left-5 right-5 bottom-5 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/30 scrollbar-track-transparent">
                                    <div className="space-y-3">
                                        {feature.steps.map((step, stepIndex) => {
                                            const IconComponent = step.icon
                                            return (
                                                <div key={stepIndex} className="flex items-start gap-3 bg-gradient-to-r from-zinc-800/60 to-zinc-800/40 rounded-xl p-4 backdrop-blur-md border border-zinc-700/40 hover:border-orange-500/30 hover:bg-zinc-800/70 transition-all duration-300 shadow-lg hover:shadow-orange-500/10">
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center shadow-lg ring-2 ring-orange-500/20">
                                                        <IconComponent className="w-5 h-5 text-orange-400" />
                                                    </div>
                                                    <p className="text-sm text-white/95 leading-relaxed flex-1 font-medium">{step.text}</p>
                                                </div>
                                            )
                                        })}
                                        {/* Data Flow Visualization */}
                                        {feature.flow && (
                                            <div className="mt-5 pt-5 border-t border-zinc-700/50">
                                                <p className="text-xs text-orange-400/80 mb-4 font-bold uppercase tracking-wider">Data Flow</p>
                                                <div className="flex items-center justify-between gap-3">
                                                    {feature.flow.map((item, flowIndex) => (
                                                        <div key={flowIndex} className="flex items-center gap-2 flex-1">
                                                            <div className="flex flex-col items-center gap-2 flex-1">
                                                                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-zinc-700/60 to-zinc-800/60 flex items-center justify-center text-lg shadow-lg border border-zinc-600/50 hover:border-orange-500/30 transition-all duration-300">
                                                                    {item.icon}
                                                                </div>
                                                                <span className="text-xs text-white/90 text-center font-medium">{item.label}</span>
                                                            </div>
                                                            {feature.flow && flowIndex < feature.flow.length - 1 && (
                                                                <ArrowRight className="w-5 h-5 text-orange-500/70 flex-shrink-0 animate-pulse" />
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Vision display for Vision card */}
                            {feature.vision && (
                                <div className="absolute top-20 left-5 right-5 bottom-5 overflow-y-auto scrollbar-thin scrollbar-thumb-orange-500/30 scrollbar-track-transparent">
                                    <div className="space-y-3">
                                        {/* Main quote */}
                                        {feature.description && (
                                            <div className="bg-gradient-to-br from-orange-500/15 via-orange-500/10 to-transparent border border-orange-500/40 rounded-xl p-5 mb-5 shadow-xl backdrop-blur-sm">
                                                <p className="text-sm text-white/98 leading-relaxed italic text-center font-semibold">
                                                    "{feature.description}"
                                                </p>
                                            </div>
                                        )}
                                        {/* Vision points */}
                                        {feature.vision.map((item, visionIndex) => {
                                            const IconComponent = item.icon
                                            return (
                                                <div key={visionIndex} className="flex items-start gap-3 bg-gradient-to-r from-zinc-800/60 to-zinc-800/40 rounded-xl p-4 backdrop-blur-md border border-zinc-700/40 hover:border-orange-500/30 hover:bg-zinc-800/70 transition-all duration-300 shadow-lg hover:shadow-orange-500/10">
                                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/30 to-orange-600/20 flex items-center justify-center shadow-lg ring-2 ring-orange-500/20">
                                                        <IconComponent className="w-5 h-5 text-orange-400" />
                                                    </div>
                                                    <p className="text-sm text-white/95 leading-relaxed flex-1 font-medium">{item.text}</p>
                                                </div>
                                            )
                                        })}
                                        {/* Closing statement */}
                                        {feature.closing && (
                                            <div className="mt-5 pt-5 border-t border-zinc-700/50">
                                                <p className="text-xs text-white/85 leading-relaxed text-center italic font-medium">
                                                    {feature.closing}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Description appears on hover for regular cards */}
                            {feature.description && !feature.steps && !feature.vision && (
                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0 absolute bottom-5 left-5 right-5 text-center z-30">
                                    <div className="bg-gradient-to-br from-zinc-900/95 to-zinc-800/95 backdrop-blur-md rounded-xl p-5 border border-zinc-700/50 shadow-2xl">
                                        <p className="text-sm text-white/95 mb-4 max-w-md mx-auto leading-relaxed font-medium">{feature.description}</p>
                                        {feature.showLearnMore && (
                                            <a href={feature.learnMoreLink} className="inline-flex items-center text-orange-500 hover:text-orange-400 transition-colors font-semibold group/link">
                                                Learn more <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Call to Action Section */}
                <div className="text-center">
                    <p className="text-base text-gray-400 font-semibold">
                        Empowering healthcare across Africa
                    </p>
                </div>
            </div>
        </section>
    )
}

