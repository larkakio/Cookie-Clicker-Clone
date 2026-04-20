export type BuildingDef = {
  id: string;
  name: string;
  description: string;
  baseCost: number;
  baseCps: number;
};

export const BUILDINGS: readonly BuildingDef[] = [
  {
    id: "cursor",
    name: "Neon Cursor",
    description: "Autoclicks the void.",
    baseCost: 15,
    baseCps: 0.1,
  },
  {
    id: "drone",
    name: "Pulse Drone",
    description: "Hovering micro-furnace.",
    baseCost: 100,
    baseCps: 0.5,
  },
  {
    id: "forge",
    name: "Chrome Forge",
    description: "Industrial batch glow-bake.",
    baseCost: 500,
    baseCps: 2,
  },
  {
    id: "reactor",
    name: "Plasma Reactor",
    description: "Stabilized fusion crumbs.",
    baseCost: 3_000,
    baseCps: 10,
  },
  {
    id: "array",
    name: "Lattice Array",
    description: "City-scale convection lattice.",
    baseCost: 20_000,
    baseCps: 50,
  },
] as const;

export function buildingCost(
  def: BuildingDef,
  owned: number,
): number {
  return Math.ceil(def.baseCost * Math.pow(1.15, owned));
}

export function totalCps(
  counts: Record<string, number>,
): number {
  let t = 0;
  for (const def of BUILDINGS) {
    const n = counts[def.id] ?? 0;
    t += n * def.baseCps;
  }
  return t;
}
