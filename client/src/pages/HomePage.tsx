import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";

// Product images
import bellPepperImage from "@assets/generated_images/Red_bell_pepper_product_a9d38c02.png";
import carrotImage from "@assets/generated_images/Carrots_and_broccoli_product_46d36f44.png";
import broccoliImage from "@assets/generated_images/Fresh_broccoli_product_37d74546.png";
import avocadoImage from "@assets/generated_images/Halved_avocado_product_8a3a377a.png";

export default function HomePage() {
  //todo: remove mock functionality
  const featuredProducts = [
    {
      id: "1",
      name: "Bell Pepper",
      price: 99.00,
      imageUrl: bellPepperImage,
    },
    {
      id: "2",
      name: "Carrot Bundle",
      price: 49.00,
      imageUrl: carrotImage,
    },
    {
      id: "3",
      name: "Broccoli",
      price: 65.00,
      imageUrl: broccoliImage,
    },
    {
      id: "4",
      name: "Avocado",
      price: 85.00,
      imageUrl: avocadoImage,
    },
  ];

  return (
    <div>
      <Hero />

      {/* Featured Products Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="text-products-title">
              Products
            </h2>
            <p className="text-muted-foreground">
              Fresh, organic produce handpicked for quality
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" className="group" data-testid="button-view-all">
              View All
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              {...product}
            />
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="bg-muted py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-12">
            Why Choose Haritsattva?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">100% Organic</h3>
              <p className="text-muted-foreground text-sm">
                All our produce is certified organic and sustainably sourced
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🚚</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground text-sm">
                Fresh produce delivered to your doorstep within 24 hours
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✨</span>
              </div>
              <h3 className="font-semibold text-lg mb-2">Premium Quality</h3>
              <p className="text-muted-foreground text-sm">
                Handpicked produce ensuring the highest quality standards
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
