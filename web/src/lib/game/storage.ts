import { maxLevel } from "@/lib/game/levels";

export const STORAGE_KEY = "ccc_neon_v1";

export type PersistedGame = {
  cookies: number;
  lifetimeCookies: number;
  level: number;
  buildings: Record<string, number>;
  swipeMult: number;
  lastSaved: number;
};

export function defaultGame(): PersistedGame {
  return {
    cookies: 0,
    lifetimeCookies: 0,
    level: 1,
    buildings: {},
    swipeMult: 1,
    lastSaved: Date.now(),
  };
}

export function loadGame(): PersistedGame {
  if (typeof window === "undefined") return defaultGame();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultGame();
    const p = JSON.parse(raw) as PersistedGame;
    if (typeof p.cookies !== "number") return defaultGame();
    p.level = Math.min(Math.max(1, Math.floor(p.level)), maxLevel());
    p.buildings = p.buildings && typeof p.buildings === "object" ? p.buildings : {};
    p.swipeMult = typeof p.swipeMult === "number" && p.swipeMult >= 1 ? p.swipeMult : 1;
    return p;
  } catch {
    return defaultGame();
  }
}

export function saveGame(p: PersistedGame): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...p, lastSaved: Date.now() }),
    );
  } catch {
    /* quota */
  }
}
