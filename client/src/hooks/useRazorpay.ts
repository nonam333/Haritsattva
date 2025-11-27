import { useState } from "react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "./use-toast";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: RazorpayPaymentResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
  method?: {
    upi?: boolean;
    card?: boolean;
    netbanking?: boolean;
    wallet?: boolean;
  };
  modal?: {
    ondismiss?: () => void;
  };
}

interface RazorpayPaymentResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface UseRazorpayReturn {
  initiatePayment: (orderId: string, amount: number, userDetails?: {
    name?: string;
    email?: string;
    phone?: string;
  }) => Promise<void>;
  isProcessing: boolean;
  error: string | null;
}

export function useRazorpay(): UseRazorpayReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const initiatePayment = async (
    orderId: string,
    amount: number,
    userDetails?: {
      name?: string;
      email?: string;
      phone?: string;
    }
  ): Promise<void> => {
    setIsProcessing(true);
    setError(null);

    try {
      // Step 1: Create Razorpay order
      const response = await apiRequest("POST", "/api/payments/create-order", {
        orderId,
        amount: amount.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create payment order");
      }

      const { razorpayOrderId, key_id, amount: razorpayAmount, currency } = await response.json();

      // Step 2: Initialize Razorpay checkout
      const options: RazorpayOptions = {
        key: key_id,
        amount: razorpayAmount,
        currency: currency,
        name: "Haritsattva",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async (response: RazorpayPaymentResponse) => {
          // Step 3: Verify payment on backend
          try {
            const verifyResponse = await apiRequest("POST", "/api/payments/verify", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId,
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            toast({
              title: "Payment Successful!",
              description: "Your order has been confirmed.",
            });

            // Reload page to show updated order
            window.location.href = "/checkout?success=true";
          } catch (verifyError: any) {
            console.error("Payment verification error:", verifyError);
            toast({
              title: "Payment Verification Failed",
              description: verifyError.message || "Please contact support",
              variant: "destructive",
            });
            setError(verifyError.message);
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: userDetails?.name || "",
          email: userDetails?.email || "",
          contact: userDetails?.phone || "",
        },
        theme: {
          color: "#10b981", // Neon mint color
        },
        method: {
          upi: true,
          card: false, // Phase 1: UPI only
          netbanking: false,
          wallet: false,
        },
        modal: {
          ondismiss: () => {
            setIsProcessing(false);
            toast({
              title: "Payment Cancelled",
              description: "You cancelled the payment process",
              variant: "destructive",
            });
          },
        },
      };

      // Check if Razorpay is loaded
      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not loaded");
      }

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", (response: any) => {
        console.error("Payment failed:", response.error);
        toast({
          title: "Payment Failed",
          description: response.error.description || "Please try again",
          variant: "destructive",
        });
        setError(response.error.description);
        setIsProcessing(false);
      });

      rzp.open();
    } catch (err: any) {
      console.error("Payment initiation error:", err);
      setError(err.message);
      toast({
        title: "Payment Error",
        description: err.message || "Failed to initiate payment",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  return {
    initiatePayment,
    isProcessing,
    error,
  };
}
