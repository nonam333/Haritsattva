import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import type { Product, Category } from "@shared/schema";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const { data: products, isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const categoryOptions = [
    { id: "all", label: "All Products" },
    ...(categories?.map((cat) => ({ id: cat.name.toLowerCase(), label: cat.name })) || []),
  ];

  const filteredProducts =
    selectedCategory === "all"
      ? products || []
      : products?.filter((p) => p.category.toLowerCase() === selectedCategory) || [];

  const isLoading = productsLoading || categoriesLoading;

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-16 text-center">
        <div className="text-muted-foreground">Loading products...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
      <div className="mb-8 sm:mb-12">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-3 sm:mb-4" data-testid="text-page-title">
          Our Products
        </h1>
        <p className="text-muted-foreground text-base sm:text-lg">
          Browse our selection of fresh, organic produce
        </p>
      </div>

      {/* Category Filter - Optimized for mobile */}
      <div className="flex gap-2 sm:gap-3 mb-8 sm:mb-12 flex-wrap">
        {categoryOptions.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="default"
            onClick={() => setSelectedCategory(category.id)}
            data-testid={`button-category-${category.id}`}
            className="shadow-sm hover:shadow-md transition-all text-sm sm:text-base px-3 sm:px-4 py-2 sm:py-2.5"
          >
            {category.label}
          </Button>
        ))}
      </div>

      {/* Products Grid - Responsive: 1 col mobile, 2 cols tablet, 3 cols desktop, 4 cols large */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={parseFloat(product.price.toString())}
              imageUrl={product.imageUrl}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No products available in this category
          </div>
        )}
      </div>
    </div>
  );
}
