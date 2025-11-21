import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Package } from "lucide-react";
import { format } from "date-fns";
import { getQueryFn } from "@/lib/queryClient";

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
    <div className="max-w-5xl mx-auto px-6 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <p className="text-muted-foreground">View and track your orders</p>
      </div>

      {orders && orders.length === 0 && (
        <Card>
          <CardContent className="py-16 text-center">
            <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No orders yet</h2>
            <p className="text-muted-foreground">Start shopping to see your orders here</p>
          </CardContent>
        </Card>
      )}

      <div className="space-y-6">
        {orders?.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-base">
                    Order #{order.id.slice(0, 8).toUpperCase()}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {order.createdAt
                      ? format(new Date(order.createdAt), "MMM d, yyyy 'at' h:mm a")
                      : "N/A"}
                  </p>
                </div>
                <Badge className={statusColors[order.status] || ""}>
                  {order.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Order Items */}
              <div>
                <h3 className="font-semibold mb-2">Items</h3>
                <div className="space-y-2">
                  {order.items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Shipping Info */}
              <div>
                <h3 className="font-semibold mb-2">Shipping Address</h3>
                <p className="text-sm text-muted-foreground">
                  {order.shippingName}
                  <br />
                  {order.shippingAddress}
                  <br />
                  {order.shippingCity}, {order.shippingState} {order.shippingZip}
                  <br />
                  {order.shippingPhone}
                </p>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold">₹{order.total}</span>
              </div>

              {order.notes && (
                <>
                  <Separator />
                  <div>
                    <h3 className="font-semibold mb-2">Order Notes</h3>
                    <p className="text-sm text-muted-foreground">{order.notes}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
