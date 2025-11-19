import { Leaf } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-card-border mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Leaf className="w-6 h-6 text-primary" />
              <span className="text-xl font-semibold text-foreground">Haritsattva</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Fresh, organic fruits and vegetables delivered to your doorstep.
              Quality you can trust.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
            <div className="flex flex-col gap-2">
              <Link href="/products" data-testid="link-footer-products">
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  Products
                </span>
              </Link>
              <Link href="/about" data-testid="link-footer-about">
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  About Us
                </span>
              </Link>
              <Link href="/policy" data-testid="link-footer-policy">
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  Policy
                </span>
              </Link>
              <Link href="/contact" data-testid="link-footer-contact">
                <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
                  Contact
                </span>
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Contact</h3>
            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <p>Email: support@haritsattva.com</p>
              <p>Phone: (555) 123-4567</p>
              <p>Hours: Mon-Sat, 8AM-8PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© {currentYear} Haritsattva. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
