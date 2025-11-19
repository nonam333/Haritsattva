import { Button } from "@/components/ui/button";
import { Leaf, Heart, Users } from "lucide-react";
import { Link } from "wouter";

export default function AboutPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-accent py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="text-page-title">
            About Haritsattva
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Haritsattva provides ultra-fresh, organic, and sustainably sourced produce,
            enhancing health, environmental sustainability, and community well-being.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Sustainability</h3>
            <p className="text-muted-foreground">
              We partner with local organic farms that practice sustainable agriculture,
              reducing our carbon footprint and supporting eco-friendly farming methods.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Health First</h3>
            <p className="text-muted-foreground">
              Every piece of produce is handpicked at peak freshness, ensuring maximum
              nutritional value and exceptional taste for you and your family.
            </p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-4">Community</h3>
            <p className="text-muted-foreground">
              We believe in building strong relationships with local farmers and our
              customers, creating a community centered around healthy, sustainable living.
            </p>
          </div>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="bg-muted py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Our Story
          </h2>
          <div className="space-y-6 text-muted-foreground leading-relaxed">
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
              <Button size="lg" data-testid="button-shop-now">
                Shop Now
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
