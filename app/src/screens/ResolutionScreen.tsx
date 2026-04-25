import { motion } from "framer-motion";
import type { Outcome, Player } from "../game/types";
import { HpBar } from "../components/HpBar";

const KIND_META: Record<Outcome["kind"], { label: string; color: string; emoji: string }> = {
  perfect:   { label: "PERFECT CAST",  color: "text-tier-easy",   emoji: "✨" },
  partial:   { label: "PARTIAL HIT",   color: "text-tier-medium", emoji: "💥" },
  fizzled:   { label: "FIZZLED",       color: "text-arcane-muted", emoji: "💨" },
  backfired: { label: "BACKFIRED",     color: "text-tier-hard",   emoji: "☠️" },
};

export function ResolutionScreen({
  outcome,
  players,
  active,
  onPass,
}: {
  outcome: Outcome;
  players: [Player, Player];
  active: 0 | 1;
  onPass: () => void;
}) {
  const meta = KIND_META[outcome.kind];
  const opponent = players[1 - active];
  const caster = players[active];
  const damageLine =
    outcome.damageDealt > 0
      ? `${opponent.name} takes ${outcome.damageDealt} damage`
      : outcome.damageToSelf > 0
      ? `${caster.name} takes ${outcome.damageToSelf} damage from the recoil`
      : `the spell dissipates harmlessly`;

  return (
    <div className="flex-1 flex flex-col px-8 py-6 gap-8">
      <header className="flex items-start justify-between">
        <HpBar name={players[0].name} hp={players[0].hp} active={false} />
        <HpBar name={players[1].name} hp={players[1].hp} active={false} mirror />
      </header>

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <motion.div initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 200 }} className="text-7xl">
          {meta.emoji}
        </motion.div>
        <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className={`font-display text-5xl ${meta.color}`}>
          {meta.label}
        </motion.h2>

        <div className="text-center max-w-2xl flex flex-col gap-2">
          <p className="font-display text-2xl">{outcome.spell.name}</p>
          <p className="font-mono text-sm text-arcane-muted">
            score: <span className="text-arcane-text">{outcome.score}%</span>
            <span className="mx-2">·</span>
            threshold: {outcome.spell.threshold}%
          </p>
          <p className="text-arcane-muted italic mt-2">
            {outcome.transcript ? <>You said: <span className="text-arcane-text not-italic">"{outcome.transcript}"</span></> : "Whisper heard nothing."}
          </p>
          <p className="mt-4 text-balance">{damageLine}.</p>
        </div>
      </div>

      <div className="flex justify-center">
        <button
          onClick={onPass}
          className="px-10 py-4 rounded-full bg-amber-300 text-arcane-bg font-display text-xl tracking-wide shadow-lg shadow-amber-300/20 hover:scale-105 active:scale-95 transition"
        >
          Pass to {players[1 - active].name} →
        </button>
      </div>
    </div>
  );
}
