import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "telemetry";
  size?: "sm" | "md" | "lg";
  href?: string;
  target?: string;
  rel?: string;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, string> = {
  primary:
    "bg-accent text-white font-medium hover:bg-accent/90 shadow-[0_0_15px_rgb(var(--accent-rgb)/0.25)] hover:shadow-[0_0_20px_rgb(var(--accent-rgb)/0.4)] active:scale-[0.98]",
  secondary:
    "bg-surface-elevated text-foreground border border-border hover:border-border-hover hover:bg-surface-hover active:scale-[0.98]",
  outline:
    "bg-transparent text-foreground border border-border hover:border-accent hover:text-accent hover:bg-accent/5 active:scale-[0.98]",
  ghost:
    "bg-transparent text-muted hover:text-foreground hover:bg-surface-elevated active:scale-[0.98]",
  telemetry:
    "font-mono text-xs uppercase tracking-wider bg-accent/10 text-accent border border-accent/40 hover:bg-accent/20 hover:border-accent shadow-[0_0_10px_rgb(var(--accent-rgb)/0.15)] active:scale-[0.98]",
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "h-8 px-3 text-xs rounded-md gap-1.5",
  md: "h-10 px-4 text-sm rounded-lg gap-2",
  lg: "h-12 px-6 text-base rounded-lg gap-2.5",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      href,
      target,
      rel,
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      type = "button",
      ...props
    },
    ref
  ) => {
    const baseStyles = cn(
      "inline-flex items-center justify-center font-medium transition-all duration-200 select-none",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background",
      "disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
      variantStyles[variant],
      sizeStyles[size],
      className
    );

    const content = (
      <>
        {isLoading && (
          <svg
            className="animate-spin h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </>
    );

    // Render semantic link if href is present
    if (href && !disabled) {
      const isExternal = href.startsWith("http") || href.startsWith("mailto:");
      const computedRel = isExternal ? (rel ?? "noopener noreferrer") : rel;

      return (
        <Link
          ref={ref as unknown as React.Ref<HTMLAnchorElement>}
          href={href}
          target={target}
          rel={computedRel}
          className={baseStyles}
          {...(props as unknown as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        className={baseStyles}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = "Button";
