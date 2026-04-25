import { motion } from "framer-motion";
import type { Player } from "../game/types";

export function MatchOverScreen({
  winner,
  loser,
  onRematch,
}: {
  winner: Player;
  loser: Player;
  onRematch: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
      <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring" }} className="text-8xl">
        👑
      </motion.div>
      <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="font-display text-6xl text-amber-300 text-center">
        {winner.name} wins
      </motion.h1>
      <p className="text-arcane-muted">
        {loser.name} crumples in a heap of mispronounced syllables.
      </p>
      <motion.button
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        onClick={onRematch}
        className="px-10 py-4 rounded-full bg-amber-300 text-arcane-bg font-display text-xl tracking-wide shadow-lg shadow-amber-300/20"
      >
        Rematch
      </motion.button>
    </div>
  );
}
