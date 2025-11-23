import GlassButton from "@/components/GlassButton";
import GlassCard from "@/components/GlassCard";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";

// Using Unsplash images for hero carousel
const heroImages = [
  "https://images.unsplash.com/photo-1610348725531-843dff563e2c?w=1920&q=80",
  "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1920&q=80",
  "https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=1920&q=80",
  "https://images.unsplash.com/photo-1579113800032-c38bd7635818?w=1920&q=80",
];

export default function Hero() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        setIsVisible(true);
      }, 500);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[600px] sm:min-h-[700px] lg:min-h-[800px] flex items-center justify-center overflow-hidden bg-darkCharcoal">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImages[currentImageIndex]}
          alt="Fresh organic produce"
          loading="eager"
          className={`w-full h-full object-cover transition-opacity duration-700 ${
            isVisible ? "opacity-50" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-darkCharcoal/70 via-darkCharcoal/50 to-darkCharcoal/80" />
      </div>

      {/* Glassmorphic Content Card */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-12 py-16 sm:py-20">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-6 sm:mb-8 flex justify-center">
            <img
              src="/logo.png"
              alt="Haritsattva"
              className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 object-contain filter drop-shadow-2xl"
            />
          </div>

          {/* Glassmorphic Card Container */}
          <GlassCard
            variant="strong"
            className="max-w-3xl mx-auto p-8 sm:p-12 lg:p-16 space-y-6 sm:space-y-8"
            hover={false}
          >
            {/* Massive Headline with Premium Typography */}
            <h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading font-bold text-white leading-tight tracking-tightest"
              data-testid="text-hero-title"
            >
              Fresh & Organic
              <span className="block text-neonMint mt-2">Delivered Fresh</span>
            </h1>

            {/* Subtitle with Better Spacing */}
            <p
              className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed"
              data-testid="text-hero-subtitle"
            >
              Premium quality fruits and vegetables delivered to your doorstep.
              <span className="block mt-2 text-neonMint/80 font-semibold">
                Sustainably sourced for a healthier you and planet.
              </span>
            </p>

            {/* Neon Mint CTA Button with Glow */}
            <div className="pt-4">
              <Link href="/products">
                <GlassButton
                  size="lg"
                  className="text-base sm:text-lg font-bold group"
                  data-testid="button-shop-now"
                >
                  Shop Now
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </GlassButton>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Carousel Indicators with Neon Mint Accent */}
      <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-20">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setIsVisible(false);
              setTimeout(() => {
                setCurrentImageIndex(index);
                setIsVisible(true);
              }, 300);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? "bg-neonMint w-8 sm:w-10 glow-neon"
                : "bg-white/30 w-2 hover:bg-white/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
