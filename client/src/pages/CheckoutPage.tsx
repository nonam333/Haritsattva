import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { useAuth } from "@/hooks/useAuth"; // Import useAuth

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

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to create order");
      return response.json();
    },
    onSuccess: () => {
      setOrderPlaced(true);
      clearCart();
      toast({ title: "Order placed successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to place order", variant: "destructive" });
    },
  });

  const societyRequestMutation = useMutation({
    mutationFn: async (data: typeof societyRequestForm) => {
      const response = await fetch("/api/society-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const orderData = {
      ...formData,
      total: total.toString(),
      items: items.map((item) => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price.toString(),
      })),
    };

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
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mb-4 flex justify-center">
              <img
                src="/logo.png"
                alt="Haritsattva"
                className="w-16 h-16 object-contain"
              />
            </div>
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-4">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-8">
              Thank you for your order. We'll send you a confirmation email shortly.
            </p>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => navigate("/orders")}>View Orders</Button>
              <Button variant="outline" onClick={() => navigate("/products")}>
                Continue Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <Button
        variant="ghost"
        onClick={() => navigate("/cart")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cart
      </Button>

      <div className="mb-6 flex justify-center">
        <img
          src="/logo.png"
          alt="Haritsattva"
          className="w-16 h-16 object-contain"
        />
      </div>

      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Checkout Form */}
        <div className="md:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
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
              </CardContent>
            </Card>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={createOrderMutation.isPending}
            >
              {createOrderMutation.isPending ? "Placing Order..." : "Place Order"}
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="sticky top-20">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <div className="border-t pt-4">
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
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
