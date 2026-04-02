import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "income" | "expense" | "warning" | "accent";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  default: "bg-white/10 text-foreground",
  income: "bg-income/10 text-income",
  expense: "bg-expense/10 text-expense",
  warning: "bg-warning/10 text-warning",
  accent: "bg-accent/10 text-accent",
};

export function Badge({
  className,
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
