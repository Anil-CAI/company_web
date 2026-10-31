'use client';

import { motion } from 'framer-motion';
import * as React from 'react';

import { STAGGER, VIEWPORT_ONCE } from '@/constants/animation';
import { maskReveal } from '@/lib/motion';
import { cn } from '@/lib/utils';

type TextTag = 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div';

interface AnimatedTextProps {
  /** The copy to animate. Split on whitespace into masked words. */
  text: string;
  /** Semantic element to render. Defaults to `h2`. */
  as?: TextTag;
  className?: string;
  /** Seconds before the first word starts. */
  delay?: number;
  /** Element id — used by `aria-labelledby` on sections. */
  id?: string;
}

/**
 * Masked word reveal.
 *
 * Each word sits in an `overflow-hidden` box and slides up from below, which
 * reads as a sheet of type rising rather than letters popping in.
 *
 * A literal space is rendered *between* the word boxes rather than inside them:
 * inline-block boxes with nothing between them offer no line-break opportunity,
 * so without it long headings would refuse to wrap — and `textContent` would
 * runtogetherlikethis for screen readers and copy-paste.
 */
export function AnimatedText({
  text,
  as: Component = 'h2',
  className,
  delay = 0,
  id,
}: AnimatedTextProps) {
  const words = React.useMemo(() => text.split(' ').filter(Boolean), [text]);

  return (
    <Component id={id} className={cn(className)}>
      <motion.span
        className="inline"
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT_ONCE}
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: STAGGER.tight, delayChildren: delay } },
        }}
      >
        {words.map((word, index) => (
          // Words repeat within a heading, so the index is part of the key.
          <React.Fragment key={`${word}-${index}`}>
            {/* The bottom padding keeps descenders from being clipped by the mask. */}
            <span className="inline-block overflow-hidden pb-[0.12em] align-bottom">
              <motion.span className="inline-block" variants={maskReveal}>
                {word}
              </motion.span>
            </span>
            {index < words.length - 1 ? ' ' : null}
          </React.Fragment>
        ))}
      </motion.span>
    </Component>
  );
}
