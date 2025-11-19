import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/Hero_fresh_produce_plate_9c1578ca.png";

export default function Hero() {
  return (
    <section className="relative min-h-[600px] md:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-black to-gray-900">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Fresh organic produce"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        <h1
          className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight"
          data-testid="text-hero-title"
        >
          Fresh & Organic
        </h1>
        <p
          className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto"
          data-testid="text-hero-subtitle"
        >
          Premium quality fruits and vegetables delivered fresh to your doorstep.
          Sustainably sourced for a healthier you and a healthier planet.
        </p>
        <Link href="/products">
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold rounded-lg group"
            data-testid="button-shop-now"
          >
            Shop Now
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
      </div>
    </section>
  );
}
