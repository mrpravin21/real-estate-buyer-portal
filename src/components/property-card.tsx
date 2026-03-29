"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LikeToggle } from "@/components/property-like-toggle";

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(n);
}

export function PropertyCard({
  title,
  description,
  location,
  price,
  imageUrl,
  isFavourite,
  busy,
  onToggleLike,
  onViewDetails,
  variant = "grid",
}: {
  title: string;
  description: string;
  location: string;
  price: number;
  imageUrl: string | null;
  isFavourite: boolean;
  busy?: boolean;
  onToggleLike: (e: React.MouseEvent) => void;
  onViewDetails: () => void;
  variant?: "grid" | "wide";
}) {
  const img =
    imageUrl ??
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      onClick={onViewDetails}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-burgundy-800/10 bg-cream-50 text-left shadow-soft transition-shadow hover:shadow-glow ${
        variant === "wide" ? "sm:flex" : ""
      }`}
    >
      <div
        className={`relative shrink-0 overflow-hidden bg-cream-200 ${
          variant === "wide" ? "sm:w-2/5" : "aspect-[16/10]"
        }`}
      >
        <Image
          src={img}
          alt=""
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          unoptimized={img.startsWith("data:")}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-burgundy-900/55 to-transparent opacity-70 transition group-hover:opacity-90" />
        <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-cream-50/95 px-3 py-1 text-xs font-semibold text-burgundy-800 shadow-sm">
          {location}
        </span>
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition duration-300 group-hover:opacity-100">
          <span className="rounded-xl border border-gold-500/50 bg-cream-50/95 px-5 py-2.5 text-sm font-semibold tracking-wide text-burgundy-800 shadow-glow">
            View more
          </span>
        </div>
        <div
          className="absolute bottom-3 right-3 z-10"
          onClick={(e) => e.stopPropagation()}
        >
          <LikeToggle liked={isFavourite} busy={busy} onClick={onToggleLike} />
        </div>
      </div>
      <div
        className={`flex flex-1 flex-col p-5 ${variant === "wide" ? "sm:p-6" : ""}`}
      >
        <div className="mb-2 flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-snug text-burgundy-800">
            {title}
          </h3>
          <span className="shrink-0 rounded-lg bg-gold-400/25 px-2.5 py-1 text-sm font-bold text-burgundy-900">
            {formatPrice(price)}
          </span>
        </div>
        <p className="line-clamp-2 text-sm leading-relaxed text-burgundy-800/75">
          {description}
        </p>
        <p className="mt-3 text-xs font-medium text-gold-600/90">
          Tap for details · heart to save
        </p>
      </div>
    </motion.article>
  );
}
