import Link from "next/link";
import { getSession } from "@/lib/auth/session";

const GITHUB_REPO = "https://github.com/mrpravin21/real-estate-buyer-portal";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width={20}
      height={20}
      aria-hidden
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908.62.07.608.07.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

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
        <nav className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold text-burgundy-800/80">
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
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex shrink-0 items-center justify-center rounded-full p-2 text-burgundy-800 transition hover:bg-burgundy-900/6 hover:text-gold-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-500/50"
            aria-label="View source on GitHub"
          >
            <GitHubIcon className="size-5 shrink-0 text-burgundy-800" />
          </a>
        </nav>
      </div>
      <div className="border-t border-burgundy-800/10 bg-burgundy-900/5 py-4 text-center text-xs text-burgundy-800/55">
        © {new Date().getFullYear()} Real estate Buyer&apos;s Portal · Assessment demo
      </div>
    </footer>
  );
}
