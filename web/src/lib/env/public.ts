export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const CHAIN_ID = Number(
  process.env.NEXT_PUBLIC_CHAIN_ID ?? 8453,
) as 8453;

export const BASE_APP_ID =
  process.env.NEXT_PUBLIC_BASE_APP_ID ?? "neon-cookie-core-local";

const ZERO = "0x0000000000000000000000000000000000000000";

export function getCheckInContractAddress(): `0x${string}` | null {
  const raw = process.env.NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS;
  if (!raw || raw === ZERO) return null;
  return raw as `0x${string}`;
}

export function getBuilderCode(): string | null {
  const c = process.env.NEXT_PUBLIC_BUILDER_CODE;
  return c && c.length > 0 ? c : null;
}

/** Optional raw hex suffix override (rare); takes precedence over ox generation */
export function getBuilderCodeSuffixHex(): `0x${string}` | null {
  const s = process.env.NEXT_PUBLIC_BUILDER_CODE_SUFFIX;
  if (!s || !s.startsWith("0x")) return null;
  return s as `0x${string}`;
}
