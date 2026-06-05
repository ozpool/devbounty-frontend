"use client";

import { motion, type Variants } from "framer-motion";
import * as React from "react";

const revealVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: (delay: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] },
  }),
};

/** Fade + rise into view once, when scrolled near. */
export function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      className={className}
      variants={revealVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      custom={delay}
    >
      {children}
    </motion.div>
  );
}

/**
 * Stagger children that are <Reveal>/motion items.
 *
 * `inView` (default) reveals on scroll — right for static page sections. Set
 * `inView={false}` for dynamic lists (filtered/paginated grids) so items
 * animate on mount/data-change instead; otherwise the once-only viewport
 * observer leaves freshly-swapped items stuck at opacity 0.
 */
export function Stagger({
  children,
  className,
  gap = 0.07,
  inView = true,
}: {
  children: React.ReactNode;
  className?: string;
  gap?: number;
  inView?: boolean;
}) {
  const variants = { show: { transition: { staggerChildren: gap } } };
  if (!inView) {
    return (
      <motion.div
        className={className}
        initial="hidden"
        animate="show"
        variants={variants}
      >
        {children}
      </motion.div>
    );
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
}

/** Shared fade-rise variant for items inside a <Stagger>. */
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
};

export const MotionItem = motion.div;
export { motion };
