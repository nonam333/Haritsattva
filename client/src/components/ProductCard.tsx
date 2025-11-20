import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Link } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
}: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    addToCart({ id, name, price, imageUrl });
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
    });
  };

  return (
    <Card className="overflow-hidden hover-elevate transition-all duration-300 group hover:shadow-lg h-full flex flex-col" data-testid={`card-product-${id}`}>
      <Link href={`/product/${id}`}>
        <div className="aspect-square overflow-hidden bg-muted cursor-pointer relative">
          <img
            src={imageUrl}
            alt={name}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            data-testid={`img-product-${id}`}
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
        </div>
      </Link>
      <CardContent className="p-3 sm:p-4 md:p-5 flex-1 flex flex-col">
        <Link href={`/product/${id}`}>
          <h3
            className="font-semibold text-base sm:text-lg text-foreground mb-1 sm:mb-2 cursor-pointer hover:text-primary transition-colors line-clamp-2"
            data-testid={`text-product-name-${id}`}
          >
            {name}
          </h3>
        </Link>
        <p className="text-xl sm:text-2xl font-bold text-primary mt-auto" data-testid={`text-product-price-${id}`}>
          ₹{price.toFixed(2)}
        </p>
      </CardContent>
      <CardFooter className="p-3 sm:p-4 md:p-5 pt-0">
        <Button
          className="w-full shadow-sm hover:shadow-md transition-all text-sm sm:text-base"
          variant="default"
          size="default"
          onClick={handleAddToCart}
          data-testid={`button-add-to-cart-${id}`}
        >
          <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
