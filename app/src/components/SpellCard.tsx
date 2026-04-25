import { motion } from "framer-motion";
import type { Spell } from "../game/types";

const TIER_STYLES: Record<Spell["tier"], { ring: string; label: string; glow: string; accent: string }> = {
  easy:   { ring: "ring-tier-easy",   label: "EASY",   glow: "glow-easy",   accent: "text-tier-easy" },
  medium: { ring: "ring-tier-medium", label: "MEDIUM", glow: "glow-medium", accent: "text-tier-medium" },
  hard:   { ring: "ring-tier-hard",   label: "HARD",   glow: "glow-hard",   accent: "text-tier-hard" },
};

export function SpellCard({
  spell,
  selected,
  onSelect,
  onSpeak,
}: {
  spell: Spell;
  selected: boolean;
  onSelect: () => void;
  onSpeak: () => void;
}) {
  const t = TIER_STYLES[spell.tier];
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      className={[
        "relative flex flex-col gap-3 p-5 rounded-2xl text-left",
        "bg-arcane-panel/80 backdrop-blur border border-arcane-border",
        "ring-2 transition-all",
        selected ? `${t.ring} ${t.glow}` : "ring-transparent",
      ].join(" ")}
    >
      <div className="flex items-center justify-between">
        <span className={`text-xs font-semibold tracking-widest ${t.accent}`}>{t.label}</span>
        <span
          role="button"
          aria-label="Hear pronunciation"
          onClick={(e) => {
            e.stopPropagation();
            onSpeak();
          }}
          className="text-arcane-muted hover:text-arcane-text text-lg cursor-pointer select-none"
        >
          🔊
        </span>
      </div>

      <h3 className="font-display text-2xl text-balance leading-tight">{spell.name}</h3>
      <code className="font-mono text-sm text-arcane-muted tracking-wide">{spell.phonetic}</code>

      <p className="text-sm italic text-arcane-muted/90 text-balance">{spell.flavor}</p>

      <div className="flex justify-between text-xs font-mono text-arcane-muted pt-2 border-t border-arcane-border">
        <span>DMG <span className="text-arcane-text">{spell.damage}</span></span>
        <span>BACKFIRE <span className="text-arcane-text">{spell.backfireChance}%</span></span>
      </div>
    </motion.button>
  );
}
