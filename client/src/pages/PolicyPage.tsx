import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function PolicyPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-page-title">
        Policy
      </h1>
      <p className="text-muted-foreground mb-8">
        Important information about our privacy, terms, and return policies
      </p>

      <Accordion type="single" collapsible className="w-full space-y-4">
        <AccordionItem value="privacy" className="border rounded-md px-6">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline" data-testid="accordion-privacy">
            Privacy Policy
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground space-y-4">
            <p>
              At Haritsattva, we value your privacy and are committed to protecting your personal information.
              This Privacy Policy outlines how we collect, use, and safeguard your data.
            </p>
            <p>
              <strong>Information We Collect:</strong> We collect information you provide directly, such as your
              name, email address, delivery address, and payment details when you place an order.
            </p>
            <p>
              <strong>How We Use Your Information:</strong> Your information is used to process orders, provide
              customer support, and send you updates about your deliveries. We never sell your personal data
              to third parties.
            </p>
            <p>
              <strong>Data Security:</strong> We implement industry-standard security measures to protect your
              personal information from unauthorized access or disclosure.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="terms" className="border rounded-md px-6">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline" data-testid="accordion-terms">
            Terms of Service
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground space-y-4">
            <p>
              By using Haritsattva's services, you agree to comply with and be bound by the following terms
              and conditions.
            </p>
            <p>
              <strong>Order Acceptance:</strong> All orders are subject to availability and acceptance. We reserve
              the right to refuse or cancel any order at our discretion.
            </p>
            <p>
              <strong>Pricing:</strong> Prices are subject to change without notice. The price charged will be the
              price displayed at the time of order confirmation.
            </p>
            <p>
              <strong>Delivery:</strong> We strive to deliver all orders within 24 hours. Delivery times are
              estimates and may vary based on your location and product availability.
            </p>
            <p>
              <strong>User Conduct:</strong> You agree not to use our services for any unlawful purpose or in
              any way that could damage, disable, or impair our services.
            </p>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="returns" className="border rounded-md px-6">
          <AccordionTrigger className="text-lg font-semibold hover:no-underline" data-testid="accordion-returns">
            Return Policy
          </AccordionTrigger>
          <AccordionContent className="text-muted-foreground space-y-4">
            <p>
              We want you to be completely satisfied with your purchase. If you're not happy with your order,
              we're here to help.
            </p>
            <p>
              <strong>Freshness Guarantee:</strong> If any produce arrives damaged or not up to our quality
              standards, please contact us within 24 hours of delivery for a full refund or replacement.
            </p>
            <p>
              <strong>Return Process:</strong> To initiate a return, contact our customer support team with your
              order number and photos of the affected items. We'll process your request promptly.
            </p>
            <p>
              <strong>Refund Timeline:</strong> Approved refunds will be processed within 5-7 business days and
              credited to your original payment method.
            </p>
            <p>
              <strong>Non-Returnable Items:</strong> Due to the perishable nature of our products, we cannot
              accept returns after 24 hours of delivery.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
