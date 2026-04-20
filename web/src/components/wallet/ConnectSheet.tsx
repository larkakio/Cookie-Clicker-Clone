"use client";

import { useState } from "react";
import { base } from "wagmi/chains";
import { useConnect } from "wagmi";

type Props = {
  open: boolean;
  onClose: () => void;
};

export function ConnectSheet({ open, onClose }: Props) {
  const { connectors, connectAsync, isPending } = useConnect();
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="connect-title"
    >
      <div className="w-full max-w-md rounded-t-2xl border border-cyan-500/30 bg-[#0a0a12] p-6 shadow-[0_0_40px_rgba(0,245,255,0.15)] sm:rounded-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 id="connect-title" className="font-display text-lg font-bold tracking-wide text-cyan-300">
            Connect wallet
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-white/5 hover:text-white"
          >
            Close
          </button>
        </div>
        <p className="mb-4 text-sm text-zinc-400">
          Choose a wallet. You will be asked to use the Base network for on-chain check-in.
        </p>
        <ul className="flex flex-col gap-2">
          {connectors.map((connector) => (
            <li key={connector.uid}>
              <button
                type="button"
                disabled={isPending}
                onClick={async () => {
                  setError(null);
                  try {
                    await connectAsync({
                      connector,
                      chainId: base.id,
                    });
                    onClose();
                  } catch (e) {
                    setError(e instanceof Error ? e.message : "Connection failed");
                  }
                }}
                className="flex w-full items-center justify-between rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-left text-sm font-medium text-white transition hover:border-cyan-500/50 hover:bg-cyan-500/5 disabled:opacity-40"
              >
                <span>{connector.name}</span>
              </button>
            </li>
          ))}
        </ul>
        {error ? (
          <p className="mt-3 text-sm text-rose-400" role="alert">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
