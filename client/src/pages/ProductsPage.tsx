import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Lightbulb, Loader2 } from "lucide-react";
import type { Product, Category } from "@shared/schema";

export default function ProductsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [suggestionForm, setSuggestionForm] = useState({
    suggestedProductName: "",
    productDescription: "",
    suggestedCategory: "",
    userEmail: "",
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: products, isLoading: productsLoading} = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const { data: categories, isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const suggestionMutation = useMutation({
    mutationFn: async (data: typeof suggestionForm) => {
      const response = await fetch("/api/product-suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit suggestion");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Suggestion submitted!",
        description: "Thank you for your suggestion. We'll review it soon.",
      });
      setSuggestionForm({
        suggestedProductName: "",
        productDescription: "",
        suggestedCategory: "",
        userEmail: "",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit suggestion. Please try again.",
        variant: "destructive",
      });
    },
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

      {/* Products Grid - Responsive: 2 cols mobile, 2 cols tablet, 3 cols desktop, 4 cols large */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
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

      {/* Product Suggestion Section */}
      <Card className="bg-background/95 backdrop-blur-xl border-2 border-primary/20 shadow-xl">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Lightbulb className="w-8 h-8 text-primary" />
            <div>
              <CardTitle className="text-2xl sm:text-3xl">Don't see your item?</CardTitle>
              <CardDescription className="text-base mt-1">
                Suggest a product and we'll consider adding it to our inventory
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!suggestionForm.suggestedProductName.trim()) {
                toast({
                  title: "Product name required",
                  description: "Please enter a product name",
                  variant: "destructive",
                });
                return;
              }
              suggestionMutation.mutate(suggestionForm);
            }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Name */}
              <div className="space-y-2">
                <Label htmlFor="productName" className="text-base font-semibold">
                  Suggested Product Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="productName"
                  placeholder="e.g., Organic Mangoes"
                  value={suggestionForm.suggestedProductName}
                  onChange={(e) => setSuggestionForm({ ...suggestionForm, suggestedProductName: e.target.value })}
                  required
                  className="h-11"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-base font-semibold">
                  Category Suggestion
                </Label>
                <Input
                  id="category"
                  placeholder="e.g., Fruits, Vegetables"
                  value={suggestionForm.suggestedCategory}
                  onChange={(e) => setSuggestionForm({ ...suggestionForm, suggestedCategory: e.target.value })}
                  className="h-11"
                />
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-semibold">
                Product Description/Details
              </Label>
              <Textarea
                id="description"
                placeholder="Tell us more about the product you'd like to see..."
                value={suggestionForm.productDescription}
                onChange={(e) => setSuggestionForm({ ...suggestionForm, productDescription: e.target.value })}
                rows={4}
                className="resize-none"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-base font-semibold">
                Your Email (Optional)
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={suggestionForm.userEmail}
                onChange={(e) => setSuggestionForm({ ...suggestionForm, userEmail: e.target.value })}
                className="h-11"
              />
              <p className="text-sm text-muted-foreground">
                We may contact you if we need more information about your suggestion
              </p>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full sm:w-auto"
              disabled={suggestionMutation.isPending}
            >
              {suggestionMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Submit Suggestion
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
