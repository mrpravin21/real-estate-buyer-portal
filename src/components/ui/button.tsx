"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const styles: Record<Variant, string> = {
  primary:
    "bg-burgundy-700 text-cream-50 shadow-soft hover:bg-burgundy-800 border border-burgundy-800/20",
  secondary:
    "bg-gold-500 text-burgundy-900 shadow-soft hover:bg-gold-400 border border-gold-600/30",
  ghost:
    "bg-transparent text-burgundy-800 border border-burgundy-800/15 hover:bg-cream-200/60",
  danger:
    "bg-burgundy-600 text-cream-50 hover:bg-burgundy-700 border border-burgundy-800/20",
};

export function Button({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: Variant;
}) {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold tracking-wide transition-colors disabled:pointer-events-none disabled:opacity-45 ${styles[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  );
}
