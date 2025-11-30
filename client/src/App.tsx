import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { CartProvider } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
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
import ProductSuggestions from "@/pages/admin/ProductSuggestions";
import SocietyRequests from "@/pages/admin/SocietyRequests";
import ContactSubmissions from "@/pages/admin/ContactSubmissions";
import UserManagement from "@/pages/admin/UserManagement";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AuthPage from "./pages/AuthPage";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Route path="/" component={LandingPage} />;
  }

  return (
    <Switch>
      {/* Publicly accessible routes */}
      <Route path="/login" component={AuthPage} />
      <Route path="/signup" component={AuthPage} />
      <Route path="/products" component={ProductsPage} />
      <Route path="/policy" component={PolicyPage} />
      <Route path="/about" component={AboutPage} />
      <Route path="/contact" component={ContactPage} />

      {/* Authenticated Routes */}
      <Route path="/cart">
        {() => (isAuthenticated ? <CartPage /> : <Redirect to="/login" />)}
      </Route>
      <Route path="/checkout">
        {() => (isAuthenticated ? <CheckoutPage /> : <Redirect to="/login" />)}
      </Route>
      <Route path="/orders">
        {() => (isAuthenticated ? <OrderHistoryPage /> : <Redirect to="/login" />)}
      </Route>

      {/* Admin Routes */}
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <ProtectedRoute path="/admin/products" component={ProductManagement} />
      <ProtectedRoute path="/admin/orders" component={OrderManagement} />
      <ProtectedRoute path="/admin/categories" component={CategoryManagement} />
      <ProtectedRoute path="/admin/suggestions" component={ProductSuggestions} />
      <ProtectedRoute path="/admin/society-requests" component={SocietyRequests} />
      <ProtectedRoute path="/admin/contacts" component={ContactSubmissions} />
      <ProtectedRoute path="/admin/users" component={UserManagement} />

      {/* Home Page - Now visible to all users */}
      <Route path="/" component={HomePage} />

      {/* Fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [location] = useLocation(); // Get current location

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light">
        <LanguageProvider defaultLanguage="en">
          <CartProvider>
            <TooltipProvider>
              <ScrollToTop />
              <div className="min-h-screen flex flex-col">
                <Navbar />
                <main className="flex-1">
                  <Router />
                </main>
                {!location.startsWith("/admin") && <Footer />} {/* Conditionally render Footer */}
              </div>
              <Toaster />
            </TooltipProvider>
          </CartProvider>
        </LanguageProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
