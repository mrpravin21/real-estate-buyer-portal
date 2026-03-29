"use client";

import { motion } from "framer-motion";

export function LikeToggle({
  liked,
  busy,
  onClick,
  size = "md",
}: {
  liked: boolean;
  busy?: boolean;
  onClick: (e: React.MouseEvent) => void;
  size?: "md" | "lg";
}) {
  const dim = size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const icon = size === "lg" ? "h-6 w-6" : "h-5 w-5";

  return (
    <motion.button
      type="button"
      whileTap={{ scale: busy ? 1 : 0.9 }}
      disabled={busy}
      onClick={onClick}
      className={`${dim} flex items-center justify-center rounded-full border-2 shadow-soft backdrop-blur-md transition-colors disabled:opacity-50 ${
        liked
          ? "border-gold-500 bg-gold-400/90 text-burgundy-900"
          : "border-cream-50/60 bg-cream-50/90 text-burgundy-700 hover:border-gold-500/70 hover:bg-cream-50"
      }`}
      aria-label={liked ? "Unlike" : "Like"}
      aria-pressed={liked}
    >
      {busy ? (
        <span className={`${icon} animate-pulse rounded-full bg-burgundy-800/20`} />
      ) : (
        <svg
          className={icon}
          viewBox="0 0 24 24"
          fill={liked ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
      )}
    </motion.button>
  );
}
