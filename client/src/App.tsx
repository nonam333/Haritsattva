import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { CartProvider } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LandingPage from "@/pages/LandingPage";
import HomePage from "@/pages/HomePage";
import ProductsPage from "@/pages/ProductsPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import OrderHistoryPage from "@/pages/OrderHistoryPage";
import PolicyPage from "@/pages/PolicyPage";
import AboutPage from "@/pages/AboutPage";
import ContactPage from "@/pages/ContactPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import ProductManagement from "@/pages/admin/ProductManagement";
import OrderManagement from "@/pages/admin/OrderManagement";
import CategoryManagement from "@/pages/admin/CategoryManagement";
import ContactSubmissions from "@/pages/admin/ContactSubmissions";
import UserManagement from "@/pages/admin/UserManagement";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <Route path="/" component={LandingPage} />
      ) : (
        <>
          <Route path="/" component={HomePage} />
          <Route path="/products" component={ProductsPage} />
          <Route path="/cart" component={CartPage} />
          <Route path="/checkout" component={CheckoutPage} />
          <Route path="/orders" component={OrderHistoryPage} />
          <Route path="/policy" component={PolicyPage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/contact" component={ContactPage} />

          {/* Admin Routes */}
          <Route path="/admin" component={AdminDashboard} />
          <Route path="/admin/products" component={ProductManagement} />
          <Route path="/admin/orders" component={OrderManagement} />
          <Route path="/admin/categories" component={CategoryManagement} />
          <Route path="/admin/contacts" component={ContactSubmissions} />
          <Route path="/admin/users" component={UserManagement} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <TooltipProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1">
                <Router />
              </main>
              <Footer />
            </div>
            <Toaster />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
