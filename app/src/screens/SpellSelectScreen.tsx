import { motion } from "framer-motion";
import type { GameState } from "../game/types";
import { SpellCard } from "../components/SpellCard";
import { HpBar } from "../components/HpBar";
import { speak } from "../audio/tts";

export function SpellSelectScreen({
  state,
  onSelect,
  onCast,
}: {
  state: GameState;
  onSelect: (idx: number) => void;
  onCast: () => void;
}) {
  const [p0, p1] = state.players;
  const canCast = state.selectedIdx !== null;

  return (
    <div className="flex-1 flex flex-col px-8 py-6 gap-8">
      <header className="flex items-start justify-between">
        <HpBar name={p0.name} hp={p0.hp} active={state.active === 0} />
        <div className="text-center pt-3">
          <p className="font-mono text-xs tracking-[0.4em] text-arcane-muted">ROUND {state.round}</p>
          <p className="font-display text-2xl mt-1">
            {state.players[state.active].name}'s turn
          </p>
        </div>
        <HpBar name={p1.name} hp={p1.hp} active={state.active === 1} mirror />
      </header>

      <div className="flex-1 grid grid-cols-3 gap-6 items-stretch">
        {state.spells.map((s, i) => (
          <SpellCard
            key={s.name + i}
            spell={s}
            selected={state.selectedIdx === i}
            onSelect={() => onSelect(i)}
            onSpeak={() => speak(s.name)}
          />
        ))}
      </div>

      <div className="flex justify-center">
        <motion.button
          onClick={onCast}
          disabled={!canCast}
          whileHover={canCast ? { scale: 1.04 } : {}}
          whileTap={canCast ? { scale: 0.97 } : {}}
          className={[
            "px-12 py-4 rounded-full font-display text-2xl tracking-wide transition-all",
            canCast
              ? "bg-amber-300 text-arcane-bg shadow-lg shadow-amber-300/30"
              : "bg-arcane-panel text-arcane-muted cursor-not-allowed",
          ].join(" ")}
        >
          {canCast ? "Cast 🔮" : "Choose a spell"}
        </motion.button>
      </div>
    </div>
  );
}
