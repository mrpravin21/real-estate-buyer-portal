"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { PasswordField } from "@/components/ui/password-field";
import { saveRegisterDraft } from "@/lib/register-draft";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  function onContinue(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    saveRegisterDraft({ name, email, password, confirmPassword });
    router.push("/register/photo");
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
            Step 1 of 2
          </p>
          <h1 className="mt-2 font-display text-3xl font-semibold text-burgundy-900">
            Create your account
          </h1>
          <p className="mt-2 text-sm text-burgundy-800/70">
            Next, you&apos;ll add a profile photo so we can personalise your
            dashboard.
          </p>
          <form onSubmit={onContinue} className="mt-8 space-y-5">
            <div>
              <Label htmlFor="name">Full name</Label>
              <Input
                id="name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
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
              autoComplete="new-password"
              required
              minLength={8}
              hint="At least 8 characters."
            />
            <PasswordField
              label="Confirm password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              required
              minLength={8}
            />
            {error ? (
              <p
                className="rounded-xl border border-burgundy-600/30 bg-burgundy-600/10 px-4 py-3 text-sm text-burgundy-800"
                role="alert"
              >
                {error}
              </p>
            ) : null}
            <Button type="submit" className="w-full py-3 text-base">
              Continue
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-burgundy-800/65">
            Already registered?{" "}
            <Link
              href="/login"
              className="font-semibold text-gold-600 underline-offset-2 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </motion.div>
      </main>
    </div>
  );
}
