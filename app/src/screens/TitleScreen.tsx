import { motion } from "framer-motion";

export function TitleScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-10 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center"
      >
        <p className="font-mono text-xs tracking-[0.4em] text-arcane-muted mb-4">A TONGUE-TWISTER DUEL</p>
        <h1 className="font-display text-7xl md:text-8xl tracking-tight text-balance">
          Mage <span className="text-amber-300">Arena</span>
        </h1>
        <p className="mt-6 max-w-xl mx-auto text-arcane-muted text-balance">
          Two mages. Three spells. A microphone. Speak the incantation cleanly or watch it
          rebound on you. Pass the laptop. Last mage standing wins.
        </p>
      </motion.div>

      <motion.button
        onClick={onStart}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="px-10 py-4 rounded-full bg-amber-300 text-arcane-bg font-display text-xl tracking-wide shadow-lg shadow-amber-300/20"
      >
        Tap to start
      </motion.button>

      <p className="font-mono text-xs text-arcane-muted/60">
        microphone access required · play with one other person
      </p>
    </div>
  );
}
