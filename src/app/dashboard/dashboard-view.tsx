"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { PropertyCard } from "@/components/property-card";
import { PropertyDetailModal } from "@/components/property-detail-modal";
import { SignOutButton } from "@/components/sign-out-button";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { apiFetch } from "@/lib/api-client";
import type { Property, UserPublic } from "@/lib/types";

type FavApi = {
  propertyId: string;
  title: string;
  description: string;
  location: string;
  price: number;
  imageUrl: string | null;
  areaSqft: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  parkingSpots: number | null;
  floors: number | null;
  distanceMartM: number | null;
  distanceHospitalM: number | null;
  facing: string | null;
  yearBuilt: number | null;
  favouritedAt: string;
};

function favToProperty(f: FavApi): Property {
  return {
    id: f.propertyId,
    title: f.title,
    description: f.description,
    location: f.location,
    price: f.price,
    imageUrl: f.imageUrl,
    areaSqft: f.areaSqft,
    bedrooms: f.bedrooms,
    bathrooms: f.bathrooms,
    parkingSpots: f.parkingSpots,
    floors: f.floors,
    distanceMartM: f.distanceMartM,
    distanceHospitalM: f.distanceHospitalM,
    facing: f.facing,
    yearBuilt: f.yearBuilt,
  };
}

export function DashboardView() {
  const router = useRouter();
  const [user, setUser] = useState<UserPublic | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [favourites, setFavourites] = useState<FavApi[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [detailProperty, setDetailProperty] = useState<Property | null>(null);

  const favouriteIds = useMemo(
    () => new Set(favourites.map((f) => f.propertyId)),
    [favourites]
  );

  const refresh = useCallback(async () => {
    setLoadError(null);
    try {
      const [me, props, favs] = await Promise.all([
        apiFetch<{ user: UserPublic }>("/api/auth/me"),
        apiFetch<{ properties: Property[] }>("/api/properties"),
        apiFetch<{ favourites: FavApi[] }>("/api/favourites"),
      ]);

      if (!me.ok) {
        router.replace("/login?next=/dashboard");
        return;
      }

      if (!me.data.user) {
        setLoadError("Your session could not be loaded.");
        router.replace("/login?next=/dashboard");
        return;
      }

      setUser(me.data.user);

      if (!props.ok) {
        setLoadError(props.error);
        return;
      }
      if (!favs.ok) {
        setLoadError(favs.error);
        return;
      }

      setProperties(props.data.properties);
      setFavourites(favs.data.favourites);
    } catch {
      setLoadError("Could not load the dashboard. Please refresh the page.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

  async function toggleFavourite(propertyId: string, next: boolean) {
    setBusyId(propertyId);
    if (next) {
      const res = await apiFetch("/api/favourites", {
        method: "POST",
        body: JSON.stringify({ propertyId }),
      });
      setBusyId(null);
      if (!res.ok) {
        setToast(res.error);
        return;
      }
      setToast("Saved to your likes.");
    } else {
      const res = await apiFetch(`/api/favourites/${propertyId}`, {
        method: "DELETE",
      });
      setBusyId(null);
      if (!res.ok) {
        setToast(res.error);
        return;
      }
      setToast("Removed from likes.");
    }
    await refresh();
  }

  if (loading) {
    return (
      <div className="flex min-h-0 flex-1 items-center justify-center text-burgundy-800/60">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.2 }}
          className="font-display text-lg"
        >
          Preparing your dashboard…
        </motion.div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center px-4 py-16 sm:px-6">
        <div className="w-full max-w-lg rounded-2xl border border-burgundy-600/20 bg-cream-100/60 p-6 text-center">
          <p className="font-display text-xl text-burgundy-900">
            Dashboard is unavailable right now
          </p>
          <p className="mt-2 text-sm text-burgundy-800/70">
            {loadError ?? "Please try loading your dashboard again."}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Button
              onClick={() => {
                setLoading(true);
                void refresh();
              }}
            >
              Retry
            </Button>
            <Link href="/">
              <Button variant="ghost">Back to home</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const detailLiked = detailProperty
    ? favouriteIds.has(detailProperty.id)
    : false;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <SiteHeader
        homeHref="/dashboard"
        right={
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/dashboard">
              <Button variant="ghost" className="hidden px-3 text-xs sm:inline-flex sm:text-sm">
                Home
              </Button>
            </Link>
            <SignOutButton className="px-3 text-xs sm:text-sm" />
          </div>
        }
      />

      <PropertyDetailModal
        property={detailProperty}
        onClose={() => setDetailProperty(null)}
        isFavourite={detailLiked}
        busy={detailProperty ? busyId === detailProperty.id : false}
        onToggleLike={() => {
          if (!detailProperty) return;
          void toggleFavourite(detailProperty.id, !detailLiked);
        }}
      />

      <AnimatePresence mode="wait">
        {toast ? (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="fixed left-1/2 top-20 z-50 -translate-x-1/2 rounded-xl border border-gold-500/40 bg-cream-50 px-5 py-3 text-sm font-medium text-burgundy-800 shadow-glow"
            role="status"
          >
            {toast}
          </motion.div>
        ) : null}
      </AnimatePresence>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-8 sm:px-6 sm:pt-12">
        {loadError ? (
          <p className="mb-8 rounded-xl border border-burgundy-600/30 bg-burgundy-600/10 px-4 py-3 text-sm text-burgundy-800">
            {loadError}
          </p>
        ) : null}

        <section className="relative overflow-hidden rounded-3xl border border-burgundy-800/10 bg-gradient-to-br from-burgundy-800 via-burgundy-700 to-burgundy-900 p-8 text-cream-50 shadow-glow sm:p-10">
          <div className="pointer-events-none absolute -right-16 top-0 h-48 w-48 rounded-full bg-gold-500/20 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-32 w-64 rounded-full bg-cream-50/10 blur-2xl" />
          <div className="relative flex flex-col gap-8 sm:flex-row sm:items-center">
            <div className="shrink-0">
              {user.avatarUrl ? (
                <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-2xl border-[3px] border-gold-400/70 shadow-glow ring-2 ring-cream-50/25 sm:mx-0 sm:h-32 sm:w-32">
                  {/* eslint-disable-next-line @next/next/no-img-element -- data URLs from registration */}
                  <img
                    src={user.avatarUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
              ) : (
                <div className="mx-auto flex h-28 w-28 items-center justify-center rounded-2xl border-[3px] border-gold-400/50 bg-gradient-to-br from-gold-400 to-burgundy-900 font-display text-3xl font-semibold text-cream-50 shadow-glow sm:mx-0 sm:h-32 sm:w-32 sm:text-4xl">
                  {user.name.slice(0, 1).toUpperCase()}
                </div>
              )}
            </div>
            <div className="min-w-0 flex-1 text-center sm:text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold-400">
                Buyer dashboard
              </p>
              <h1 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
                Hello, {user.name}
              </h1>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream-100/85">
                Signed in as{" "}
                <span className="font-medium text-cream-50">{user.email}</span>{" "}
                · Role{" "}
                <span className="rounded-md bg-gold-500/25 px-2 py-0.5 font-semibold text-gold-400">
                  {user.role}
                </span>
                . Browse listings and tap the heart to save what you love.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-14">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="font-display text-2xl font-semibold text-burgundy-900">
                My likes
              </h2>
              <p className="mt-1 text-sm text-burgundy-800/65">
                Only you can see or change this list.
              </p>
            </div>
            <span className="rounded-full border border-gold-500/50 bg-gold-400/15 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-burgundy-900">
              {favourites.length} saved
            </span>
          </div>
          {favourites.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-burgundy-800/20 bg-cream-100/50 px-6 py-14 text-center">
              <p className="font-display text-lg text-burgundy-800">No likes yet</p>
              <p className="mt-2 text-sm text-burgundy-800/60">
                Heart properties below — they show up here instantly.
              </p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2">
              {favourites.map((f) => {
                const p = favToProperty(f);
                return (
                  <PropertyCard
                    key={f.propertyId}
                    title={f.title}
                    description={f.description}
                    location={f.location}
                    price={f.price}
                    imageUrl={f.imageUrl}
                    isFavourite
                    busy={busyId === f.propertyId}
                    onToggleLike={(e) => {
                      e.stopPropagation();
                      void toggleFavourite(f.propertyId, false);
                    }}
                    onViewDetails={() => setDetailProperty(p)}
                    variant="wide"
                  />
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-16">
          <div className="mb-6">
            <h2 className="font-display text-2xl font-semibold text-burgundy-900">
              Discover properties
            </h2>
            <p className="mt-1 text-sm text-burgundy-800/65">
              Open a listing for full details, or use the heart to save it.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {properties.map((p) => (
              <PropertyCard
                key={p.id}
                title={p.title}
                description={p.description}
                location={p.location}
                price={p.price}
                imageUrl={p.imageUrl}
                isFavourite={favouriteIds.has(p.id)}
                busy={busyId === p.id}
                onToggleLike={(e) => {
                  e.stopPropagation();
                  void toggleFavourite(p.id, !favouriteIds.has(p.id));
                }}
                onViewDetails={() => setDetailProperty(p)}
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
