import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, FileText, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-12">
        <div className="mb-6 flex justify-center">
          <img
            src="/logo.png"
            alt="Haritsattva"
            className="w-24 h-24 object-contain"
          />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-page-title">
          Our Policies
        </h1>
        <p className="text-muted-foreground text-lg">
          Important information about our privacy, terms, and return policies
        </p>
      </div>

      <Accordion type="single" collapsible className="w-full space-y-3">
        <AccordionItem value="privacy" className="border border-border rounded-lg px-6 hover-elevate transition-all duration-300">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline" data-testid="accordion-privacy">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              <span>Privacy Policy</span>
              <Badge variant="outline" className="ml-2 text-xs">Updated Jan 2025</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground space-y-4 pt-4">
            <p>
              At Haritsattva, we value your privacy and are committed to protecting your personal information.
              This Privacy Policy outlines how we collect, use, and safeguard your data.
            </p>

            <div>
              <p className="font-semibold text-foreground mb-2">Information We Collect:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Name, email address, and phone number</li>
                <li>Delivery address and location details</li>
                <li>Payment information (securely processed)</li>
                <li>Order history and preferences</li>
              </ul>
            </div>

            <Alert className="bg-primary/5 border-primary/20">
              <AlertDescription className="text-sm">
                <strong className="text-foreground">Your data is safe:</strong> We never sell your personal information to third parties.
              </AlertDescription>
            </Alert>

            <div>
              <p className="font-semibold text-foreground mb-2">How We Use Your Information:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Process and fulfill your orders</li>
                <li>Provide customer support and assistance</li>
                <li>Send delivery updates and notifications</li>
                <li>Improve our services and user experience</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-2">Data Security:</p>
              <p>
                We implement industry-standard security measures including encryption, secure servers, and regular security audits to protect your personal information from unauthorized access or disclosure.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="terms" className="border border-border rounded-lg px-6 hover-elevate transition-all duration-300">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline" data-testid="accordion-terms">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <span>Terms of Service</span>
              <Badge variant="outline" className="ml-2 text-xs">Updated Jan 2025</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground space-y-4 pt-4">
            <p>
              By using Haritsattva's services, you agree to comply with and be bound by the following terms
              and conditions.
            </p>

            <div>
              <p className="font-semibold text-foreground mb-2">Order Acceptance:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>All orders are subject to product availability</li>
                <li>We reserve the right to refuse or cancel orders at our discretion</li>
                <li>Order confirmation will be sent via email</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-2">Pricing:</p>
              <p>
                Prices are subject to change without notice. The price charged will be the price displayed at the time of order confirmation. All prices are in Indian Rupees (₹).
              </p>
            </div>

            <Alert className="bg-primary/5 border-primary/20">
              <AlertDescription className="text-sm">
                <strong className="text-foreground">24-Hour Delivery:</strong> We strive to deliver all orders within 24 hours of harvest for maximum freshness.
              </AlertDescription>
            </Alert>

            <div>
              <p className="font-semibold text-foreground mb-2">Delivery:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Standard delivery within 24 hours</li>
                <li>Delivery times may vary based on location</li>
                <li>You'll receive tracking updates via SMS/email</li>
                <li>Someone must be available to receive the delivery</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-2">User Conduct:</p>
              <p>
                You agree not to use our services for any unlawful purpose or in any way that could damage, disable, or impair our services. We reserve the right to suspend accounts that violate these terms.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="returns" className="border border-border rounded-lg px-6 hover-elevate transition-all duration-300">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline" data-testid="accordion-returns">
            <div className="flex items-center gap-2">
              <RotateCcw className="w-5 h-5 text-primary" />
              <span>Return Policy</span>
              <Badge variant="outline" className="ml-2 text-xs">Updated Jan 2025</Badge>
            </div>
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground space-y-4 pt-4">
            <p>
              We want you to be completely satisfied with your purchase. If you're not happy with your order,
              we're here to help.
            </p>

            <Alert className="bg-primary/5 border-primary/20">
              <AlertDescription className="text-sm">
                <strong className="text-foreground">Freshness Guarantee:</strong> 100% satisfaction or your money back if produce doesn't meet our quality standards.
              </AlertDescription>
            </Alert>

            <div>
              <p className="font-semibold text-foreground mb-2">Eligibility for Returns:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Damaged or spoiled produce upon delivery</li>
                <li>Items not matching order description</li>
                <li>Quality below our standards</li>
                <li>Must report within 24 hours of delivery</li>
              </ul>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-2">Return Process:</p>
              <ol className="list-decimal list-inside space-y-1 ml-2">
                <li>Contact our customer support team immediately</li>
                <li>Provide your order number and photos of affected items</li>
                <li>Our team will review and approve your request</li>
                <li>Choose between full refund or replacement delivery</li>
              </ol>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-2">Refund Timeline:</p>
              <p>
                Approved refunds will be processed within 5-7 business days and credited to your original payment method. You'll receive email confirmation once processed.
              </p>
            </div>

            <div>
              <p className="font-semibold text-foreground mb-2">Non-Returnable Items:</p>
              <ul className="list-disc list-inside space-y-1 ml-2">
                <li>Products beyond the 24-hour window</li>
                <li>Items consumed or used</li>
                <li>Custom or special orders (unless damaged)</li>
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Contact CTA Section */}
      <div className="mt-12 text-center border border-border rounded-lg p-8 bg-muted/30">
        <h3 className="text-xl font-semibold text-foreground mb-3">
          Have questions about our policies?
        </h3>
        <p className="text-muted-foreground mb-6">
          Our customer support team is here to help you with any questions or concerns.
        </p>
        <Link href="/contact">
          <Button size="lg" className="shadow-md hover:shadow-lg transition-all">
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  );
}
