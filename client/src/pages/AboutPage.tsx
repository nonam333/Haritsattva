import { Button } from "@/components/ui/button";
import { Leaf, Heart, Users } from "lucide-react";
import { Link } from "wouter";
import GlassCard from "@/components/GlassCard";

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section with Premium Glassmorphism */}
      <section className="relative bg-darkCharcoal py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80"
            alt="Fresh organic vegetables"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <GlassCard variant="strong" className="p-16">
            <div className="mb-8 flex justify-center">
              <img
                src="/logo.png"
                alt="Haritsattva"
                className="w-28 h-28 object-contain drop-shadow-2xl"
              />
            </div>
            <h1 className="text-5xl md:text-7xl font-heading font-bold text-white mb-8 tracking-tight leading-tight" data-testid="text-page-title">
              About <span className="text-neonMint">Haritsattva</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed">
              Haritsattva provides ultra-fresh, organic, and sustainably sourced produce,
              enhancing health, environmental sustainability, and community well-being.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Mission Section with Premium Cards */}
      <section className="max-w-7xl mx-auto px-6 py-28">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <GlassCard className="text-center p-12 hover:scale-105 transition-all duration-300 shadow-premium">
            <div className="w-20 h-20 bg-neonMint/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Leaf className="w-10 h-10 text-neonMint" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6 tracking-tight">Sustainability</h3>
            <p className="text-muted-foreground leading-relaxed">
              We partner with local organic farms that practice sustainable agriculture,
              reducing our carbon footprint and supporting eco-friendly farming methods.
            </p>
          </GlassCard>

          <GlassCard className="text-center p-12 hover:scale-105 transition-all duration-300 shadow-premium">
            <div className="w-20 h-20 bg-neonMint/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-10 h-10 text-neonMint" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6 tracking-tight">Health First</h3>
            <p className="text-muted-foreground leading-relaxed">
              Every piece of produce is handpicked at peak freshness, ensuring maximum
              nutritional value and exceptional taste for you and your family.
            </p>
          </GlassCard>

          <GlassCard className="text-center p-12 hover:scale-105 transition-all duration-300 shadow-premium">
            <div className="w-20 h-20 bg-neonMint/20 rounded-full flex items-center justify-center mx-auto mb-8">
              <Users className="w-10 h-10 text-neonMint" />
            </div>
            <h3 className="text-2xl font-heading font-bold text-foreground mb-6 tracking-tight">Community</h3>
            <p className="text-muted-foreground leading-relaxed">
              We believe in building strong relationships with local farmers and our
              customers, creating a community centered around healthy, sustainable living.
            </p>
          </GlassCard>
        </div>
      </section>

      {/* Our Story Section with Background Image */}
      <section className="relative bg-darkCharcoal py-28 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&q=80"
            alt="Organic farm background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto px-6">
          <GlassCard variant="strong" className="p-16">
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-white mb-12 text-center tracking-tight">
              Our <span className="text-neonMint">Story</span>
            </h2>
            <div className="space-y-8 text-white/90 leading-relaxed text-lg">
              <p>
                Haritsattva was founded with a simple mission: to make fresh, organic produce
                accessible to everyone while supporting sustainable farming practices. We
                recognized that many people wanted to eat healthier and support local farmers
                but struggled to find the time and resources to do so.
              </p>
              <p>
                Today, we work with a network of certified organic farms across the region,
                carefully selecting the finest fruits and vegetables. Our commitment to quality
                means that every item is inspected, handled with care, and delivered fresh to
                your doorstep within 24 hours of harvest.
              </p>
              <p>
                We're more than just a produce delivery service—we're a community of people
                passionate about healthy living, environmental stewardship, and supporting
                local agriculture. Join us in making a positive impact, one meal at a time.
              </p>
            </div>
            <div className="text-center mt-12">
              <Link href="/products">
                <Button size="lg" className="bg-neonMint hover:bg-neonMint/90 text-darkCharcoal font-bold px-12 py-6 text-lg shadow-premium glow-neon-strong" data-testid="button-shop-now">
                  Shop Now
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </section>
    </div>
  );
}
