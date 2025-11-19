import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";

export default function CartPage() {
  const [, navigate] = useLocation();
  const { items, updateQuantity, removeFromCart } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 50.0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-20 text-center">
        <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground mb-6" />
        <h2 className="text-2xl font-bold text-foreground mb-4" data-testid="text-empty-cart">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-8">
          Add some fresh produce to get started!
        </p>
        <Link href="/products">
          <Button size="lg" data-testid="button-browse-products">
            Browse Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-page-title">
          Shopping Cart
        </h1>
        <p className="text-muted-foreground text-lg">
          Review your items and proceed to checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.id} data-testid={`card-cart-item-${item.id}`}>
              <CardContent className="p-6">
                <div className="flex gap-4 flex-wrap">
                  <div className="w-24 h-24 rounded-md overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg text-foreground mb-1" data-testid={`text-item-name-${item.id}`}>
                      {item.name}
                    </h3>
                    <p className="text-xl font-bold text-primary mb-4" data-testid={`text-item-price-${item.id}`}>
                      ₹{item.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold" data-testid={`text-quantity-${item.id}`}>
                        {item.quantity}
                      </span>
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="ml-auto text-destructive hover:text-destructive"
                        onClick={() => removeFromCart(item.id)}
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-semibold" data-testid="text-subtotal">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-semibold">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-border pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-primary" data-testid="text-total">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => navigate("/checkout")}
                data-testid="button-checkout"
              >
                Proceed to Checkout
              </Button>
              <Link href="/products">
                <Button
                  className="w-full"
                  variant="outline"
                >
                  Continue Shopping
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
