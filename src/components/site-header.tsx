import Link from "next/link";

export function SiteHeader({
  right,
  homeHref = "/",
}: {
  right?: React.ReactNode;
  /** When signed in, use `/dashboard` so the logo matches “home” for buyers. */
  homeHref?: string;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-burgundy-800/10 bg-cream-50/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href={homeHref}
          className="font-display max-w-[min(100%,18rem)] text-base font-semibold leading-snug tracking-tight sm:max-w-none sm:text-lg md:text-xl"
        >
          <span className="text-burgundy-800">REAL ESTATE{" "}</span>
          <span className="text-gold-600">BUYER&apos;S PORTAL</span>
        </Link>
        {right}
      </div>
    </header>
  );
}
