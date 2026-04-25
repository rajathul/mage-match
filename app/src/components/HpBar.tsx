import { motion } from "framer-motion";
import { MAX_HP } from "../game/types";

export function HpBar({ name, hp, active, mirror = false }: { name: string; hp: number; active: boolean; mirror?: boolean }) {
  const pct = Math.max(0, (hp / MAX_HP) * 100);
  const color = pct > 60 ? "var(--color-hp-good)" : pct > 30 ? "var(--color-hp-warn)" : "var(--color-hp-low)";

  return (
    <div className={`flex flex-col gap-2 ${mirror ? "items-end" : "items-start"}`}>
      <div className="flex items-center gap-3">
        {active && <span className="text-xs uppercase tracking-widest text-amber-300">⚡ casting</span>}
        <span className="font-display text-xl">{name}</span>
      </div>
      <div className="w-72 h-4 rounded-full bg-arcane-panel border border-arcane-border overflow-hidden relative">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, transformOrigin: mirror ? "right" : "left" }}
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 18 }}
        />
      </div>
      <span className="font-mono text-sm text-arcane-muted">{hp} / {MAX_HP} HP</span>
    </div>
  );
}
