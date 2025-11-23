import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import GlassCard from "@/components/GlassCard";
import GlassButton from "@/components/GlassButton";

export default function CartPage() {
  const [, navigate] = useLocation();
  const { items, updateQuantity, removeFromCart } = useCart();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = 50.0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-28 text-center">
        <ShoppingBag className="w-32 h-32 mx-auto text-neonMint/40 mb-8" />
        <h2 className="text-4xl md:text-5xl font-heading font-bold text-foreground mb-6 tracking-tight" data-testid="text-empty-cart">
          Your cart is empty
        </h2>
        <p className="text-muted-foreground mb-12 text-xl">
          Add some fresh produce to get started!
        </p>
        <Link href="/products">
          <GlassButton data-testid="button-browse-products">
            Browse Products
          </GlassButton>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16">
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-6 tracking-tight" data-testid="text-page-title">
          Shopping <span className="text-neonMint">Cart</span>
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">
          Review your items and proceed to checkout
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <GlassCard key={item.id} data-testid={`card-cart-item-${item.id}`} className="p-8 hover:scale-[1.02] transition-all duration-300">
              <div className="flex gap-6 flex-wrap">
                <div className="w-32 h-32 rounded-lg overflow-hidden bg-muted flex-shrink-0 shadow-premium">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-heading font-bold text-2xl text-foreground mb-2 tracking-tight" data-testid={`text-item-name-${item.id}`}>
                    {item.name}
                  </h3>
                  <p className="text-2xl font-bold text-neonMint mb-6" data-testid={`text-item-price-${item.id}`}>
                    ₹{item.price.toFixed(2)}
                  </p>
                  <div className="flex items-center gap-3">
                    <Button
                      size="icon"
                      className="glass-dark w-10 h-10 hover:bg-neonMint/20 transition-all"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      data-testid={`button-decrease-${item.id}`}
                    >
                      <Minus className="w-5 h-5 text-neonMint" />
                    </Button>
                    <span className="w-16 text-center font-bold text-xl" data-testid={`text-quantity-${item.id}`}>
                      {item.quantity}
                    </span>
                    <Button
                      size="icon"
                      className="glass-dark w-10 h-10 hover:bg-neonMint/20 transition-all"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      data-testid={`button-increase-${item.id}`}
                    >
                      <Plus className="w-5 h-5 text-neonMint" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="ml-auto text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => removeFromCart(item.id)}
                      data-testid={`button-remove-${item.id}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

        {/* Order Summary */}
        <div>
          <GlassCard className="sticky top-24 p-8 shadow-premium-lg">
            <h3 className="text-3xl font-heading font-bold text-foreground mb-8 tracking-tight">Order Summary</h3>
            <div className="space-y-6">
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold" data-testid="text-subtotal">
                  ₹{subtotal.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-lg">
                <span className="text-muted-foreground">Delivery Fee</span>
                <span className="font-bold">₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-white/20 pt-6">
                <div className="flex justify-between text-2xl font-bold">
                  <span>Total</span>
                  <span className="text-neonMint" data-testid="text-total">
                    ₹{total.toFixed(2)}
                  </span>
                </div>
              </div>
              <GlassButton
                className="w-full text-lg py-6"
                onClick={() => navigate("/checkout")}
                data-testid="button-checkout"
              >
                Proceed to Checkout
              </GlassButton>
              <Link href="/products">
                <Button
                  className="w-full glass-dark hover:bg-white/10"
                  variant="outline"
                  size="lg"
                >
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
