"use client";

import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, options, placeholder, ...props }, ref) => {
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
        <select
          ref={ref}
          id={id}
          className={cn(
            "w-full px-4 py-2.5 rounded-xl text-sm appearance-none",
            "bg-white/5 border border-border text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50",
            "transition-all duration-200",
            error && "border-expense/50 focus:ring-expense/50",
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" className="bg-background">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-background">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="text-xs text-expense">{error}</p>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
