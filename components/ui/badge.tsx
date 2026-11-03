import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

/** Chip used for technologies, categories and years. */
const badgeVariants = cva(
  cn(
    'inline-flex items-center rounded-full border px-3 py-1',
    'font-mono text-xs uppercase tracking-[0.08em]',
    'transition-colors duration-300 ease-premium',
  ),
  {
    variants: {
      variant: {
        default: 'border-foreground/30 bg-secondary/60 text-foreground/75',
        outline: 'border-foreground/30 bg-transparent text-foreground/75',
        solid: 'border-transparent bg-foreground text-background',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
