export const REGISTER_DRAFT_KEY = "hh_register_draft";

export type RegisterDraft = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export function saveRegisterDraft(draft: RegisterDraft) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(REGISTER_DRAFT_KEY, JSON.stringify(draft));
}

export function loadRegisterDraft(): RegisterDraft | null {
  if (typeof window === "undefined") return null;
  const raw = sessionStorage.getItem(REGISTER_DRAFT_KEY);
  if (!raw) return null;
  try {
    const o = JSON.parse(raw) as RegisterDraft;
    if (
      typeof o.name === "string" &&
      typeof o.email === "string" &&
      typeof o.password === "string" &&
      typeof o.confirmPassword === "string"
    ) {
      return o;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export function clearRegisterDraft() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(REGISTER_DRAFT_KEY);
}
