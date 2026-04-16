/**
 * Comma-separated allowlist (same env as submission notification emails).
 * Trim + case-insensitive match against session email.
 */
export function parseAdminEmails(): string[] {
  const raw = process.env.ADMIN_EMAILS;
  if (!raw?.trim()) return [];
  return raw
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return parseAdminEmails().includes(normalized);
}
