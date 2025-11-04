import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { PlatformsSection } from "@/components/platforms-section"
import { AboutSection } from "@/components/about-section"
import { FeaturesSection } from "@/components/features-section"
// import { ShowLineup } from "@/components/show-lineup"
import { Footer } from "@/components/footer"

export default function Page() {
    return (
        <main className="min-h-screen relative z-30">
            <Navigation />
            <HeroSection />
            <PlatformsSection />
            <AboutSection />
            <FeaturesSection />
            {/* <ShowLineup /> */}
            <Footer />
        </main>
    )
}

