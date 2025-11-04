"use client"

import { Youtube, Facebook, Instagram, MessageCircle } from "lucide-react"
import Marquee from "@/components/Marquee"

export function Footer() {
    return (
        <>
            {/* Sticky Footer Container */}
            <div className="lg:fixed lg:bottom-0 lg:left-0 lg:right-0 lg:z-[-10]">
                {/* Top Section - Marquee */}
                <div className="bg-black z-10 lg:z-[-10]">
                    <Marquee />
                </div>

                {/* Divider Line */}
                <div className="border-t border-gray-600"></div>

                {/* Bottom Section - Contact & Social (Always visible) */}
                <div className="bg-black py-6 sm:py-8 md:py-12 relative z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 items-center">
                            {/* Left Column - Address */}
                            <div className="text-center md:text-left flex flex-col justify-center items-center md:items-start">
                                <p className="text-white text-sm sm:text-base md:text-lg">
                                    4 Steward Drive, Baysville,<br />
                                    East London,<br />
                                    5241
                                </p>
                            </div>

                            {/* Vertical Divider - Between Address and Copyright */}
                            <div className="hidden md:block absolute left-1/3 top-0 w-px h-full bg-gray-600 transform -translate-x-1/2"></div>

                            {/* Middle Column - Copyright & Contact */}
                            <div className="text-center space-y-1 sm:space-y-2">
                                <p className="text-white text-xs sm:text-sm">© The Voice Lounge. All Rights Reserved.</p>
                                <p className="text-white text-xs sm:text-sm">Info@thevoicelounge.co.za</p>
                                <p className="text-white text-xs sm:text-sm">043 050 6570</p>
                            </div>

                            {/* Vertical Divider - Between Copyright and Social Media */}
                            <div className="hidden md:block absolute left-2/3 top-0 w-px h-full bg-gray-600 transform -translate-x-1/2"></div>

                            {/* Right Column - Social Media & Chat */}
                            <div className="flex flex-col md:flex-row items-center justify-center space-y-3 sm:space-y-4 md:space-y-0 md:space-x-4 relative z-20">
                                {/* Social Media Icons */}
                                <div className="flex space-x-3 sm:space-x-4 relative z-20">
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
                                        <Youtube className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <div 
                                        className="w-8 h-8 sm:w-10 sm:h-10 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer"
                                        onClick={() => window.open('https://www.facebook.com/TheVoiceLoungeza', '_blank')}
                                    >
                                        <Facebook className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                    <div className="w-8 h-8 sm:w-10 sm:h-10 border border-white rounded-full flex items-center justify-center hover:bg-white hover:text-black transition-colors cursor-pointer">
                                        <Instagram className="h-4 w-4 sm:h-5 sm:w-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Spacer to prevent content from being hidden behind sticky footer */}
            <div className="h-0 lg:h-80 xl:h-96"></div>
        </>
    )
}
