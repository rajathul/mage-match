export type Tier = "easy" | "medium" | "hard";

export type Spell = {
  name: string;
  phonetic: string;
  damage: number;
  backfireChance: number;
  threshold: number;
  flavor: string;
  tier: Tier;
};

export type Outcome = {
  kind: "perfect" | "partial" | "fizzled" | "backfired";
  score: number;
  damageDealt: number;
  damageToSelf: number;
  transcript: string;
  spell: Spell;
  caster: 0 | 1;
};

export type Screen =
  | "title"
  | "roundIntro"
  | "spellSelect"
  | "casting"
  | "resolution"
  | "matchOver";

export type Player = { id: 0 | 1; name: string; hp: number };

export type GameState = {
  screen: Screen;
  round: number;
  active: 0 | 1;
  players: [Player, Player];
  spells: Spell[];
  selectedIdx: number | null;
  lastOutcome: Outcome | null;
  generating: boolean;
  winner: 0 | 1 | null;
};

export const MAX_HP = 100;
export const CAST_TIME_LIMIT_MS = 12000;
export const CAST_REPEATS = 3;
