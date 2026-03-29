"use client";

import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api-client";
import { Button } from "@/components/ui/button";

export function SignOutButton({
  className,
  label = "Sign out",
}: {
  className?: string;
  label?: string;
}) {
  const router = useRouter();
  return (
    <Button
      variant="ghost"
      className={className}
      onClick={() => {
        void (async () => {
          await apiFetch("/api/auth/logout", { method: "POST" });
          router.replace("/");
          router.refresh();
        })();
      }}
    >
      {label}
    </Button>
  );
}
