"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { apiFetch } from "@/lib/api-client";
import { Button } from "@/components/ui/button";
import {
  clearRegisterDraft,
  loadRegisterDraft,
} from "@/lib/register-draft";
import { fileToAvatarDataUrl } from "@/lib/image/avatar-data-url";

export default function RegisterPhotoPage() {
  const router = useRouter();
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [draftReady, setDraftReady] = useState(false);

  useEffect(() => {
    const d = loadRegisterDraft();
    if (!d) {
      router.replace("/register");
      return;
    }
    setDraftReady(true);
  }, [router]);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    try {
      const dataUrl = await fileToAvatarDataUrl(file);
      setPreview(dataUrl);
    } catch (err) {
      setPreview(null);
      setError(err instanceof Error ? err.message : "Could not use this image.");
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const draft = loadRegisterDraft();
    if (!draft) {
      router.replace("/register");
      return;
    }
    if (!preview) {
      setError("Please choose a profile photo.");
      return;
    }
    setLoading(true);
    const res = await apiFetch<{ user: unknown }>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name: draft.name,
        email: draft.email,
        password: draft.password,
        confirmPassword: draft.confirmPassword,
        avatarDataUrl: preview,
      }),
    });
    setLoading(false);
    if (!res.ok) {
      setError(res.error);
      return;
    }
    clearRegisterDraft();
    window.location.assign("/dashboard");
  }

  if (!draftReady) {
    return (
      <div className="flex flex-1 items-center justify-center text-burgundy-800/60">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col">
      <SiteHeader
        right={
          <Link href="/login">
            <Button variant="ghost" className="text-sm">
              Sign in
            </Button>
          </Link>
        }
      />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-burgundy-800/10 bg-cream-100/70 p-8 shadow-soft backdrop-blur-md"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-gold-600">
            Step 2 of 2
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-burgundy-900">
            Profile photo
          </h1>
          <p className="mt-2 text-sm text-burgundy-800/70">
            Add a clear photo of yourself — it appears on your buyer dashboard.
            JPG, PNG, or WebP, up to about 2 MB.
          </p>
          <form onSubmit={(e) => void onSubmit(e)} className="mt-8 space-y-6">
            <label className="flex cursor-pointer flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-burgundy-800/20 bg-cream-50/80 px-6 py-10 transition hover:border-gold-500/50 hover:bg-cream-50">
              <input
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="sr-only"
                onChange={(e) => void onFile(e)}
              />
              {preview ? (
                <div className="relative h-36 w-36 overflow-hidden rounded-2xl border-2 border-gold-500/40 shadow-soft">
                  <Image
                    src={preview}
                    alt="Preview"
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-36 w-36 items-center justify-center rounded-2xl border border-burgundy-800/15 bg-cream-200/60 text-sm font-medium text-burgundy-800/60">
                  Tap to upload
                </div>
              )}
              <span className="text-center text-sm font-semibold text-burgundy-800">
                {preview ? "Choose a different photo" : "Choose photo"}
              </span>
            </label>
            {error ? (
              <p
                className="rounded-xl border border-burgundy-600/30 bg-burgundy-600/10 px-4 py-3 text-sm text-burgundy-800"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
              <Button
                type="button"
                variant="ghost"
                className="order-2 sm:order-1"
                onClick={() => router.push("/register")}
              >
                Back
              </Button>
              <Button
                type="submit"
                className="order-1 flex-1 sm:order-2 sm:max-w-xs"
                disabled={loading || !preview}
              >
                {loading ? "Creating account…" : "Continue"}
              </Button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}
