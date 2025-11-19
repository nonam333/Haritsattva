import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  onAddToCart?: () => void;
}

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  onAddToCart,
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300 group" data-testid={`card-product-${id}`}>
      <Link href={`/product/${id}`}>
        <div className="aspect-square overflow-hidden bg-muted cursor-pointer">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            data-testid={`img-product-${id}`}
          />
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/product/${id}`}>
          <h3
            className="font-semibold text-lg text-foreground mb-1 cursor-pointer hover:text-primary transition-colors"
            data-testid={`text-product-name-${id}`}
          >
            {name}
          </h3>
        </Link>
        <p className="text-xl font-bold text-primary" data-testid={`text-product-price-${id}`}>
          ${price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button
          className="w-full"
          variant="default"
          onClick={() => {
            onAddToCart?.();
            console.log(`Added ${name} to cart`);
          }}
          data-testid={`button-add-to-cart-${id}`}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
