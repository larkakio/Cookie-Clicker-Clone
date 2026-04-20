"use client";

import { useState } from "react";
import { formatEther } from "viem";
import { base } from "wagmi/chains";
import {
  useBalance,
  useChainId,
  useConnection,
  useDisconnect,
  useSwitchChain,
} from "wagmi";
import { ConnectSheet } from "@/components/wallet/ConnectSheet";

function shortAddress(a: string) {
  return `${a.slice(0, 6)}…${a.slice(-4)}`;
}

export function WalletBar() {
  const { address, isConnected, status } = useConnection();
  const chainId = useChainId();
  const { disconnect } = useDisconnect();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: bal } = useBalance({
    address,
    chainId: base.id,
    query: { enabled: Boolean(isConnected && address && chainId === base.id) },
  });

  const wrongNetwork = isConnected && chainId !== base.id;

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-[#050508]/90 backdrop-blur-md">
      {wrongNetwork ? (
        <div className="flex items-center justify-between gap-2 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm text-amber-100">
          <span>Wrong network — switch to Base to use check-in.</span>
          <button
            type="button"
            disabled={isSwitching}
            onClick={() => switchChainAsync({ chainId: base.id })}
            className="shrink-0 rounded-lg bg-amber-500/20 px-3 py-1 font-medium text-amber-50 ring-1 ring-amber-400/40 hover:bg-amber-500/30 disabled:opacity-50"
          >
            {isSwitching ? "Switching…" : "Switch to Base"}
          </button>
        </div>
      ) : null}
      <div className="mx-auto flex max-w-lg items-center justify-between gap-3 px-4 py-3">
        <div className="font-display text-xs font-bold uppercase tracking-[0.2em] text-cyan-400/90">
          Neon Cookie Core
        </div>
        <div className="flex items-center gap-2">
          {isConnected && address ? (
            <>
              {chainId === base.id && bal ? (
                <span className="hidden text-xs text-zinc-400 sm:inline">
                  {Number(formatEther(bal.value)).toFixed(4)} ETH
                </span>
              ) : null}
              <span className="rounded-lg bg-white/5 px-2 py-1 font-mono text-xs text-cyan-200">
                {shortAddress(address)}
              </span>
              <button
                type="button"
                onClick={() => disconnect()}
                className="rounded-lg border border-white/10 px-3 py-1.5 text-xs text-zinc-300 hover:bg-white/5"
              >
                Disconnect
              </button>
            </>
          ) : (
            <button
              type="button"
              disabled={status === "connecting"}
              onClick={() => setSheetOpen(true)}
              className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-100 shadow-[0_0_20px_rgba(0,245,255,0.2)] hover:bg-cyan-500/20 disabled:opacity-50"
            >
              {status === "connecting" ? "Connecting…" : "Connect wallet"}
            </button>
          )}
        </div>
      </div>
      <ConnectSheet open={sheetOpen} onClose={() => setSheetOpen(false)} />
    </header>
  );
}
