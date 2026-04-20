"use client";

import {
  startTransition,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { BUILDINGS, buildingCost, totalCps } from "@/lib/game/buildings";
import { LEVELS, maxLevel, shouldCompleteLevel } from "@/lib/game/levels";
import {
  defaultGame,
  loadGame,
  type PersistedGame,
  saveGame,
} from "@/lib/game/storage";

const SWIPE_MIN_PX = 44;
const SWIPE_COOLDOWN_MS = 72;

export type LevelToast = { level: number; title: string };

function computeLevelUp(
  prevLevel: number,
  lifetimeCookies: number,
): { level: number; toast: LevelToast | null } {
  let level = prevLevel;
  let toast: LevelToast | null = null;
  while (
    level < maxLevel() &&
    shouldCompleteLevel(level, lifetimeCookies)
  ) {
    level += 1;
    const def = LEVELS.find((l) => l.id === level);
    toast = {
      level,
      title: def?.title ?? `Level ${level}`,
    };
  }
  return { level, toast };
}

export function useGameState() {
  const [state, setState] = useState<PersistedGame>(() => defaultGame());
  const [hydrated, setHydrated] = useState(false);
  const [levelToast, setLevelToast] = useState<LevelToast | null>(null);
  const lastSwipeRef = useRef(0);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      setState(loadGame());
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveGame(state);
    }, 400);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [state, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = Math.min(0.05, (t - last) / 1000);
      last = t;
      setState((s) => {
        const cps = totalCps(s.buildings);
        const gain = cps * dt;
        if (gain <= 0) return s;
        const cookies = s.cookies + gain;
        const lifetimeCookies = s.lifetimeCookies + gain;
        const { level, toast } = computeLevelUp(s.level, lifetimeCookies);
        if (toast) {
          startTransition(() => setLevelToast(toast));
        }
        return { ...s, cookies, lifetimeCookies, level };
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [hydrated]);

  const dismissToast = useCallback(() => setLevelToast(null), []);

  const swipe = useCallback((distance: number) => {
    if (distance < SWIPE_MIN_PX) return;
    const now = performance.now();
    if (now - lastSwipeRef.current < SWIPE_COOLDOWN_MS) return;
    lastSwipeRef.current = now;

    setState((s) => {
      const base = 3 + s.level * 0.35;
      const gain = base * s.swipeMult * (0.92 + Math.random() * 0.16);
      const cookies = s.cookies + gain;
      const lifetimeCookies = s.lifetimeCookies + gain;
      const { level, toast } = computeLevelUp(s.level, lifetimeCookies);
      if (toast) {
        startTransition(() => setLevelToast(toast));
      }
      return { ...s, cookies, lifetimeCookies, level };
    });
  }, []);

  const buyBuilding = useCallback((id: string) => {
    const def = BUILDINGS.find((b) => b.id === id);
    if (!def) return;
    setState((s) => {
      const owned = s.buildings[id] ?? 0;
      const cost = buildingCost(def, owned);
      if (s.cookies < cost) return s;
      return {
        ...s,
        cookies: s.cookies - cost,
        buildings: { ...s.buildings, [id]: owned + 1 },
      };
    });
  }, []);

  const buySwipeAmp = useCallback(() => {
    setState((s) => {
      const cost = Math.ceil(250 * Math.pow(2.2, s.swipeMult - 1));
      if (s.cookies < cost) return s;
      return {
        ...s,
        cookies: s.cookies - cost,
        swipeMult: s.swipeMult + 0.25,
      };
    });
  }, []);

  return {
    state,
    hydrated,
    swipe,
    buyBuilding,
    buySwipeAmp,
    levelToast,
    dismissToast,
  };
}
