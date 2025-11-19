import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { useState, useEffect } from "react";
import heroImage1 from "@assets/generated_images/Hero_fresh_produce_plate_9c1578ca.png";
import heroImage2 from "@assets/generated_images/Fresh_tomatoes_product_d8a652a1.png";
import heroImage3 from "@assets/generated_images/Fresh_strawberries_product_3b6383f9.png";
import heroImage4 from "@assets/generated_images/Carrots_and_broccoli_product_46d36f44.png";

const heroImages = [heroImage1, heroImage2, heroImage3, heroImage4];

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
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-black to-gray-900">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImages[currentImageIndex]}
          alt="Fresh organic produce"
          className={`w-full h-full object-cover opacity-40 transition-opacity duration-500 ${
            isVisible ? "opacity-40" : "opacity-0"
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="mb-6 flex justify-center">
                      <img
                        src="/logo.png"
                        alt="Haritsattva"
                        className="w-24 h-24 object-contain filter invert(1)"
                      />        </div>
        <h1
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight"
          data-testid="text-hero-title"
        >
          Fresh & Organic
        </h1>
        <p
          className="text-base md:text-lg text-white/90 mb-8 max-w-2xl mx-auto"
          data-testid="text-hero-subtitle"
        >
          Premium quality fruits and vegetables delivered fresh to your doorstep.
          Sustainably sourced for a healthier you and a healthier planet.
        </p>
        <Link href="/products">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-base font-semibold rounded-lg group shadow-lg hover:shadow-xl transition-all duration-300"
            data-testid="button-shop-now"
          >
            Shop Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>

      {/* Carousel Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
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
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? "bg-white w-8"
                : "bg-white/50 hover:bg-white/75"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
