import { Leaf, Mail, Phone, Clock, MapPin } from "lucide-react";
import { Link } from "wouter";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t border-card-border mt-12 sm:mt-16 lg:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
              <span className="text-lg sm:text-xl font-semibold text-foreground">Haritsattva</span>
            </div>
            <p className="text-muted-foreground text-sm">
              Fresh, organic fruits and vegetables delivered to your doorstep.
              Quality you can trust.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 sm:mb-4">Quick Links</h3>
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
            <h3 className="font-semibold text-foreground mb-3 sm:mb-4">Contact Us</h3>
            <div className="flex flex-col gap-2.5 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="mailto:support@haritsattva.com" className="hover:text-foreground transition-colors">
                  support@haritsattva.com
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                <a href="tel:+919953035329" className="hover:text-foreground transition-colors">
                  +91 9953035329
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p>Mon-Sat: 8AM-8PM</p>
                  <p className="text-xs">Closed on Sundays</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 sm:mb-4">Location</h3>
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
              <p>Supertech Ecovillage 2</p>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-xs sm:text-sm text-muted-foreground">
          <p>© {currentYear} Haritsattva. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
