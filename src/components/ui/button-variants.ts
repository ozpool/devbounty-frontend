import { cva, type VariantProps } from "class-variance-authority";

/**
 * Lives in its own non-client module so server components can call it during
 * render. (Exporting it from the "use client" button.tsx turns it into a
 * client-reference proxy that throws when invoked on the server.)
 */
export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-primary text-primary-foreground shadow-glow hover:brightness-110",
        secondary: "bg-secondary text-secondary-foreground hover:brightness-110",
        outline:
          "border border-border bg-transparent hover:border-primary/50 hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        subtle: "bg-muted text-foreground hover:bg-accent",
        danger: "bg-danger text-white hover:brightness-110",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        sm: "h-9 rounded-md px-3",
        md: "h-10 px-4",
        lg: "h-12 rounded-lg px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export type ButtonVariantProps = VariantProps<typeof buttonVariants>;
