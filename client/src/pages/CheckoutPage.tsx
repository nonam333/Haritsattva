import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GlassCard from "@/components/GlassCard";
import GlassButton from "@/components/GlassButton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, CheckCircle2, Building2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest } from "@/lib/queryClient";
import { useRazorpay } from "@/hooks/useRazorpay";

export default function CheckoutPage() {
  const [, navigate] = useLocation();
  const { items, total, clearCart } = useCart();
  const { toast } = useToast();
  const [orderPlaced, setOrderPlaced] = useState(false);
  const { user } = useAuth(); // Use the useAuth hook
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [societyRequestForm, setSocietyRequestForm] = useState({
    name: "",
    societyName: "",
    phone: "",
  });
  const { initiatePayment, isProcessing } = useRazorpay();

  const [formData, setFormData] = useState({
    shippingName: "",
    shippingEmail: "",
    shippingPhone: "",
    shippingAddress: "",
    shippingFlatNumber: "",
    paymentMethod: "cod",
    notes: "",
  });

  useEffect(() => {
    if (user) {
      setFormData((prevData) => ({
        ...prevData,
        shippingName: user.shippingName || "",
        shippingEmail: user.email || "", // Always use user.email if logged in
        shippingPhone: user.shippingPhone || "",
        shippingAddress: user.shippingAddress || "",
        shippingFlatNumber: user.shippingFlatNumber || "",
      }));
    }
  }, [user]); // Run when user object changes

  // Check for successful payment via URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === 'true') {
      setOrderPlaced(true);
      clearCart();
      // Clean up URL
      window.history.replaceState({}, '', '/checkout');
    }
  }, [clearCart]);

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      console.log('[Checkout] Placing order:', orderData);
      const response = await apiRequest("POST", "/api/orders", orderData);
      console.log('[Checkout] Order response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('[Checkout] Order failed:', errorData);
        throw new Error(errorData.error || 'Failed to create order');
      }

      const result = await response.json();
      console.log('[Checkout] Order created:', result);
      return result;
    },
    onSuccess: async (data) => {
      const orderId = data.order.id;

      // Check payment method
      if (formData.paymentMethod === "upi") {
        // UPI Payment: Initiate Razorpay payment
        // Success will be handled by redirect to /checkout?success=true after payment verification
        try {
          await initiatePayment(orderId, total, {
            name: formData.shippingName,
            email: formData.shippingEmail,
            phone: formData.shippingPhone,
          });
          // Don't set orderPlaced here - wait for payment verification
        } catch (error: any) {
          console.error("Payment initiation error:", error);
          toast({
            title: "Payment Failed",
            description: error.message || "Failed to initiate payment. Please try again.",
            variant: "destructive"
          });
        }
      } else {
        // COD Payment: Mark order as placed immediately
        setOrderPlaced(true);
        clearCart();
        toast({
          title: "Order Placed!",
          description: "Your order has been placed successfully. Pay on delivery.",
        });
      }
    },
    onError: (error: any) => {
      console.error("[Checkout] Order placement error:", error);
      toast({ title: "Failed to place order", variant: "destructive", description: error.message });
    },
  });

  const societyRequestMutation = useMutation({
    mutationFn: async (data: typeof societyRequestForm) => {
      const response = await apiRequest("POST", "/api/society-requests", data);
      if (!response.ok) throw new Error("Failed to submit request");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Request submitted!",
        description: "We'll notify you when we start delivering to your society.",
      });
      setSocietyRequestForm({ name: "", societyName: "", phone: "" });
      setRequestModalOpen(false);
      setFormData({ ...formData, shippingAddress: "" });
    },
    onError: () => {
      toast({
        title: "Failed to submit request",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSocietyChange = (value: string) => {
    if (value === "other") {
      setRequestModalOpen(true);
      setFormData({ ...formData, shippingAddress: "" });
    } else {
      setFormData({ ...formData, shippingAddress: value });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      ...formData,
      // Ensure no null values are sent - convert null to empty string
      shippingFlatNumber: formData.shippingFlatNumber || "",
      notes: formData.notes || "",
      total: total.toString(),
      items: items.map((item) => {
        // Cart item ID format: {uuid}-{weight}
        // Extract product ID by removing the last segment (weight)
        const parts = item.id.split('-');
        const productId = parts.slice(0, -1).join('-'); // Remove last part (weight)
        return {
          productId,
          productName: item.name,
          quantity: item.quantity,
          weight: item.weight.toString(),
          price: item.price.toString(),
        };
      }),
    };

    console.log("[Checkout] Submitting order data:", orderData);
    createOrderMutation.mutate(orderData);
  };

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => navigate("/products")}>Continue Shopping</Button>
      </div>
    );
  }

  if (orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20">
        <GlassCard className="p-20 text-center shadow-premium-lg">
          <div className="mb-8 flex justify-center">
            <img
              src="/logo.png"
              alt="Haritsattva"
              className="w-24 h-24 object-contain drop-shadow-2xl"
            />
          </div>
          <CheckCircle2 className="w-24 h-24 text-neonMint mx-auto mb-8" />
          <h1 className="text-5xl md:text-6xl font-heading font-bold mb-6 tracking-tight">Order Placed <span className="text-neonMint">Successfully!</span></h1>
          <p className="text-muted-foreground mb-12 text-xl leading-relaxed">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <GlassButton onClick={() => navigate("/orders")}>View Orders</GlassButton>
            <Button
              className="glass-dark hover:bg-white/10 px-8 py-6 text-lg"
              variant="outline"
              size="lg"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </Button>
          </div>
        </GlassCard>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      <Button
        variant="ghost"
        onClick={() => navigate("/cart")}
        className="mb-8 hover:bg-white/10"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Cart
      </Button>

      <div className="mb-8 flex justify-center">
        <img
          src="/logo.png"
          alt="Haritsattva"
          className="w-20 h-20 object-contain drop-shadow-lg"
        />
      </div>

      <h1 className="text-5xl md:text-6xl font-heading font-bold mb-12 text-center tracking-tight">
        <span className="text-neonMint">Checkout</span>
      </h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-8">
            <GlassCard className="p-8">
              <h2 className="text-2xl font-heading font-bold mb-6 tracking-tight">Shipping Information</h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    value={formData.shippingName}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingName: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.shippingEmail}
                      onChange={(e) =>
                        setFormData({ ...formData, shippingEmail: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.shippingPhone}
                      onChange={(e) =>
                        setFormData({ ...formData, shippingPhone: e.target.value })
                      }
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="society">Society/Building *</Label>
                  <Select
                    value={formData.shippingAddress}
                    onValueChange={handleSocietyChange}
                    required
                  >
                    <SelectTrigger id="society">
                      <SelectValue placeholder="Select your society" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Supertech Eco Village 2">
                        Supertech Eco Village 2
                      </SelectItem>
                      <SelectItem value="Ajnara Homes">Ajnara Homes</SelectItem>
                      <SelectItem value="Panchsheel Greens 1">
                        Panchsheel Greens 1
                      </SelectItem>
                      <SelectItem value="other">
                        Other / Not in List?
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="flatNumber">Flat / Apartment Number *</Label>
                  <Input
                    id="flatNumber"
                    value={formData.shippingFlatNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, shippingFlatNumber: e.target.value })
                    }
                    placeholder="e.g., A-101, Tower 2, Flat 5B"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    rows={3}
                    placeholder="Any special instructions for delivery..."
                  />
                </div>
              </div>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-heading font-bold mb-6 tracking-tight">Payment Method</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="cod"
                    name="payment"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                  />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="upi"
                    name="payment"
                    value="upi"
                    checked={formData.paymentMethod === "upi"}
                    onChange={(e) =>
                      setFormData({ ...formData, paymentMethod: e.target.value })
                    }
                  />
                  <Label htmlFor="upi">UPI</Label>
                </div>
              </div>
            </GlassCard>

            <GlassButton
              type="submit"
              className="w-full text-lg py-6"
              disabled={createOrderMutation.isPending || isProcessing}
            >
              {createOrderMutation.isPending ? "Placing Order..." : isProcessing ? "Processing Payment..." : "Place Order"}
            </GlassButton>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <GlassCard className="sticky top-20 p-8 shadow-premium-lg">
            <h2 className="text-3xl font-heading font-bold mb-8 tracking-tight">Order Summary</h2>
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-base">
                  <span className="text-muted-foreground">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-bold">₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t border-white/20 pt-6">
                <div className="flex justify-between font-bold text-2xl">
                  <span>Total</span>
                  <span className="text-neonMint">₹{total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Request Service Modal */}
      <Dialog open={requestModalOpen} onOpenChange={setRequestModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-xl border-2 border-primary/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-primary" />
              Request Delivery to Your Society
            </DialogTitle>
            <DialogDescription>
              We currently only serve specific societies. Tell us where you are, and we'll notify you when we start delivering there!
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!societyRequestForm.name.trim() || !societyRequestForm.societyName.trim() || !societyRequestForm.phone.trim()) {
                toast({
                  title: "All fields required",
                  description: "Please fill in all fields",
                  variant: "destructive",
                });
                return;
              }
              societyRequestMutation.mutate(societyRequestForm);
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="requestName">Name *</Label>
              <Input
                id="requestName"
                value={societyRequestForm.name}
                onChange={(e) =>
                  setSocietyRequestForm({ ...societyRequestForm, name: e.target.value })
                }
                placeholder="Your name"
                required
              />
            </div>

            <div>
              <Label htmlFor="requestSociety">Society Name *</Label>
              <Input
                id="requestSociety"
                value={societyRequestForm.societyName}
                onChange={(e) =>
                  setSocietyRequestForm({ ...societyRequestForm, societyName: e.target.value })
                }
                placeholder="e.g., Green Valley Apartments"
                required
              />
            </div>

            <div>
              <Label htmlFor="requestPhone">Phone Number *</Label>
              <Input
                id="requestPhone"
                type="tel"
                value={societyRequestForm.phone}
                onChange={(e) =>
                  setSocietyRequestForm({ ...societyRequestForm, phone: e.target.value })
                }
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>

            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setRequestModalOpen(false);
                  setSocietyRequestForm({ name: "", societyName: "", phone: "" });
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={societyRequestMutation.isPending}
              >
                {societyRequestMutation.isPending ? "Submitting..." : "Submit Request"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
