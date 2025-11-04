"use client"

import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
// import { AspectRatio } from "@/components/aspect-ratio";
// import { AppStoreButton, GooglePlayButton } from "@/components/app-store-buttons";
import { Card } from "@/components/ui/card";
// import LiveVideoPlayer from "@/components/strem-player/live-player";


export function HeroSection() {

	const [hasZoomed, setHasZoomed] = useState(false)
	const [showVideoCard, setShowVideoCard] = useState(false)
	const [isVideoCardVisible, setIsVideoCardVisible] = useState(false)
	const [isMobile, setIsMobile] = useState(false)

	useEffect(() => {
		// Check if mobile on mount and resize (tablets are considered mobile for this component)
		const checkMobile = () => {
			setIsMobile(window.innerWidth < 1536) // Include tablets including iPad Pro in mobile view (up to 2xl breakpoint)
		}

		checkMobile()
		window.addEventListener('resize', checkMobile)

		// Start zoom animation immediately when component mounts
		setHasZoomed(true)

		// Show video card after 1 second
		const videoTimer = setTimeout(() => {
			setShowVideoCard(true)
			setIsVideoCardVisible(true)
		}, 1000)

		return () => {
			clearTimeout(videoTimer)
			window.removeEventListener('resize', checkMobile)
		}
	}, [])

	const handleCloseVideoCard = () => {
		setIsVideoCardVisible(false)
		// Hide the card after animation completes
		setTimeout(() => {
			setShowVideoCard(false)
		}, 300)
	}

	return (
		<section className="bg-black relative min-h-screen flex items-center justify-center overflow-hidden">
			{/* Background Image */}
			<div
				className={`absolute inset-0 bg-no-repeat transition-transform duration-[4000ms] ease-out border-0 ${hasZoomed ? 'scale-100' : 'scale-[0.85]'
					}`}
				style={{
					backgroundImage: `url('/nurse2.png')`,
					backgroundPosition: isMobile ? 'right top' : 'right top',
					backgroundSize: isMobile ? '90% 100%' : '100% 100%',
					backgroundRepeat: 'no-repeat',
					width: '100%',
					height: isMobile ? '100vh' : '100%',
					minHeight: isMobile ? '100vh' : '100%',
				}}
			>
			</div>
			
			{/* Fading black overlay from left to right */}
			<div 
				className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-0"
			></div>

			{/* Content */}
			<div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 text-left">
				<div className="max-w-2xl mx-auto sm:mx-0 sm:ml-4 md:ml-6 lg:ml-8 xl:ml-12 2xl:ml-16">
					<h1 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight text-center sm:text-left">
						Welcome To AfyaLink{" "} <br />
						<span className="inline-block bg-gradient-to-r from-black via-orange-500 to-black bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_3s_ease-in-out_infinite]">
							AI-native solutions that make healthcare simpler
						</span>
					</h1>
					<p className="text-sm xs:text-base sm:text-lg md:text-xl text-gray-400 mb-4 sm:mb-6 leading-relaxed text-center sm:text-left max-w-xl">
						Empowering health facilities across Africa with secure digital health records, seamless cross-clinic sharing, and intelligent AI-powered insights to improve patient care and healthcare outcomes.
					</p>

					<div className="flex justify-center sm:justify-start">
						<div className="relative inline-block">
							{/* Animated border with breathing effect */}
							<div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full animate-pulse"></div>
							<div className="absolute -inset-0.5 bg-black rounded-full"></div>
							{/* Glowing effect */}
							<div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full opacity-30 blur-sm animate-ping"></div>
							<Button
								size="lg"
								className="relative bg-orange-500 hover:bg-orange-600 text-white px-3 xs:px-4 sm:px-6 md:px-8 py-2 xs:py-2.5 sm:py-3 text-xs xs:text-sm sm:text-base md:text-lg font-semibold rounded-full z-10 transform hover:scale-105 transition-all duration-300 animate-pulse hover:animate-none"
								onClick={() => { window.location.href = '/login' }}
							>
								Get Started
							</Button>
						</div>

					</div>

				</div>
			</div>
			{/* Video Card - Responsive positioning and sizing */}
			{showVideoCard && (
				<div
					// className={`hidden lg:block absolute right-4 xl:right-8 w-[250px] xl:w-[600px] z-10 transition-all duration-300 ease-out ${
					className={`hidden 2xl:block absolute bottom-4 left-4 right-4 md:bottom-auto md:right-6 md:left-auto lg:right-8 xl:right-10 w-auto md:w-[320px] lg:w-[400px] xl:w-[500px] 2xl:w-[600px] z-10 transition-all duration-300 ease-out mr-50 ${isVideoCardVisible
						? 'opacity-100 scale-100 translate-x-0'
						: 'opacity-0 scale-75 translate-x-24'
						}`}
					style={{
						animation: isVideoCardVisible ? 'slideInFromRight 1.5s ease-out' : 'none'
					}}
				>
					{/* <AspectRatio ratio={16 / 9}>
						<Card className="w-full h-full relative">
							<LiveVideoPlayer />
						</Card>
					</AspectRatio> */}
				</div>
			)}
			<div className="hidden absolute right-4 xl:right-8 w-[300px] xl:w-[700px] z-10">
				{/* <AspectRatio ratio={16 / 9}> */}
					<Card className="w-full h-full bg-black/80 border-green-400/20">
						<div className="w-full h-full relative flex items-center justify-center">
							{/* Live Stream Placeholder */}
							<div
								className="w-full h-full bg-cover bg-center bg-no-repeat relative"
								style={{
									backgroundImage: `url('/img/we are live.jpg')`
								}}
							>
								{/* Overlay for live indicator */}
								<div className="absolute top-2 xl:top-4 left-2 xl:left-4">
									<div className="flex items-center space-x-1 xl:space-x-2 bg-red-600 text-white px-2 xl:px-3 py-1 rounded-full text-xs xl:text-sm font-semibold">
										<div className="w-1.5 xl:w-2 h-1.5 xl:h-2 bg-white rounded-full animate-pulse"></div>
										<span>LIVE</span>
									</div>
								</div>

								{/* Play button overlay */}
								<div className="absolute inset-0 flex items-center justify-center">
									<Button
										size="lg"
										className="bg-green-500/90 hover:bg-green-600 text-white rounded-full w-12 h-12 xl:w-16 xl:h-16 p-0 transition-all duration-300 hover:scale-110"
									>
										<svg
											className="w-6 h-6 xl:w-8 xl:h-8 ml-0.5 xl:ml-1"
											fill="currentColor"
											viewBox="0 0 24 24"
										>
											<path d="M8 5v14l11-7z" />
										</svg>
									</Button>
								</div>
							</div>
						</div>
					</Card>
				{/* </AspectRatio> */}
			</div>

			{/* Scroll Indicator */}
			<div className={`absolute ${showVideoCard ? 'bottom-32 xs:bottom-36 sm:bottom-8' : 'bottom-4 sm:bottom-8'} left-1/2 transform -translate-x-1/2 animate-bounce transition-all duration-300`}>
				<div className="w-5 h-8 sm:w-6 sm:h-10 border-2 border-green-400 rounded-full flex justify-center">
					<div className="w-0.5 sm:w-1 h-2 sm:h-3 bg-green-400 rounded-full mt-1.5 sm:mt-2 animate-pulse"></div>
				</div>
			</div>
		</section>
	)
}
