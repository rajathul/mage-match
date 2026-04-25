import type { Spell, Tier } from "./types";

const EASY: Omit<Spell, "tier">[] = [
  { name: "Slippery Shelf Shift", phonetic: "SLIP-er-ee SHELF SHIFT", damage: 20, backfireChance: 0, threshold: 85, flavor: "A glassy nudge of force." },
  { name: "Flick Frock Flicker", phonetic: "FLIK FROK FLIK-er", damage: 18, backfireChance: 0, threshold: 85, flavor: "Tiny embers dance once." },
  { name: "Brisk Brick Bracket", phonetic: "BRISK BRIK BRAK-et", damage: 22, backfireChance: 5, threshold: 85, flavor: "A wall of sudden stone." },
  { name: "Plump Plum Plume", phonetic: "PLUMP PLUM PLOOM", damage: 19, backfireChance: 0, threshold: 85, flavor: "Sweet vapor coils outward." },
  { name: "Tiny Tin Twin", phonetic: "TY-nee TIN TWIN", damage: 17, backfireChance: 0, threshold: 85, flavor: "Two echoes, one whisper." },
];

const MEDIUM: Omit<Spell, "tier">[] = [
  { name: "Crisp Crisscross Crackle", phonetic: "KRISP KRIS-kraws KRAK-ul", damage: 45, backfireChance: 20, threshold: 80, flavor: "Lattices of static lightning." },
  { name: "Frosted Thrush Throat", phonetic: "FROS-ted THRUSH THROHT", damage: 42, backfireChance: 22, threshold: 80, flavor: "An icy birdcall of force." },
  { name: "Quick Quill Quibble", phonetic: "KWIK KWIL KWIB-ul", damage: 40, backfireChance: 18, threshold: 80, flavor: "Words sharpened to barbs." },
  { name: "Plucky Pluto's Plumber", phonetic: "PLUK-ee PLOO-toez PLUM-er", damage: 47, backfireChance: 25, threshold: 80, flavor: "A leak in the cosmic pipe." },
  { name: "Shrewd Shrub's Shrapnel", phonetic: "SHROOD SHRUBZ SHRAP-nul", damage: 48, backfireChance: 25, threshold: 80, flavor: "Hedgerows hurl their thorns." },
];

const HARD: Omit<Spell, "tier">[] = [
  { name: "Sixth Sheep's Sheath Shriek", phonetic: "SIKSTH SHEEPS SHEETH SHREEK", damage: 80, backfireChance: 50, threshold: 75, flavor: "A scream from beneath the wool." },
  { name: "Three Thrashed Thrushes Thrum", phonetic: "THREE THRASHT THRUSH-iz THRUM", damage: 78, backfireChance: 50, threshold: 75, flavor: "A drumbeat of fragile wings." },
  { name: "Rural Brewery's Wristwatch", phonetic: "ROOR-ul BROO-er-eez RIST-wach", damage: 82, backfireChance: 55, threshold: 75, flavor: "Time itself ferments." },
  { name: "Sixth Sick Sheikh's Sixth Sheep", phonetic: "SIKSTH SIK SHAYKS SIKSTH SHEEP", damage: 85, backfireChance: 60, threshold: 72, flavor: "A flock of hexed dreams." },
  { name: "Strict Strangler's Strudel", phonetic: "STRIKT STRANG-glerz STROO-dul", damage: 80, backfireChance: 50, threshold: 75, flavor: "Pastry knotted with malice." },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function fallbackSpells(): Spell[] {
  const tag = (s: Omit<Spell, "tier">, tier: Tier): Spell => ({ ...s, tier });
  return [tag(pick(EASY), "easy"), tag(pick(MEDIUM), "medium"), tag(pick(HARD), "hard")];
}
