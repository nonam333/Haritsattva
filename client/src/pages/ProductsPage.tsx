import { useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

// Product images
import bellPepperImage from "@assets/generated_images/Red_bell_pepper_product_a9d38c02.png";
import carrotImage from "@assets/generated_images/Carrots_and_broccoli_product_46d36f44.png";
import broccoliImage from "@assets/generated_images/Fresh_broccoli_product_37d74546.png";
import avocadoImage from "@assets/generated_images/Halved_avocado_product_8a3a377a.png";
import tomatoImage from "@assets/generated_images/Fresh_tomatoes_product_d8a652a1.png";
import strawberryImage from "@assets/generated_images/Fresh_strawberries_product_3b6383f9.png";

export default function ProductsPage() {
  //todo: remove mock functionality
  const [selectedCategory, setSelectedCategory] = useState("all");

  //todo: remove mock functionality
  const products = [
    { id: "1", name: "Bell Pepper", price: 3.99, category: "vegetables", imageUrl: bellPepperImage },
    { id: "2", name: "Carrot Bundle", price: 1.99, category: "vegetables", imageUrl: carrotImage },
    { id: "3", name: "Broccoli", price: 2.49, category: "vegetables", imageUrl: broccoliImage },
    { id: "4", name: "Avocado", price: 2.99, category: "fruits", imageUrl: avocadoImage },
    { id: "5", name: "Tomatoes", price: 4.99, category: "vegetables", imageUrl: tomatoImage },
    { id: "6", name: "Strawberries", price: 5.99, category: "fruits", imageUrl: strawberryImage },
  ];

  const categories = [
    { id: "all", label: "All Products" },
    { id: "fruits", label: "Fruits" },
    { id: "vegetables", label: "Vegetables" },
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-page-title">
        Our Products
      </h1>
      <p className="text-muted-foreground mb-8">
        Browse our selection of fresh, organic produce
      </p>

      {/* Category Filter */}
      <div className="flex gap-2 mb-8 flex-wrap">
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            onClick={() => setSelectedCategory(category.id)}
            data-testid={`button-category-${category.id}`}
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            {...product}
            onAddToCart={() => console.log(`Added ${product.name} to cart`)}
          />
        ))}
      </div>
    </div>
  );
}
