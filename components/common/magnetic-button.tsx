'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import { MAGNETIC_STRENGTH } from '@/constants/animation';
import { useMagnetic } from '@/hooks/use-magnetic';
import { cn } from '@/lib/utils';

interface MagneticButtonProps extends ButtonProps {
  /** Max px the button drifts toward the cursor. */
  strength?: number;
  /** Classes for the motion wrapper rather than the button itself. */
  wrapperClassName?: string;
}

/**
 * Button with pointer attraction.
 *
 * The wrapper tracks the cursor and springs back on exit; the button inside is
 * an ordinary `Button`, so `asChild`, variants and sizes all still work.
 * Automatically inert for touch input and reduced-motion users.
 */
export function MagneticButton({
  strength = MAGNETIC_STRENGTH,
  wrapperClassName,
  className,
  children,
  ...props
}: MagneticButtonProps) {
  const { x, y, onPointerMove, onPointerLeave } = useMagnetic(strength);

  return (
    <motion.div
      className={cn('inline-flex', wrapperClassName)}
      style={{ x, y }}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      <Button className={className} {...props}>
        {children}
      </Button>
    </motion.div>
  );
}
