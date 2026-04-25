import Anthropic from "@anthropic-ai/sdk";
import type { Spell, Tier } from "../game/types";
import { fallbackSpells } from "../game/spells";

const ANTHROPIC_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined;

const SYSTEM_PROMPT = `You are the spellsmith for a game called Tongue-Twister Mage Arena.
Each round you produce exactly THREE English tongue-twister spells, one per difficulty tier: easy, medium, hard.

Constraints:
- Each spell name is 2-5 words. No proper nouns. No rare or archaic words. No profanity.
- Favor plosives (p, b, t, d, k, g) and sibilants (s, sh, th, ch). Repetition of consonant clusters is good.
- The phonetic guide breaks the name into capitalized syllables joined by hyphens within a word and spaces between words. Example: "KRISP KRIS-kraws KRAK-ul".
- Flavor text is one short evocative sentence (max 12 words).

Difficulty calibration:
- easy: short and trippy but achievable on the first try.
- medium: longer with consonant cluster repetition; demands articulation.
- hard: classic stumblers with sibilant or plosive overload.

Return ONLY a single JSON object, no prose, no markdown fencing, of this exact shape:
{
  "easy":   { "name": "...", "phonetic": "...", "flavor": "..." },
  "medium": { "name": "...", "phonetic": "...", "flavor": "..." },
  "hard":   { "name": "...", "phonetic": "...", "flavor": "..." }
}`;

const TIER_DEFAULTS: Record<Tier, { damage: number; backfireChance: number; threshold: number }> = {
  easy: { damage: 20, backfireChance: 0, threshold: 85 },
  medium: { damage: 45, backfireChance: 20, threshold: 80 },
  hard: { damage: 80, backfireChance: 50, threshold: 75 },
};

type RawTier = { name: string; phonetic: string; flavor: string };
type RawResponse = Record<Tier, RawTier>;

export async function generateSpells(): Promise<Spell[]> {
  if (!ANTHROPIC_KEY) {
    console.warn("[spellGen] VITE_ANTHROPIC_API_KEY not set — using hardcoded spell pool");
    return fallbackSpells();
  }

  try {
    const client = new Anthropic({ apiKey: ANTHROPIC_KEY, dangerouslyAllowBrowser: true });
    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 600,
      system: SYSTEM_PROMPT,
      messages: [
        { role: "user", content: "Generate the three spells for this round. Return only the JSON object." },
      ],
    });

    const text = msg.content
      .map((b) => (b.type === "text" ? b.text : ""))
      .join("")
      .trim();

    const json = extractJson(text);
    const parsed = JSON.parse(json) as RawResponse;

    const spells: Spell[] = (["easy", "medium", "hard"] as Tier[]).map((tier) => {
      const r = parsed[tier];
      if (!r?.name || !r.phonetic) throw new Error(`missing tier ${tier}`);
      const d = TIER_DEFAULTS[tier];
      return {
        name: cleanName(r.name),
        phonetic: r.phonetic.trim(),
        flavor: (r.flavor || "").trim(),
        damage: d.damage,
        backfireChance: d.backfireChance,
        threshold: d.threshold,
        tier,
      };
    });

    return spells;
  } catch (err) {
    console.error("[spellGen] failed, falling back:", err);
    return fallbackSpells();
  }
}

function extractJson(text: string): string {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fenced) return fenced[1].trim();
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start !== -1 && end !== -1) return text.slice(start, end + 1);
  return text;
}

function cleanName(name: string): string {
  return name.replace(/[^\w\s'-]/g, "").trim();
}
