import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AdminLayout from "@/components/AdminLayout";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Eye } from "lucide-react";
import type { Order } from "@shared/schema";
import { useState } from "react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function OrderManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const { data: ordersData, isLoading } = useQuery<any[]>({
    queryKey: ["/api/admin/orders"],
    queryFn: async () => {
      const response = await fetch("/api/admin/orders", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch orders");
      return response.json();
    },
  });

  // Sort orders by latest first
  const orders = ordersData?.sort((a, b) => {
    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    return dateB - dateA; // Descending order (latest first)
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await fetch(`/api/admin/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to update order status");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/orders"] });
      toast({ title: "Order status updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update order status", variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">Loading...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Order Management</h1>
          <p className="text-muted-foreground">Manage and track customer orders</p>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Change Status</TableHead>
                <TableHead>Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders?.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">
                    {order.id.slice(0, 8)}...
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{order.shippingName}</p>
                      <p className="text-sm text-muted-foreground">{order.shippingEmail}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {order.items?.slice(0, 2).map((item: any) => (
                        <div key={item.id}>
                          {item.productName} x{item.quantity}
                        </div>
                      ))}
                      {order.items?.length > 2 && (
                        <div className="text-muted-foreground">
                          +{order.items.length - 2} more
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">₹{order.total}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status] || ""}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.createdAt ? format(new Date(order.createdAt), "MMM d, yyyy") : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onValueChange={(status) =>
                        updateStatusMutation.mutate({ id: order.id, status })
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="confirmed">Confirmed</SelectItem>
                        <SelectItem value="shipped">Shipped</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>Order Details</DialogTitle>
                          <DialogDescription>
                            Full details for order #{order.id.slice(0, 8)}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-6">
                          {/* Order Information */}
                          <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Order Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Order ID</p>
                                <p className="font-mono">{order.id}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Status</p>
                                <Badge className={statusColors[order.status] || ""}>
                                  {order.status}
                                </Badge>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Date</p>
                                <p>{order.createdAt ? format(new Date(order.createdAt), "PPP") : "N/A"}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Total Amount</p>
                                <p className="font-semibold text-lg">₹{order.total}</p>
                              </div>
                            </div>
                          </div>

                          {/* Customer Information */}
                          <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Customer Information</h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Name</p>
                                <p>{order.shippingName}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Email</p>
                                <p>{order.shippingEmail}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Phone</p>
                                <p>{order.shippingPhone}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Payment Method</p>
                                <p>{order.paymentMethod || "N/A"}</p>
                              </div>
                            </div>
                          </div>

                          {/* Shipping Address */}
                          <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Shipping Address</h3>
                            <div className="text-sm">
                              <p>{order.shippingAddress}</p>
                              <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="space-y-3">
                            <h3 className="font-semibold text-lg">Order Items</h3>
                            <div className="border rounded-lg">
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>Price</TableHead>
                                    <TableHead>Subtotal</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {order.items?.map((item: any) => (
                                    <TableRow key={item.id}>
                                      <TableCell>{item.productName}</TableCell>
                                      <TableCell>{item.quantity}</TableCell>
                                      <TableCell>₹{item.price}</TableCell>
                                      <TableCell>₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>
                          </div>

                          {/* Notes */}
                          {order.notes && (
                            <div className="space-y-3">
                              <h3 className="font-semibold text-lg">Notes</h3>
                              <p className="text-sm text-muted-foreground">{order.notes}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {orders && orders.length === 0 && (
          <Card>
            <CardContent className="flex items-center justify-center h-64">
              <p className="text-muted-foreground">No orders found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
