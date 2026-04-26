import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import type { Player, Spell } from "../game/types";

export function RoundIntroScreen({
  round,
  active,
  spells,
  generating,
  onDone,
}: {
  round: number;
  active: Player;
  spells: Spell[];
  generating: boolean;
  onDone: () => void;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (generating || spells.length === 0 || fired.current) return;
    fired.current = true;

    let cancelled = false;
    const timer = window.setTimeout(() => {
      if (!cancelled) onDone();
    }, 800);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [generating, spells, onDone]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
      <motion.div
        key={round}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <p className="font-mono text-xs tracking-[0.4em] text-arcane-muted mb-3">ROUND {round}</p>
        <h2 className="font-display text-5xl text-balance">
          {active.name}, <span className="text-amber-300">your turn</span>
        </h2>
      </motion.div>

      {generating ? (
        <div className="flex flex-col items-center gap-3">
          <div className="flex gap-2">
            <Dot delay={0} /><Dot delay={0.15} /><Dot delay={0.3} />
          </div>
          <p className="font-mono text-sm text-arcane-muted">conjuring spells...</p>
        </div>
      ) : (
        <p className="font-mono text-sm text-arcane-muted">get ready…</p>
      )}
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <motion.span
      className="w-3 h-3 rounded-full bg-amber-300"
      animate={{ y: [0, -8, 0], opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1, repeat: Infinity, delay }}
    />
  );
}
