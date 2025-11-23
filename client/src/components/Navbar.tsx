import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X, Leaf, LogOut, Shield, User, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ThemeToggle from "@/components/ThemeToggle";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/hooks/useAuth";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface NavbarProps {}

export default function Navbar({}: NavbarProps) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { isAdmin } = useIsAdmin();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/products", label: "Products" },
    { path: "/about", label: "About Us" },
    { path: "/policy", label: "Policy" },
    { path: "/contact", label: "Contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-strong border-b border-white/10 shadow-premium" style={{ paddingTop: 'env(safe-area-inset-top)' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18">
          {/* Logo - Hidden on admin pages */}
          {!location.startsWith('/admin') && (
            <Link href="/" data-testid="link-home">
              <div className="flex items-center gap-2 sm:gap-3 hover:scale-105 active:scale-95 px-2 py-1 rounded-lg cursor-pointer flex-shrink-0 transition-transform">
                <img src="/logo.png" alt="Haritsattva" className="w-10 h-10 sm:w-12 sm:h-12 object-contain" />
                <span className="text-lg sm:text-xl font-heading font-bold text-foreground tracking-tight">Haritsattva</span>
              </div>
            </Link>
          )}

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link key={link.path} href={link.path} data-testid={`link-${link.label.toLowerCase().replace(' ', '-')}`}>
                <Button
                  variant="ghost"
                  className={`font-heading transition-all ${location === link.path ? "bg-neonMint/20 text-neonMint" : "hover:bg-white/10"}`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            {isAuthenticated && (
              <Link href="/orders" data-testid="link-my-orders">
                <Button
                  variant="ghost"
                  className={`font-heading transition-all ${location === "/orders" ? "bg-neonMint/20 text-neonMint" : "hover:bg-white/10"}`}
                >
                  My Orders
                </Button>
              </Link>
            )}
          </div>

          {/* Cart Icon, User & Theme Toggle */}
          <div className="flex items-center gap-1 flex-shrink-0">
            <div className="hidden lg:block">
              <ThemeToggle />
            </div>
            {isAuthenticated ? (
              <>
                {isAdmin && (
                  <Link href="/admin" data-testid="link-admin">
                    <Button size="icon" variant="ghost" title="Admin Panel" className="flex-shrink-0">
                      <Shield className="w-5 h-5" />
                    </Button>
                  </Link>
                )}
                <Link href="/cart" data-testid="link-cart">
                  <Button size="icon" variant="ghost" className="relative flex-shrink-0">
                    <ShoppingCart className="w-5 h-5" />
                    {totalItems > 0 && (
                      <Badge
                        variant="default"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs pointer-events-none"
                        data-testid="badge-cart-count"
                      >
                        {totalItems}
                      </Badge>
                    )}
                  </Button>
                </Link>
                <div className="hidden md:flex items-center gap-1 md:gap-2">
                  <Avatar
                    className="w-8 h-8 cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    onClick={() => setProfileModalOpen(true)}
                  >
                    <AvatarFallback className="bg-gray-200 dark:bg-gray-700">
                      <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={async () => {
                      await apiRequest('POST', '/api/auth/logout');
                      localStorage.removeItem('sessionToken'); // Clear token
                      queryClient.clear(); // Clear all cached data
                      window.location.href = '/login';
                    }}
                    data-testid="button-logout"
                  >
                    <LogOut className="w-5 h-5" />
                  </Button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1">
                <Link href="/login">
                  <Button variant="ghost" size="sm" className="text-xs sm:text-sm">Login</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="text-xs sm:text-sm">Sign Up</Button>
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              size="icon"
              variant="ghost"
              className="md:hidden flex-shrink-0 ml-1"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link key={link.path} href={link.path}>
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${location === link.path ? "bg-accent" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Button>
                </Link>
              ))}
              {isAuthenticated && (
                <>
                  <Link href="/orders">
                    <Button
                      variant="ghost"
                      className={`w-full justify-start ${location === "/orders" ? "bg-accent" : ""}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      My Orders
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link href="/admin">
                      <Button
                        variant="ghost"
                        className={`w-full justify-start ${location === "/admin" ? "bg-accent" : ""}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4 mr-2" />
                        Admin Panel
                      </Button>
                    </Link>
                  )}
                  <Button
                    variant="ghost"
                    className="w-full justify-start"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setProfileModalOpen(true);
                    }}
                  >
                    <User className="w-4 h-4 mr-2" />
                    My Profile
                  </Button>
                </>
              )}
              {/* Dark Mode Toggle in Mobile Menu */}
              <div className="flex items-center justify-between px-3 py-2">
                <span className="text-sm font-medium">Dark Mode</span>
                <ThemeToggle />
              </div>

              {isAuthenticated ? (
                <Button
                  variant="ghost"
                  className="w-full justify-start text-destructive hover:text-destructive"
                  onClick={async () => {
                    setMobileMenuOpen(false);
                    await apiRequest('POST', '/api/auth/logout');
                    localStorage.removeItem('sessionToken'); // Clear token
                    queryClient.clear(); // Clear all cached data
                    window.location.href = '/login';
                  }}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              ) : (
                <>
                  <Link href="/login">
                    <Button variant="ghost" className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>Login</Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="w-full justify-start" onClick={() => setMobileMenuOpen(false)}>Sign Up</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Profile Modal */}
      <Dialog open={profileModalOpen} onOpenChange={setProfileModalOpen}>
        <DialogContent className="sm:max-w-[500px] bg-background/95 backdrop-blur-xl border-2 border-primary/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold flex items-center gap-2">
              <User className="w-6 h-6 text-primary" />
              My Profile
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6 py-4">
            {/* Email */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <Mail className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Email</p>
                <p className="text-base font-semibold text-foreground">{user?.email || 'Not provided'}</p>
              </div>
            </div>

            {/* Name */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <User className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Name</p>
                <p className="text-base font-semibold text-foreground">{user?.shippingName || 'Not provided'}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <Phone className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Phone</p>
                <p className="text-base font-semibold text-foreground">{user?.shippingPhone || 'Not provided'}</p>
              </div>
            </div>

            {/* Society */}
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-muted-foreground">Society</p>
                <p className="text-base font-semibold text-foreground">{user?.shippingAddress || 'Not provided'}</p>
              </div>
            </div>

            {/* Flat Number */}
            {user?.shippingFlatNumber && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-muted-foreground">Flat/House Number</p>
                  <p className="text-base font-semibold text-foreground">{user.shippingFlatNumber}</p>
                </div>
              </div>
            )}

            {/* Log Out Button */}
            <Button
              className="w-full mt-4"
              variant="destructive"
              onClick={async () => {
                setProfileModalOpen(false);
                await apiRequest('POST', '/api/auth/logout');
                localStorage.removeItem('sessionToken'); // Clear token
                queryClient.clear(); // Clear all cached data
                window.location.href = '/login';
              }}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log Out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </nav>
  );
}
