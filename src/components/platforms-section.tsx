"use client"

import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"

export function PlatformsSection() {
    const [displayText, setDisplayText] = useState("")
    const fullText = "AfyaLink Features"
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

        const element = document.getElementById('platforms-section')
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
    const platforms = [
        {
            title: "Digital Files",
            image: "/nurse.jpg",
            description: "AfyaLink replaces paper files with secure, cloud-based digital folders. Each patient has a unique profile linked to their national ID or phone number, making it easy for healthcare workers to find and update patient information — anywhere, anytime.",
            showLearnMore: true,
            learnMoreLink: "/shows"
        },
        {
            title: "AI-Assisted Health Summary",
            image: "/tablet.jpg",
            description: "A built-in \"Health Summary\" feature uses AI (via the Model Context Protocol) to automatically summarize a patient's recent visits, symptoms, and prescriptions in plain English — saving time and reducing human error.",
            showLearnMore: true,
            learnMoreLink: "/podcasts"
        },
        {
            title: "Model Context Protocol (MCP) Integration",
            image: "/AI.jpg",
            description: "AfyaLink uses the Model Context Protocol to ensure the AI only accesses relevant and authorized data. Protects patient privacy. Limits model access to specific patient records. Keeps all processing within the African data environment. This makes AfyaLink AI-smart and privacy-safe.",
            showLearnMore: true,
            learnMoreLink: "/recording-studio"
        },
    ]

    return (
        <section id="platforms-section" className="py-20 bg-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                        {displayText}
                        <span className="animate-pulse">|</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                    {platforms.map((platform, index) => (
                        <div
                            key={index}
                            className="relative h-80 rounded-lg overflow-hidden group hover:scale-105 transition-all duration-300"
                        >
                            <img
                                src={platform.image}
                                alt={platform.title}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>

                            {/* Always visible title at bottom - moves to top on hover */}
                            <div className="absolute bottom-4 left-4 right-4 text-center group-hover:bottom-auto group-hover:top-4 transition-all duration-300">
                                <h3 className="text-2xl font-bold text-white mb-2 group-hover:mb-4">{platform.title}</h3>
                            </div>

                            {/* Description appears on hover */}
                            {platform.description && (
                                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-4 group-hover:translate-y-0 absolute bottom-4 left-4 right-4 text-center">
                                    <p className="text-sm text-white/90 mb-4 max-w-md mx-auto">{platform.description}</p>
                                    {platform.showLearnMore && (
                                        <a href={platform.learnMoreLink} className="inline-flex items-center text-orange-500 hover:text-orange-600 transition-colors">
                                            Learn more <ArrowRight className="ml-2 h-4 w-4" />
                                        </a>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Call to Action Section */}
                <div className="text-center">
                    <p className="text-base text-gray-400 font-semibold">
                        Empowering Healthcare Facilities in Africa
                    </p>
                </div>
            </div>
        </section>
    )
}
