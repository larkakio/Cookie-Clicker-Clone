export type LevelDef = {
  id: number;
  /** Minimum lifetime cookies baked to complete this level */
  targetLifetime: number;
  title: string;
};

export const LEVELS: readonly LevelDef[] = [
  { id: 1, targetLifetime: 1_000, title: "Neon Boot" },
  { id: 2, targetLifetime: 50_000, title: "Grid Runner" },
  { id: 3, targetLifetime: 2_000_000, title: "Synth Baker" },
  { id: 4, targetLifetime: 100_000_000, title: "Arcology Oven" },
  { id: 5, targetLifetime: 5_000_000_000, title: "Omega Glaze" },
] as const;

/** Level index 1-based. Returns true when player should advance past `currentLevel`. */
export function shouldCompleteLevel(
  currentLevel: number,
  lifetimeCookies: number,
): boolean {
  const def = LEVELS.find((l) => l.id === currentLevel);
  if (!def) return false;
  return lifetimeCookies >= def.targetLifetime;
}

export function maxLevel(): number {
  return LEVELS[LEVELS.length - 1]?.id ?? 1;
}
