import { motion } from "framer-motion";

export function Timer({ remainingMs, totalMs, size = 240 }: { remainingMs: number; totalMs: number; size?: number }) {
  const pct = Math.max(0, Math.min(1, remainingMs / totalMs));
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - pct);
  const seconds = Math.max(0, remainingMs / 1000);
  const color =
    pct > 0.5 ? "var(--color-hp-good)" : pct > 0.25 ? "var(--color-hp-warn)" : "var(--color-hp-low)";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="var(--color-arcane-border)"
          strokeWidth={stroke}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={color}
          strokeWidth={stroke}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={c}
          animate={{ strokeDashoffset: offset }}
          transition={{ ease: "linear", duration: 0.1 }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center flex-col">
        <span className="font-display text-5xl tabular-nums" style={{ color }}>{seconds.toFixed(1)}</span>
        <span className="text-xs uppercase tracking-widest text-arcane-muted">seconds</span>
      </div>
    </div>
  );
}
