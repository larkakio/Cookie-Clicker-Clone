"use client";

import { useCallback, useRef } from "react";

type Props = {
  onSwipe: (distance: number) => void;
  disabled?: boolean;
};

export function SwipeField({ onSwipe, disabled }: Props) {
  const startRef = useRef<{ x: number; y: number } | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  const handleEnd = useCallback(
    (clientX: number, clientY: number) => {
      const s = startRef.current;
      startRef.current = null;
      if (!s || disabled) return;
      const d = Math.hypot(clientX - s.x, clientY - s.y);
      onSwipe(d);
    },
    [disabled, onSwipe],
  );

  return (
    <div
      ref={surfaceRef}
      className="relative flex min-h-[220px] w-full touch-none select-none flex-col items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/40 bg-gradient-to-br from-[#0d1220] via-[#080c14] to-[#120818] shadow-[inset_0_0_60px_rgba(0,245,255,0.08),0_0_40px_rgba(255,0,229,0.12)]"
      style={{ touchAction: "none" }}
      onPointerDown={(e) => {
        if (disabled) return;
        startRef.current = { x: e.clientX, y: e.clientY };
        surfaceRef.current?.setPointerCapture(e.pointerId);
      }}
      onPointerUp={(e) => {
        handleEnd(e.clientX, e.clientY);
      }}
      onPointerCancel={() => {
        startRef.current = null;
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.12] animate-grid-drift"
        style={{
          backgroundImage: `
            linear-gradient(90deg, rgba(0,245,255,0.25) 1px, transparent 1px),
            linear-gradient(rgba(255,0,229,0.2) 1px, transparent 1px),
            linear-gradient(135deg, transparent 40%, rgba(200,255,0,0.04) 50%, transparent 60%)
          `,
          backgroundSize: "48px 48px, 48px 48px, 100% 100%",
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,245,255,0.15)_0%,transparent_65%)]" />
      <div className="relative z-[1] flex flex-col items-center gap-2 px-4 text-center">
        <div className="font-display animate-neon-pulse text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-lime-300">
          SWIPE THE CORE
        </div>
        <p className="max-w-xs text-xs leading-relaxed text-zinc-400">
          Drag fast across the field to channel cookies. Short taps do nothing — commit to the
          motion.
        </p>
        <div className="mt-2 h-16 w-16 rounded-full border-2 border-cyan-400/50 bg-cyan-500/10 shadow-[0_0_24px_rgba(0,245,255,0.35)]" />
      </div>
    </div>
  );
}
