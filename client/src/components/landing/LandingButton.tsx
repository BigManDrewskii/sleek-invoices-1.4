import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface LandingButtonProps {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "default" | "lg";
  showIcon?: boolean;
  className?: string;
}

export function LandingButton({
  children,
  href,
  variant = "primary",
  size = "lg",
  showIcon = true,
  className,
}: LandingButtonProps) {
  return (
    <Button
      asChild
      size={size}
      variant={
        variant === "outline"
          ? "outline"
          : variant === "ghost"
            ? "ghost"
            : "default"
      }
      className={className}
    >
      <a href={href}>
        {children}
        {showIcon && <ArrowRight className="ml-2 h-4 w-4" />}
      </a>
    </Button>
  );
}
