"use client"

import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"

export function AboutSection() {
	const [displayText, setDisplayText] = useState("")
	const fullText = "About AfyaLink"
	const [currentIndex, setCurrentIndex] = useState(0)
	const [isVisible, setIsVisible] = useState(true)
	const [isMobile, setIsMobile] = useState(false)
	const router = useRouter()

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true)
					setDisplayText("")
					setCurrentIndex(0)
				} else {
					// keep running when out of view
				}
			},
			{ threshold: 0.3 }
		)

		const element = document.getElementById('about-section')
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

	return (
		<section id="about-section" className="py-16 md:py-20 lg:py-24 relative overflow-hidden bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/hero.jpg')" }}>
			<div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
					{/* Content */}
					<div className="lg:order-1">
						<h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
							{displayText}
							<span className="animate-pulse">|</span>
						</h2>

						<p className="text-lg text-black mb-6 leading-relaxed">
							AfyaLink is a digital health record platform designed to connect rural clinics across Africa through a shared, secure, and AI-assisted patient management system.
						</p>

						<p className="text-lg text-zinc-900 mb-8 leading-relaxed">
							Built for health facilities with limited resources, AfyaLink replaces paper-based files with a lightweight web app that allows healthcare workers to register, track, and share patient health records — using just a phone number, full name or national ID.
						</p>

						<div className="relative inline-block">
							{/* Animated border with breathing effect */}
							<div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"></div>
							<div className="absolute -inset-0.5 bg-black rounded-full"></div>
							{/* Glowing effect */}
							<div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full opacity-30 blur-sm animate-ping"></div>
							<Button
								size="lg"
								className="relative bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 font-semibold rounded-full z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none"
								onClick={() => router.push('/about-us')}
							>
								Read More
							</Button>
						</div>
					</div>

					{/* Team Photo - Right Side */}
					{/* <div className="lg:order-2">
						<div className="relative">
							<img
								src="/radio-team-group-photo-professional-studio.jpg"
								alt="The Voice Lounge Team"
								className="w-full h-96 object-cover rounded-lg"
							/>
						</div>
					</div> */}
				</div>
			</div>
		</section>
	)
}