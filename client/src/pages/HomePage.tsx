import Hero from "@/components/Hero";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Leaf, Truck, Sparkles } from "lucide-react";
import { Link } from "wouter";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";

// Product images
import bellPepperImage from "@assets/generated_images/Red_bell_pepper_product_a9d38c02.png";
import carrotImage from "@assets/generated_images/Carrots_and_broccoli_product_46d36f44.png";
import broccoliImage from "@assets/generated_images/Fresh_broccoli_product_37d74546.png";
import avocadoImage from "@assets/generated_images/Halved_avocado_product_8a3a377a.png";

export default function HomePage() {
  const productsSection = useScrollAnimation();
  const whyChooseSection = useScrollAnimation();

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

  const features = [
    {
      icon: Leaf,
      title: "100% Organic",
      description: "All our produce is certified organic and sustainably sourced",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Fresh produce delivered to your doorstep within 24 hours",
    },
    {
      icon: Sparkles,
      title: "Premium Quality",
      description: "Handpicked produce ensuring the highest quality standards",
    },
  ];

  return (
    <div>
      <Hero />

      {/* Featured Products Section */}
      <section
        ref={productsSection.ref}
        className="max-w-7xl mx-auto px-6 py-24 transition-all duration-1000"
        style={{
          opacity: productsSection.isVisible ? 1 : 0,
          transform: productsSection.isVisible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <div className="flex items-center justify-between mb-12 flex-wrap gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2" data-testid="text-products-title">
              Featured Products
            </h2>
            <p className="text-muted-foreground text-lg">
              Fresh, organic produce handpicked for quality
            </p>
          </div>
          <Link href="/products">
            <Button variant="outline" size="lg" className="group shadow-sm hover:shadow-md transition-all" data-testid="button-view-all">
              View All Products
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredProducts.map((product, index) => (
            <div
              key={product.id}
              className="transition-all duration-700"
              style={{
                transitionDelay: `${index * 100}ms`,
                opacity: productsSection.isVisible ? 1 : 0,
                transform: productsSection.isVisible
                  ? "translateY(0)"
                  : "translateY(20px)",
              }}
            >
              <ProductCard {...product} />
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section
        ref={whyChooseSection.ref}
        className="bg-muted py-24 transition-all duration-1000"
        style={{
          opacity: whyChooseSection.isVisible ? 1 : 0,
          transform: whyChooseSection.isVisible ? "translateY(0)" : "translateY(40px)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground text-center mb-4">
            Why Choose Haritsattva?
          </h2>
          <p className="text-center text-muted-foreground mb-16 text-lg max-w-2xl mx-auto">
            We're committed to delivering the freshest organic produce while supporting sustainable farming practices
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="text-center transition-all duration-700"
                  style={{
                    transitionDelay: `${index * 150}ms`,
                    opacity: whyChooseSection.isVisible ? 1 : 0,
                    transform: whyChooseSection.isVisible
                      ? "translateY(0)"
                      : "translateY(20px)",
                  }}
                >
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 hover-elevate transition-all duration-300">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="bg-gradient-to-r from-primary/10 to-accent rounded-2xl p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Experience Fresh?
          </h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of happy customers who trust Haritsattva for their daily fresh produce needs
          </p>
          <Link href="/products">
            <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
              Start Shopping
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
