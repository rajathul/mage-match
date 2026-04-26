import type { Spell, Tier } from "./types";

const EASY: Omit<Spell, "tier">[] = [
  { name: "Silly seals sell fresh fish", phonetic: "SIL-ee SEELZ SEL FRESH FISH", damage: 20, backfireChance: 0, threshold: 85, flavor: "The fishmonger smells suspicious." },
  { name: "Fluffy bunnies flip big flapjacks", phonetic: "FLUF-ee BUN-eez FLIP BIG FLAP-jaks", damage: 20, backfireChance: 0, threshold: 85, flavor: "Breakfast served with a thud." },
  { name: "Brisk black bugs bite back", phonetic: "BRISK BLAK BUGZ BYT BAK", damage: 20, backfireChance: 0, threshold: 85, flavor: "Never swat what bites first." },
  { name: "Plump pink pigs pick peppers", phonetic: "PLUMP PINK PIGZ PIK PEP-erz", damage: 20, backfireChance: 0, threshold: 85, flavor: "The garden reeks of bacon." },
  { name: "Crispy crabs crack crusty crackers", phonetic: "KRIS-pee KRABZ KRAK KRUS-tee KRAK-erz", damage: 20, backfireChance: 0, threshold: 85, flavor: "A beach snack gone wrong." },
];

const MEDIUM: Omit<Spell, "tier">[] = [
  { name: "She sells seashells by the seashore", phonetic: "SHEE SELZ SEE-shelz BY thuh SEE-shor", damage: 45, backfireChance: 20, threshold: 80, flavor: "The ocean owes her money." },
  { name: "Thick thistle sticks stick thickly", phonetic: "THIK THIS-ul STIKS STIK THIK-lee", damage: 45, backfireChance: 20, threshold: 80, flavor: "The hedge hates you personally." },
  { name: "Six slippery snails slid slowly seaward", phonetic: "SIKS SLIP-er-ee SNAYLZ SLID SLOH-lee SEE-werd", damage: 45, backfireChance: 20, threshold: 80, flavor: "A sluggish oceanic commute." },
  { name: "Freshly fried flying fish flesh", phonetic: "FRESH-lee FRYD FLY-ing FISH FLESH", damage: 45, backfireChance: 20, threshold: 80, flavor: "The chef regrets everything." },
  { name: "Which witch switched the witch's britches", phonetic: "WICH WICH SWICHT thuh WICHIZ BRICH-iz", damage: 47, backfireChance: 25, threshold: 80, flavor: "A laundry dispute of dark power." },
];

const HARD: Omit<Spell, "tier">[] = [
  { name: "The sixth sick sheikh's sixth sheep is sick", phonetic: "thuh SIKSTH SIK SHAYKS SIKSTH SHEEP IZ SIK", damage: 80, backfireChance: 50, threshold: 75, flavor: "A veterinary nightmare of legendary scope." },
  { name: "Truly rural lurkers rarely lure rural lurkers", phonetic: "TROO-lee ROOR-ul LER-kerz RAIR-lee LYOOR ROOR-ul LER-kerz", damage: 82, backfireChance: 55, threshold: 75, flavor: "Country paranoia at its finest." },
  { name: "Three free throws threw throngs through", phonetic: "THREE FREE THROHZ THREW THRONGZ THROO", damage: 80, backfireChance: 50, threshold: 75, flavor: "Basketball magic gone catastrophically wrong." },
  { name: "Specific pacific traffic statistics perplex", phonetic: "speh-SIF-ik peh-SIF-ik TRAF-ik steh-TIS-tiks per-PLEKS", damage: 85, backfireChance: 60, threshold: 72, flavor: "The data refuses to cooperate." },
  { name: "Shrewd shrewd shrews shred fresh shredded cheese", phonetic: "SHROOD SHROOD SHROOZ SHRED FRESH SHRED-id CHEEZ", damage: 80, backfireChance: 50, threshold: 75, flavor: "A suspicious amount of dairy damage." },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function fallbackSpells(): Spell[] {
  const tag = (s: Omit<Spell, "tier">, tier: Tier): Spell => ({ ...s, tier });
  return [tag(pick(EASY), "easy"), tag(pick(MEDIUM), "medium"), tag(pick(HARD), "hard")];
}
