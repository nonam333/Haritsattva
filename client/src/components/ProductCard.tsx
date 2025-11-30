import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

// Weight options in kg
const WEIGHT_OPTIONS = [
  { value: 0.1, label: "100 gm", display: "100g" },
  { value: 0.25, label: "250 gm", display: "250g" },
  { value: 0.5, label: "500 gm", display: "500g" },
  { value: 1, label: "1 kg", display: "1kg" },
  { value: 2, label: "2 kg", display: "2kg" },
];

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
}: ProductCardProps) {
  const { addToCart, updateQuantity, removeFromCart, items, getCartItemId } = useCart();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();
  const [selectedWeight, setSelectedWeight] = useState<number>(0.5); // Default to 500gm

  // Check if product with this weight is already in cart
  const cartItemId = getCartItemId(id, selectedWeight);
  const cartItem = items.find(item => item.id === cartItemId);
  const quantityInCart = cartItem?.quantity || 0;

  const calculatePrice = () => {
    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    return (numPrice * selectedWeight).toFixed(2);
  };

  const handleAddToCart = () => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to your cart.",
        variant: "default",
      });
      setLocation('/login');
      return;
    }

    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    const weightLabel = WEIGHT_OPTIONS.find(w => w.value === selectedWeight)?.display || '';
    addToCart({ id, name, price: numPrice, imageUrl, weight: selectedWeight });
    toast({
      title: "Added to cart",
      description: `${name} (${weightLabel}) has been added to your cart.`,
      action: (
        <Button
          size="sm"
          variant="default"
          className="gap-2"
          onClick={() => setLocation('/cart')}
        >
          <ShoppingCart className="w-4 h-4" />
          View Cart
        </Button>
      ),
    });
  };

  const handleIncrement = () => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to add items to your cart.",
        variant: "default",
      });
      setLocation('/login');
      return;
    }

    const numPrice = typeof price === 'number' ? price : parseFloat(price);
    if (quantityInCart > 0) {
      updateQuantity(cartItemId, quantityInCart + 1);
    } else {
      addToCart({ id, name, price: numPrice, imageUrl, weight: selectedWeight });
    }
  };

  const handleDecrement = () => {
    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast({
        title: "Login required",
        description: "Please login to manage your cart.",
        variant: "default",
      });
      setLocation('/login');
      return;
    }

    if (quantityInCart > 1) {
      updateQuantity(cartItemId, quantityInCart - 1);
    } else if (quantityInCart === 1) {
      removeFromCart(cartItemId);
    }
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 group hover:shadow-premium-lg hover:-translate-y-2 h-full flex flex-col border-border/50 hover:border-neonMint/30" data-testid={`card-product-${id}`}>
      <div className="aspect-square overflow-hidden bg-muted relative">
        <img
          src={imageUrl}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          data-testid={`img-product-${id}`}
        />
        {/* Premium Glass Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-darkCharcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-0 glass opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <CardContent className="p-4 sm:p-5 md:p-6 flex-1 flex flex-col">
        <h3
          className="font-heading font-semibold text-base sm:text-lg text-foreground mb-2 sm:mb-3 line-clamp-2 tracking-tight"
          data-testid={`text-product-name-${id}`}
        >
          {name}
        </h3>
        <div className="mt-auto space-y-2">
          <p className="text-sm text-muted-foreground">
            ₹{typeof price === 'number' ? price.toFixed(2) : parseFloat(price).toFixed(2)}/kg
          </p>
          <div className="flex items-center gap-2">
            <Select
              value={selectedWeight.toString()}
              onValueChange={(value) => setSelectedWeight(parseFloat(value))}
            >
              <SelectTrigger className="w-[120px] h-9 text-sm">
                <SelectValue placeholder="Weight" />
              </SelectTrigger>
              <SelectContent>
                {WEIGHT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value.toString()}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xl sm:text-2xl font-bold text-primary group-hover:text-neonMint transition-colors" data-testid={`text-product-price-${id}`}>
              ₹{calculatePrice()}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 sm:p-5 md:p-6 pt-0">
        {quantityInCart === 0 ? (
          <Button
            className="w-full shadow-premium hover:shadow-premium-lg transition-all text-sm sm:text-base font-heading tracking-tight hover:scale-105 active:scale-95"
            variant="default"
            size="default"
            onClick={handleAddToCart}
            data-testid={`button-add-to-cart-${id}`}
          >
            <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            Add to Cart
          </Button>
        ) : (
          <div className="w-full flex items-center justify-between gap-2 sm:gap-3 glass-dark rounded-lg p-2.5 sm:p-3 border border-neonMint/30 glow-neon">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDecrement}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-md hover:bg-neonMint/20 text-neonMint hover:scale-110 transition-all"
              data-testid={`button-decrease-${id}`}
            >
              <Minus className="w-4 h-4" />
            </Button>
            <span className="text-base sm:text-lg font-bold font-heading text-neonMint min-w-[2.5rem] text-center" data-testid={`text-quantity-${id}`}>
              {quantityInCart}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleIncrement}
              className="h-9 w-9 sm:h-10 sm:w-10 rounded-md hover:bg-neonMint/20 text-neonMint hover:scale-110 transition-all"
              data-testid={`button-increase-${id}`}
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
