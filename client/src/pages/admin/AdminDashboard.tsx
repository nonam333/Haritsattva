import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, ShoppingCart, Users, TrendingUp, AlertTriangle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import AdminLayout from "@/components/AdminLayout";

export default function AdminDashboard() {
  const { data: analytics, isLoading } = useQuery({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const response = await fetch("/api/admin/analytics", {
        credentials: "include",
      });
      if (!response.ok) throw new Error("Failed to fetch analytics");
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-muted-foreground">Loading analytics...</div>
        </div>
      </AdminLayout>
    );
  }

  const summary = analytics?.summary || {};
  const topProducts = analytics?.topProducts || [];
  const lowStockItems = analytics?.lowStockItems || [];

  const statCards = [
    {
      title: "Total Revenue",
      value: `₹${summary.totalRevenue?.toFixed(2) || "0.00"}`,
      icon: DollarSign,
      color: "text-green-600",
    },
    {
      title: "Total Orders",
      value: summary.totalOrders || 0,
      icon: ShoppingCart,
      color: "text-blue-600",
    },
    {
      title: "Products",
      value: summary.totalProducts || 0,
      icon: Package,
      color: "text-purple-600",
    },
    {
      title: "Users",
      value: summary.totalUsers || 0,
      icon: Users,
      color: "text-orange-600",
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your store performance</p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Charts and Tables Row */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Products */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Top Selling Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              {topProducts.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={topProducts}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="productName" angle={-45} textAnchor="end" height={100} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="totalRevenue" fill="#8884d8" name="Revenue (₹)" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-64 text-muted-foreground">
                  No sales data available
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alert */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                Low Stock Alert
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lowStockItems.length > 0 ? (
                  <div className="space-y-3">
                    {lowStockItems.slice(0, 5).map((product: any) => (
                      <div key={product.id} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-muted-foreground">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${product.inStock < 5 ? 'text-red-600' : 'text-yellow-600'}`}>
                            {product.inStock} left
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-64 text-muted-foreground">
                    All products are well stocked
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Order Status Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(analytics?.ordersByStatus || {}).map(([status, count]) => (
                <div key={status} className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold">{count as number}</p>
                  <p className="text-sm text-muted-foreground capitalize">{status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
