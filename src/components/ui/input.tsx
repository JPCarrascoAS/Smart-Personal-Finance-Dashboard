"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-muted"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl text-sm",
            "bg-white/5 border border-border text-foreground placeholder:text-muted/50",
            "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50",
            "transition-all duration-200",
            error && "border-expense/50 focus:ring-expense/50",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-xs text-expense">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";
