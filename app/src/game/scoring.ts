import { distance } from "fastest-levenshtein";
import { doubleMetaphone } from "double-metaphone";
import type { Outcome, Spell } from "./types";

const CONTRACTIONS: [RegExp, string][] = [
  [/n['']t\b/g, "nt"],
  [/['']s\b/g, "s"],
  [/['']re\b/g, "re"],
  [/['']ve\b/g, "ve"],
  [/['']ll\b/g, "ll"],
  [/['']d\b/g, "d"],
  [/['']m\b/g, "m"],
];

export function normalize(input: string): string {
  let s = input.toLowerCase().trim();
  for (const [re, repl] of CONTRACTIONS) s = s.replace(re, repl);
  s = s.replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
  return s;
}

function ratio(a: string, b: string): number {
  if (!a && !b) return 1;
  const max = Math.max(a.length, b.length);
  if (max === 0) return 1;
  return 1 - distance(a, b) / max;
}

function phoneticKey(s: string): string {
  return s
    .split(" ")
    .filter(Boolean)
    .map((w) => doubleMetaphone(w)[0])
    .join(" ");
}

export type Score = {
  total: number;
  textPct: number;
  phoneticPct: number;
};

export function scoreUtterance(target: string, transcript: string): Score {
  const t = normalize(target);
  const u = normalize(transcript);
  const textPct = ratio(t, u) * 100;
  const phoneticPct = ratio(phoneticKey(t), phoneticKey(u)) * 100;
  const total = 0.6 * textPct + 0.4 * phoneticPct;
  return { total, textPct, phoneticPct };
}

export function resolveCast(
  spell: Spell,
  transcript: string,
  caster: 0 | 1,
): Outcome {
  const { total } = scoreUtterance(spell.name, transcript);
  const score = Math.round(total);

  if (score >= spell.threshold) {
    return {
      kind: "perfect",
      score,
      damageDealt: spell.damage,
      damageToSelf: 0,
      transcript,
      spell,
      caster,
    };
  }
  if (score >= 40) {
    const ratio = (score - 40) / (spell.threshold - 40);
    const damage = Math.round(spell.damage * ratio);
    return {
      kind: "partial",
      score,
      damageDealt: damage,
      damageToSelf: 0,
      transcript,
      spell,
      caster,
    };
  }
  const roll = Math.random() * 100;
  if (roll < spell.backfireChance) {
    return {
      kind: "backfired",
      score,
      damageDealt: 0,
      damageToSelf: spell.damage,
      transcript,
      spell,
      caster,
    };
  }
  return {
    kind: "fizzled",
    score,
    damageDealt: 0,
    damageToSelf: 0,
    transcript,
    spell,
    caster,
  };
}
