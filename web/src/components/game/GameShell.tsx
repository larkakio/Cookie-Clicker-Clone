"use client";

import { CheckInPanel } from "@/components/check-in/CheckInPanel";
import { LevelToastOverlay } from "@/components/game/LevelToast";
import { SwipeField } from "@/components/game/SwipeField";
import { WalletBar } from "@/components/wallet/WalletBar";
import { BUILDINGS, buildingCost, totalCps } from "@/lib/game/buildings";
import { LEVELS, maxLevel } from "@/lib/game/levels";
import { formatCookies } from "@/lib/game/format";
import { useGameState } from "@/lib/game/useGameState";

export function GameShell() {
  const {
    state,
    hydrated,
    swipe,
    buyBuilding,
    buySwipeAmp,
    levelToast,
    dismissToast,
  } = useGameState();

  const cps = totalCps(state.buildings);
  const levelDef = LEVELS.find((l) => l.id === state.level);
  const progress = levelDef
    ? Math.min(1, state.lifetimeCookies / levelDef.targetLifetime)
    : 1;
  const ampCost = Math.ceil(250 * Math.pow(2.2, state.swipeMult - 1));

  return (
    <div className="flex min-h-full flex-col">
      <WalletBar />
      <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-4 px-4 pb-10 pt-4">
        <section className="rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                Cookies
              </p>
              <p className="font-display text-3xl font-black tabular-nums text-cyan-200">
                {hydrated ? formatCookies(state.cookies) : "—"}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">
                Per second
              </p>
              <p className="font-mono text-lg text-fuchsia-300">
                {hydrated ? formatCookies(cps) : "—"}
              </p>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-zinc-400">
              <span className="font-display font-semibold text-white">
                Level {state.level}
                {levelDef ? (
                  <span className="ml-2 font-normal text-zinc-500">
                    — {levelDef.title}
                  </span>
                ) : null}
              </span>
              {state.level < maxLevel() && levelDef ? (
                <span>
                  {formatCookies(state.lifetimeCookies)} /{" "}
                  {formatCookies(levelDef.targetLifetime)} lifetime
                </span>
              ) : (
                <span className="text-lime-400">Max sector</span>
              )}
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-fuchsia-500 to-lime-400 transition-[width] duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </section>

        <SwipeField onSwipe={swipe} disabled={!hydrated} />

        <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display text-sm font-bold uppercase tracking-widest text-cyan-300">
              Neon Amplifier
            </h3>
            <span className="text-xs text-zinc-500">
              ×{state.swipeMult.toFixed(2)} swipe
            </span>
          </div>
          <button
            type="button"
            onClick={buySwipeAmp}
            disabled={!hydrated || state.cookies < ampCost}
            className="w-full rounded-xl border border-lime-500/30 bg-lime-500/5 py-3 text-left text-sm text-lime-100 hover:bg-lime-500/10 disabled:opacity-40"
          >
            <span className="font-semibold">Overclock swipe gain</span>
            <span className="mt-1 block text-xs text-zinc-500">
              Cost {formatCookies(ampCost)} cookies
            </span>
          </button>
        </section>

        <section className="rounded-2xl border border-white/10 bg-black/30 p-4">
          <h3 className="font-display mb-3 text-sm font-bold uppercase tracking-widest text-fuchsia-300">
            Autobake fleet
          </h3>
          <ul className="flex flex-col gap-2">
            {BUILDINGS.map((b) => {
              const owned = state.buildings[b.id] ?? 0;
              const cost = buildingCost(b, owned);
              const can = hydrated && state.cookies >= cost;
              return (
                <li key={b.id}>
                  <button
                    type="button"
                    disabled={!can}
                    onClick={() => buyBuilding(b.id)}
                    className="flex w-full items-start justify-between gap-3 rounded-xl border border-white/5 bg-black/40 px-3 py-3 text-left hover:border-fuchsia-500/30 disabled:opacity-40"
                  >
                    <div>
                      <p className="font-medium text-white">{b.name}</p>
                      <p className="text-xs text-zinc-500">{b.description}</p>
                      <p className="mt-1 font-mono text-xs text-fuchsia-400/90">
                        +{b.baseCps}/s each · owned {owned}
                      </p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-mono text-sm text-cyan-200">
                        {formatCookies(cost)}
                      </p>
                      <p className="text-[10px] uppercase text-zinc-600">buy</p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </section>

        <CheckInPanel />
      </main>
      {levelToast ? (
        <LevelToastOverlay toast={levelToast} onDismiss={dismissToast} />
      ) : null}
    </div>
  );
}
