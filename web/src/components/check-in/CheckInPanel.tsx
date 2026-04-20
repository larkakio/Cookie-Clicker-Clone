"use client";

import { encodeFunctionData } from "viem";
import { base } from "wagmi/chains";
import {
  useChainId,
  useConnection,
  useSendTransaction,
  useSwitchChain,
} from "wagmi";
import { getCheckInCalldata } from "@/lib/builder/data-suffix";
import { getCheckInContractAddress } from "@/lib/env/public";
import { checkInAbi } from "@/lib/wagmi/check-in-abi";

export function CheckInPanel() {
  const { isConnected } = useConnection();
  const chainId = useChainId();
  const { switchChainAsync, isPending: isSwitching } = useSwitchChain();
  const { sendTransactionAsync, isPending: isSending } = useSendTransaction();

  const contract = getCheckInContractAddress();
  const disabledReason = !contract
    ? "Check-in contract not configured (set NEXT_PUBLIC_CHECK_IN_CONTRACT_ADDRESS)."
    : null;

  const busy = isSending || isSwitching;

  async function onCheckIn() {
    if (!contract || disabledReason) return;
    const baseId = base.id;
    if (chainId !== baseId) {
      await switchChainAsync({ chainId: baseId });
    }

    const encoded = encodeFunctionData({
      abi: checkInAbi,
      functionName: "checkIn",
      args: [],
    });
    const data = getCheckInCalldata(encoded);

    await sendTransactionAsync({
      to: contract,
      data,
      chainId: baseId,
      value: BigInt(0),
    });
  }

  return (
    <section className="rounded-2xl border border-fuchsia-500/25 bg-black/30 p-4">
      <h3 className="font-display text-sm font-bold uppercase tracking-widest text-fuchsia-300">
        Daily on-chain check-in
      </h3>
      <p className="mt-1 text-xs text-zinc-500">
        Once per UTC day on Base. You only pay L2 gas — no ETH sent to the contract.
      </p>
      <button
        type="button"
        disabled={!isConnected || Boolean(disabledReason) || busy}
        onClick={() => void onCheckIn()}
        className="mt-3 w-full rounded-xl border border-fuchsia-500/40 bg-fuchsia-500/10 py-3 text-sm font-semibold text-fuchsia-100 hover:bg-fuchsia-500/20 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {!isConnected
          ? "Connect wallet to check in"
          : disabledReason
            ? "Check-in unavailable"
            : busy
              ? "Confirm in wallet…"
              : "Check in on Base"}
      </button>
      {disabledReason ? (
        <p className="mt-2 text-xs text-amber-400/90">{disabledReason}</p>
      ) : null}
    </section>
  );
}
