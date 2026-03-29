import { jsonOk } from "@/lib/api-response";
import { AUTH_COOKIE } from "@/lib/constants";

export async function POST() {
  const res = jsonOk({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
