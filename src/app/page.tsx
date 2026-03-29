import { getSession } from "@/lib/auth/session";
import { HomePageClient } from "./home-page-client";

export default async function HomePage() {
  const session = await getSession();
  const authenticated = session != null;
  return (
    <HomePageClient
      homeHref={authenticated ? "/dashboard" : "/"}
      authenticated={authenticated}
    />
  );
}
