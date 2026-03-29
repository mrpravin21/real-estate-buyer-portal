"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import { SignOutButton } from "@/components/sign-out-button";
import { Button } from "@/components/ui/button";

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.08 * i,
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
};

export function HomePageClient({
  homeHref,
  authenticated,
}: {
  homeHref: string;
  authenticated: boolean;
}) {
  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader
        homeHref={homeHref}
        right={
          authenticated ? (
            <div className="flex gap-2">
              <Link href="/dashboard">
                <Button className="px-4 py-2 text-xs sm:text-sm">Dashboard</Button>
              </Link>
              <SignOutButton className="px-4 py-2 text-xs sm:text-sm" />
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/login">
                <Button variant="ghost" className="px-4 py-2 text-xs sm:text-sm">
                  Sign in
                </Button>
              </Link>
              <Link href="/register">
                <Button className="px-4 py-2 text-xs sm:text-sm">Sign up</Button>
              </Link>
            </div>
          )
        }
      />
      <main className="relative flex-1 overflow-hidden">
        <div className="pointer-events-none absolute -right-32 top-20 h-96 w-96 rounded-full bg-gold-400/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-burgundy-700/10 blur-3xl" />

        <section className="mx-auto max-w-6xl px-4 pb-24 pt-16 sm:px-6 sm:pt-24 lg:pt-32">
          <motion.p
            custom={0}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold-500/40 bg-cream-100/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-burgundy-700"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
            Kathmandu · Buyer portal
          </motion.p>
          <motion.h1
            custom={1}
            variants={fade}
            initial="hidden"
            animate="show"
            className="font-display max-w-3xl text-4xl font-semibold leading-[1.1] tracking-tight text-burgundy-900 sm:text-5xl lg:text-6xl"
          >
            Curated homes.
            <span className="block text-gold-600">Your shortlist, secured.</span>
          </motion.h1>
          <motion.p
            custom={2}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-xl text-lg leading-relaxed text-burgundy-800/80"
          >
            Create an account, explore featured listings, and keep every
            favourite in one elegant dashboard.
          </motion.p>
          <motion.div
            custom={3}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-10 flex flex-wrap gap-4"
          >
            {authenticated ? (
              <Link href="/dashboard">
                <Button className="min-w-[160px] px-8 py-3 text-base">
                  Go to dashboard
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/register">
                  <Button className="min-w-[160px] px-8 py-3 text-base">
                    Create account
                  </Button>
                </Link>
                <Link href="/login">
                  <Button variant="secondary" className="min-w-[160px] px-8 py-3 text-base">
                    I already have an account
                  </Button>
                </Link>
              </>
            )}
          </motion.div>

          <motion.div
            custom={4}
            variants={fade}
            initial="hidden"
            animate="show"
            className="mt-20 grid gap-6 sm:grid-cols-3"
          >
            {[
              {
                title: "JWT-secured sessions",
                body: "Passwords are hashed and tokens live in httpOnly cookies.",
              },
              {
                title: "Your likes only",
                body: "Every request is scoped to the signed-in buyer.",
              },
              {
                title: "Supabase PostgreSQL",
                body: "Reliable SQL storage for users, listings, and likes.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-burgundy-800/10 bg-cream-100/60 p-6 shadow-soft backdrop-blur-sm"
              >
                <div className="mb-3 h-1 w-10 rounded-full bg-gold-500" />
                <h2 className="font-display text-lg font-semibold text-burgundy-800">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-burgundy-800/70">
                  {item.body}
                </p>
              </div>
            ))}
          </motion.div>
        </section>
      </main>
    </div>
  );
}
