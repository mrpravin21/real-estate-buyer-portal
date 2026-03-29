"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { apiFetch } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { PasswordField } from "@/components/ui/password-field";

export function LoginForm() {
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next") || "/dashboard";
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//") ? rawNext : "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await apiFetch<{ user: unknown }>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    window.location.assign(next);
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader
        right={
          <Link href="/register">
            <Button variant="ghost" className="text-sm">
              Sign up
            </Button>
          </Link>
        }
      />
      <main className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-lg flex-col justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-burgundy-800/10 bg-cream-100/70 p-8 shadow-soft backdrop-blur-md"
        >
          <h1 className="font-display text-3xl font-semibold text-burgundy-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-burgundy-800/70">
            Sign in to manage your saved properties.
          </p>
          <form onSubmit={onSubmit} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <PasswordField
              label="Password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              required
            />
            {error ? (
              <p
                className="rounded-xl border border-burgundy-600/30 bg-burgundy-600/10 px-4 py-3 text-sm text-burgundy-800"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full py-3 text-base" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-burgundy-800/65">
            New here?{" "}
            <Link
              href="/register"
              className="font-semibold text-gold-600 underline-offset-2 hover:underline"
            >
              Create an account
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
