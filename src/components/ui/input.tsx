"use client";

import type { InputHTMLAttributes } from "react";

export function Input({
  className = "",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={`w-full rounded-xl border border-burgundy-800/15 bg-cream-50/90 px-4 py-3 text-burgundy-800 shadow-inner outline-none transition placeholder:text-burgundy-800/40 focus:border-gold-500 focus:ring-2 focus:ring-gold-400/40 ${className}`}
      {...props}
    />
  );
}

export function Label({
  children,
  htmlFor,
}: {
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-burgundy-800/70"
    >
      {children}
    </label>
  );
}
