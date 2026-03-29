
function base64UrlToBytes(segment: string): Uint8Array {
  const pad = "=".repeat((4 - (segment.length % 4)) % 4);
  const b64 = segment.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    out[i] = binary.charCodeAt(i);
  }
  return out;
}

function timingSafeEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a[i]! ^ b[i]!;
  }
  return diff === 0;
}

export async function verifyJwtHs256Edge(
  token: string,
  secret: string
): Promise<boolean> {
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [h, p, sigEnc] = parts;
  if (!h || !p || !sigEnc) return false;

  const data = `${h}.${p}`;
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(data)
  );
  const expected = new Uint8Array(mac);
  let actual: Uint8Array;
  try {
    actual = base64UrlToBytes(sigEnc);
  } catch {
    return false;
  }
  if (!timingSafeEqual(actual, expected)) return false;

  let payload: { exp?: number };
  try {
    const json = new TextDecoder().decode(base64UrlToBytes(p));
    payload = JSON.parse(json) as { exp?: number };
  } catch {
    return false;
  }
  const exp = payload.exp;
  if (typeof exp !== "number") return false;
  return Math.floor(Date.now() / 1000) < exp;
}
