import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

/**
 * Button.
 *
 * Primary is the emerald pill; secondary is a 1px ink outline. Every size that
 * carries text is 48px tall with 20px side padding.
 * Was: solid black, hairline outline, or bare ghost. The pill
 * radius and the long easing curve are what make it read as premium.
 */
const buttonVariants = cva(
  cn(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full',
    'text-sm font-medium transition-all duration-300 ease-premium',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    'disabled:pointer-events-none disabled:opacity-40',
    '[&_svg]:size-4 [&_svg]:shrink-0',
  ),
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-foreground hover:bg-[#0B6646]',
        outline:
          'border border-foreground/70 bg-transparent text-foreground hover:bg-foreground hover:text-background',
        secondary:
          'border border-foreground/70 bg-transparent text-foreground hover:bg-foreground hover:text-background',
        ghost: 'text-foreground hover:bg-secondary',
        link: 'text-foreground underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-9 px-4 text-[0.8125rem]',
        default: 'h-12 px-5',
        lg: 'h-12 px-5',
        icon: 'size-11',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  /** Render as the child element (e.g. a Next.js `<Link>`) instead of a button. */
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        // Native buttons default to `submit`; be explicit unless overridden.
        {...(asChild ? {} : { type: type ?? 'button' })}
        {...props}
      />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
