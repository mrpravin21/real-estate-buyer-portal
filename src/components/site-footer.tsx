import Link from "next/link";
import { getSession } from "@/lib/auth/session";

export async function SiteFooter() {
  const session = await getSession();
  const authed = session != null;
  const homeHref = authed ? "/dashboard" : "/";

  return (
    <footer className="mt-auto border-t border-burgundy-800/10 bg-cream-100/80 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-12 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div>
          <p className="font-display text-lg font-semibold text-burgundy-900">
            Real estate{" "}
            <span className="text-gold-600">Buyer&apos;s Portal</span>
          </p>
          <p className="mt-2 max-w-sm text-sm leading-relaxed text-burgundy-800/65">
            Discover listings and a secure buyer portal for Kathmandu &amp; Lalitpur.
          </p>
        </div>
        <nav className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-semibold text-burgundy-800/80">
          <Link href={homeHref} className="transition hover:text-gold-600">
            Home
          </Link>
          {!authed ? (
            <>
              <Link href="/login" className="transition hover:text-gold-600">
                Sign in
              </Link>
              <Link href="/register" className="transition hover:text-gold-600">
                Sign up
              </Link>
              <Link href="/dashboard" className="transition hover:text-gold-600">
                Dashboard
              </Link>
            </>
          ) : null}
        </nav>
      </div>
      <div className="border-t border-burgundy-800/10 bg-burgundy-900/5 py-4 text-center text-xs text-burgundy-800/55">
        © {new Date().getFullYear()} Real estate Buyer&apos;s Portal · Assessment demo
      </div>
    </footer>
  );
}
