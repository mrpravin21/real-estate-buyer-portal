"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import type { Property } from "@/lib/types";
import { LikeToggle } from "@/components/property-like-toggle";

function formatPrice(n: number) {
  return new Intl.NumberFormat("en-NP", {
    style: "currency",
    currency: "NPR",
    maximumFractionDigits: 0,
  }).format(n);
}

function metersToNice(m?: number | null) {
  if (!m || m <= 0) return null;
  if (m < 950) return `${m} m walk`;
  const km = m / 1000;
  return `${km.toFixed(km >= 10 ? 0 : 1)} km drive`;
}

export function PropertyDetailModal({
  property,
  onClose,
  isFavourite,
  busy,
  onToggleLike,
}: {
  property: Property | null;
  onClose: () => void;
  isFavourite: boolean;
  busy: boolean;
  onToggleLike: () => void;
}) {
  useEffect(() => {
    if (!property) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [property, onClose]);

  useEffect(() => {
    if (property) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [property]);

  const img =
    property?.imageUrl ??
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80";

  const mart = property
    ? metersToNice(property.distanceMartM)
    : null;
  const hospital = property
    ? metersToNice(property.distanceHospitalM)
    : null;

  const hasHighlights = property
    ? property.areaSqft != null ||
      property.bedrooms != null ||
      property.bathrooms != null ||
      property.parkingSpots != null ||
      property.floors != null ||
      property.distanceMartM != null ||
      property.distanceHospitalM != null ||
      (property.facing != null && property.facing.length > 0) ||
      property.yearBuilt != null
    : false;

  return (
    <AnimatePresence>
      {property ? (
        <motion.div
          key="backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center p-4 sm:items-center"
          role="dialog"
          aria-modal="true"
          aria-labelledby="property-detail-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-burgundy-950/70 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close"
          />
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ type: "spring", damping: 26, stiffness: 320 }}
            className="relative z-10 flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-burgundy-800/15 bg-cream-50 shadow-glow sm:max-w-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-[16/9] shrink-0 bg-cream-200">
              <Image
                src={img}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 672px"
                unoptimized={img.startsWith("data:")}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-burgundy-950/70 via-transparent to-transparent" />
              <button
                type="button"
                onClick={onClose}
                className="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full border border-cream-50/40 bg-burgundy-950/50 text-cream-50 backdrop-blur-md transition hover:bg-burgundy-950/70"
                aria-label="Close"
              >
                ×
              </button>
              <span className="absolute bottom-4 left-4 rounded-full bg-cream-50/95 px-3 py-1 text-xs font-semibold text-burgundy-800 shadow-sm">
                {property.location}
              </span>
              <div className="absolute bottom-4 right-4">
                <LikeToggle
                  liked={isFavourite}
                  busy={busy}
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleLike();
                  }}
                  size="lg"
                />
              </div>
            </div>
            <div className="overflow-y-auto p-6 sm:p-8">
              <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
                <h2
                  id="property-detail-title"
                  className="font-display text-2xl font-semibold leading-tight text-burgundy-900 sm:text-3xl"
                >
                  {property.title}
                </h2>
                <span className="rounded-xl bg-gold-400/30 px-3 py-1.5 text-lg font-bold text-burgundy-900">
                  {formatPrice(property.price)}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-burgundy-800/80">
                {property.description}
              </p>
              <div className="mt-6 rounded-2xl border border-burgundy-800/10 bg-cream-100/80 p-4 text-sm text-burgundy-900">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-burgundy-800/70">
                  Property highlights
                </p>
                {hasHighlights ? (
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {property.areaSqft != null ? (
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-burgundy-800/60">
                          Area
                        </p>
                        <p className="text-sm font-medium">
                          {property.areaSqft.toLocaleString()} sq ft
                        </p>
                      </div>
                    ) : null}
                    {property.bedrooms != null ? (
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-burgundy-800/60">
                          Bedrooms
                        </p>
                        <p className="text-sm font-medium">
                          {property.bedrooms}
                        </p>
                      </div>
                    ) : null}
                    {property.bathrooms != null ? (
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-burgundy-800/60">
                          Bathrooms
                        </p>
                        <p className="text-sm font-medium">
                          {property.bathrooms}
                        </p>
                      </div>
                    ) : null}
                    {property.parkingSpots != null ? (
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-burgundy-800/60">
                          Parking
                        </p>
                        <p className="text-sm font-medium">
                          {property.parkingSpots} spot
                          {property.parkingSpots !== 1 ? "s" : ""}
                        </p>
                      </div>
                    ) : null}
                    {property.floors != null ? (
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-burgundy-800/60">
                          Floors
                        </p>
                        <p className="text-sm font-medium">
                          {property.floors}
                        </p>
                      </div>
                    ) : null}
                    {mart ? (
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-burgundy-800/60">
                          Nearest mart
                        </p>
                        <p className="text-sm font-medium">{mart}</p>
                      </div>
                    ) : null}
                    {hospital ? (
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-burgundy-800/60">
                          Nearest hospital
                        </p>
                        <p className="text-sm font-medium">{hospital}</p>
                      </div>
                    ) : null}
                    {property.facing ? (
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-burgundy-800/60">
                          Facing
                        </p>
                        <p className="text-sm font-medium">
                          {property.facing}
                        </p>
                      </div>
                    ) : null}
                    {property.yearBuilt != null ? (
                      <div>
                        <p className="text-[0.7rem] font-semibold uppercase tracking-wide text-burgundy-800/60">
                          Year built
                        </p>
                        <p className="text-sm font-medium">
                          {property.yearBuilt}
                        </p>
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed text-burgundy-800/65">
                    Extended specs are not available for this listing.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
