import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "strong" | "dark";
  hover?: boolean;
}

export default function GlassCard({
  children,
  className,
  variant = "default",
  hover = true,
}: GlassCardProps) {
  const variants = {
    default: "glass",
    strong: "glass-strong",
    dark: "glass-dark",
  };

  return (
    <div
      className={cn(
        "rounded-xl p-6 sm:p-8 transition-all duration-300",
        variants[variant],
        hover && "hover:-translate-y-1 hover:shadow-premium-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
