'use client';

import { motion, type HTMLMotionProps } from 'framer-motion';
import * as React from 'react';

import { VIEWPORT_ONCE } from '@/constants/animation';
import { revealVariants, type RevealVariant } from '@/lib/motion';
import { cn } from '@/lib/utils';

interface RevealProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'whileInView'> {
  /** Which shared variant to play. */
  variant?: RevealVariant;
  /** Seconds to wait before playing — for hand-tuned sequences. */
  delay?: number;
  children: React.ReactNode;
}

/**
 * Scroll-triggered entrance.
 *
 * Wrap anything that should animate into view. Reveals once and never replays,
 * so scrolling back up stays calm. Reduced-motion users get the final state
 * immediately (Framer Motion reads the OS preference internally).
 */
export function Reveal({
  variant = 'fade-up',
  delay = 0,
  className,
  children,
  ...props
}: RevealProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={revealVariants[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      transition={delay ? { delay } : undefined}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface RevealGroupProps extends Omit<HTMLMotionProps<'div'>, 'variants' | 'initial' | 'whileInView'> {
  children: React.ReactNode;
}

/**
 * Staggering parent. Direct `RevealItem` children animate in sequence.
 * Use for grids and lists so items cascade instead of popping together.
 */
export function RevealGroup({ className, children, ...props }: RevealGroupProps) {
  return (
    <motion.div
      className={cn(className)}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT_ONCE}
      {...props}
    >
      {children}
    </motion.div>
  );
}

interface RevealItemProps extends Omit<HTMLMotionProps<'div'>, 'variants'> {
  variant?: RevealVariant;
  children: React.ReactNode;
}

/** Child of `RevealGroup`. Inherits the parent's stagger timing. */
export function RevealItem({
  variant = 'fade-up',
  className,
  children,
  ...props
}: RevealItemProps) {
  return (
    <motion.div className={cn(className)} variants={revealVariants[variant]} {...props}>
      {children}
    </motion.div>
  );
}
