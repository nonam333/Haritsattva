import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, Clock, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import GlassCard from "@/components/GlassCard";
import GlassButton from "@/components/GlassButton";

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export default function ContactPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactFormData) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you as soon as possible.",
      });
      setFormData({ name: "", email: "", phone: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Failed to send message",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-20">
      <div className="mb-16 text-center">
        <div className="mb-8 flex justify-center">
          <img
            src="/logo.png"
            alt="Haritsattva"
            className="w-28 h-28 object-contain drop-shadow-2xl"
          />
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-bold text-foreground mb-6 tracking-tight" data-testid="text-page-title">
          Get in <span className="text-neonMint">Touch</span>
        </h1>
        <p className="text-muted-foreground text-xl leading-relaxed max-w-3xl mx-auto">
          Have questions? We're here to help! Reach out to us anytime.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <GlassCard className="p-10 shadow-premium-lg">
            <h2 className="text-3xl font-heading font-bold mb-8 tracking-tight">Send us a message</h2>
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                    data-testid="input-name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                    data-testid="input-email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    data-testid="input-phone"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    placeholder="How can we help you?"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    rows={6}
                    required
                    data-testid="input-message"
                  />
                </div>
                <GlassButton
                  type="submit"
                  className="w-full text-lg py-6"
                  disabled={contactMutation.isPending}
                  data-testid="button-submit"
                >
                  {contactMutation.isPending ? "Sending..." : "Send Message"}
                </GlassButton>
              </form>
            </div>
          </GlassCard>
        </div>

        {/* Contact Information */}
        <div className="space-y-6">
          <GlassCard className="p-8 hover:scale-[1.02] transition-all duration-300 shadow-premium">
            <div className="flex gap-6">
              <div className="w-16 h-16 bg-neonMint/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="w-8 h-8 text-neonMint" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-2 tracking-tight">Email</h3>
                <p className="text-muted-foreground text-base mb-2">support@haritsattva.com</p>
                <p className="text-sm text-muted-foreground">
                  We'll respond within 1 hour
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 hover:scale-[1.02] transition-all duration-300 shadow-premium">
            <div className="flex gap-6">
              <div className="w-16 h-16 bg-neonMint/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Phone className="w-8 h-8 text-neonMint" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-2 tracking-tight">Phone</h3>
                <p className="text-muted-foreground text-base mb-2">+91 9953035329</p>
                <p className="text-sm text-muted-foreground">
                  Available during business hours
                </p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 hover:scale-[1.02] transition-all duration-300 shadow-premium">
            <div className="flex gap-6">
              <div className="w-16 h-16 bg-neonMint/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock className="w-8 h-8 text-neonMint" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-2 tracking-tight">Business Hours</h3>
                <p className="text-muted-foreground text-base">Monday - Saturday</p>
                <p className="text-muted-foreground text-base">8:00 AM - 8:00 PM</p>
                <p className="text-sm text-muted-foreground mt-2">Closed on Sundays</p>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-8 hover:scale-[1.02] transition-all duration-300 shadow-premium">
            <div className="flex gap-6">
              <div className="w-16 h-16 bg-neonMint/20 rounded-full flex items-center justify-center flex-shrink-0">
                <MapPin className="w-8 h-8 text-neonMint" />
              </div>
              <div>
                <h3 className="font-heading font-bold text-xl text-foreground mb-2 tracking-tight">Location</h3>
                <p className="text-muted-foreground text-base">Supertech Ecovillage 2</p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
