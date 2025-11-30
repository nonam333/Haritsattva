import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";
import { format } from "date-fns";
import { getQueryFn } from "@/lib/queryClient";
import GlassCard from "@/components/GlassCard";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrderHistoryPage() {
  const { data: ordersData, isLoading } = useQuery<any[]>({
    queryKey: ["/api/orders/my-orders"],
    queryFn: getQueryFn({ on401: "throw" }),
  });

  // Sort orders by latest first
  const orders = ordersData?.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (latest first)
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-16">
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading your orders...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-20">
      <div className="mb-16">
        <h1 className="text-5xl md:text-7xl font-heading font-bold tracking-tight mb-6">
          My <span className="text-neonMint">Orders</span>
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed">View and track your orders</p>
      </div>

      {orders && orders.length === 0 && (
        <GlassCard className="p-20 text-center shadow-premium-lg">
          <Package className="w-24 h-24 text-neonMint/40 mx-auto mb-8" />
          <h2 className="text-3xl font-heading font-bold mb-4 tracking-tight">No orders yet</h2>
          <p className="text-muted-foreground text-lg">Start shopping to see your orders here</p>
        </GlassCard>
      )}

      <div className="space-y-8">
        {orders?.map((order) => (
          <GlassCard key={order.id} className="p-8 hover:scale-[1.01] transition-all duration-300 shadow-premium">
            <div className="mb-6">
              <div className="flex justify-between items-start flex-wrap gap-4">
                <div>
                  <h3 className="text-2xl font-heading font-bold tracking-tight mb-2">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </h3>
                  <p className="text-base text-muted-foreground">
                    {order.createdAt
                      ? format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")
                      : "N/A"}
                  </p>
                </div>
                <Badge className={statusColors[order.status] || ""}>
                  {order.status}
                </Badge>
              </div>
            </div>
            <div className="space-y-6">
              {/* Order Items */}
              <div>
                <h4 className="font-heading font-bold text-lg mb-4 tracking-tight">Items</h4>
                <div className="space-y-3">
                  {order.items?.map((item: any) => {
                    const weight = parseFloat(item.weight || 1);
                    const weightLabel = weight === 1 ? '1kg' : weight < 1 ? `${weight * 1000}g` : `${weight}kg`;
                    return (
                      <div key={item.id} className="flex justify-between text-base">
                        <span className="text-muted-foreground">
                          {item.productName} ({weightLabel}) × {item.quantity}
                        </span>
                        <span className="font-bold">₹{(parseFloat(item.price) * weight * item.quantity).toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <Separator className="bg-white/20" />

              {/* Shipping Info */}
              <div>
                <h4 className="font-heading font-bold text-lg mb-4 tracking-tight">Shipping Address</h4>
                <p className="text-base text-muted-foreground leading-relaxed">
                  {order.shippingName}
                  <br />
                  {order.shippingFlatNumber && `${order.shippingFlatNumber}, `}
                  {order.shippingAddress}
                  <br />
                  {order.shippingPhone}
                </p>
              </div>

              <Separator className="bg-white/20" />

              {/* Total */}
              <div className="flex justify-between items-center pt-2">
                <span className="font-heading font-bold text-xl">Total</span>
                <span className="text-3xl font-bold text-neonMint">₹{order.total}</span>
              </div>

              {order.notes && (
                <>
                  <Separator className="bg-white/20" />
                  <div>
                    <h4 className="font-heading font-bold text-lg mb-4 tracking-tight">Order Notes</h4>
                    <p className="text-base text-muted-foreground leading-relaxed">{order.notes}</p>
                  </div>
                </>
              )}
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
