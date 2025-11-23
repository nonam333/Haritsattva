import { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

export default function GlassButton({
  children,
  variant = "primary",
  size = "md",
  glow = true,
  className,
  ...props
}: GlassButtonProps) {
  const baseStyles = "font-heading font-bold transition-all duration-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed tracking-tightest";

  const variants = {
    primary: glow
      ? "bg-neonMint text-darkCharcoal hover:bg-neonMint/90 glow-neon hover:glow-neon-strong"
      : "bg-neonMint text-darkCharcoal hover:bg-neonMint/90",
    secondary: "glass text-white hover:bg-white/20 border-white/30",
    ghost: "bg-transparent text-neonMint hover:bg-neonMint/10 border border-neonMint/50",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        "hover:scale-105 active:scale-95",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
