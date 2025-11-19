import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Truck, Sparkles, ShoppingBag } from "lucide-react";
import heroImage from "@assets/generated_images/Hero_fresh_produce_plate_9c1578ca.png";
import { Link } from "wouter";

export default function LandingPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[550px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-black to-gray-900">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt="Fresh organic produce"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/50 to-black/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Welcome to Haritsattva
          </h1>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Premium organic fruits and vegetables delivered fresh to your doorstep.
            Join us today for a healthier tomorrow.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/login">
              <Button
                size="lg"
                className="shadow-lg hover:shadow-xl transition-all"
                data-testid="button-login"
              >
                Login
              </Button>
            </Link>
            <Link href="/signup">
              <Button
                size="lg"
                variant="outline"
                className="shadow-lg hover:shadow-xl transition-all"
              >
                Sign Up
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-16">
          Why Choose Us?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="hover-elevate transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Leaf className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">100% Organic</h3>
              <p className="text-muted-foreground">
                All our produce is certified organic and sustainably sourced from local farms
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Fast Delivery</h3>
              <p className="text-muted-foreground">
                Fresh produce delivered to your doorstep within 24 hours of harvest
              </p>
            </CardContent>
          </Card>

          <Card className="hover-elevate transition-all">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-xl mb-3">Premium Quality</h3>
              <p className="text-muted-foreground">
                Handpicked produce ensuring the highest quality standards every time
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-muted py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <ShoppingBag className="w-20 h-20 mx-auto mb-6 text-primary" />
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Sign up now to browse our collection of fresh, organic produce and start shopping
          </p>
          <Link href="/signup">
            <Button
              size="lg"
              className="shadow-lg hover:shadow-xl transition-all"
            >
              Sign Up Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
