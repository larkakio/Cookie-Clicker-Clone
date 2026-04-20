"use client";

import type { LevelToast as LT } from "@/lib/game/useGameState";

type Props = {
  toast: LT;
  onDismiss: () => void;
};

export function LevelToastOverlay({ toast, onDismiss }: Props) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm">
      <div
        className="w-full max-w-sm rounded-2xl border border-lime-400/40 bg-[#0a0814] p-6 text-center shadow-[0_0_60px_rgba(200,255,0,0.2)]"
        role="dialog"
        aria-labelledby="level-title"
      >
        <p className="font-display text-xs font-bold uppercase tracking-[0.35em] text-lime-300">
          Sector cleared
        </p>
        <h2
          id="level-title"
          className="font-display mt-2 animate-glitch text-2xl font-black text-white"
        >
          {toast.title}
        </h2>
        <p className="mt-2 text-sm text-zinc-400">
          Level {toast.level} online. New throughput limits unlocked.
        </p>
        <button
          type="button"
          onClick={onDismiss}
          className="mt-6 w-full rounded-xl border border-lime-400/50 bg-lime-400/10 py-3 text-sm font-semibold text-lime-100 hover:bg-lime-400/20"
        >
          Continue baking
        </button>
      </div>
    </div>
  );
}
