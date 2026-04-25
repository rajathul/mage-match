# Mage Arena inspired Voice Game

Hot-seat 2-player tongue-twister duel. See `../mage_arena_prd.md` for the spec.

## Run

```bash
cp .env.example .env        # then paste your API keys (both optional)
npm install
npm run dev
```

Open the URL Vite prints, click **Tap to start**, allow mic access, take turns at the laptop.

## How it plays

Each round, each player sees three AI-generated tongue-twister spells (Easy / Medium / Hard). Pick one, hit **Cast**, speak the spell within 8 seconds. Whisper transcribes your voice; the transcript is scored against the spell name with a 60/40 mix of Levenshtein string similarity and Double-Metaphone phonetic similarity.

- **>= threshold (75–85%)** → perfect cast, full damage to opponent
- **40% – threshold** → partial hit, damage scales with accuracy
- **< 40%** → roll against the spell's backfire chance; either fizzles or hits the caster

Both players start at 100 HP. First to 0 loses.

## Env vars (both optional)

- `VITE_ANTHROPIC_API_KEY` — used to generate fresh spells each round via Claude. Falls back to a hardcoded pool if missing.
- `VITE_OPENAI_API_KEY` — used for Whisper transcription. Without it, every cast registers as silence (mostly fizzles).

Keys are read by the browser directly (Vite env). Fine for a hackathon laptop demo. **Do not deploy with keys exposed.**

## Stack

- Vite + React 19 + TypeScript
- Tailwind v4 (via `@tailwindcss/vite`)
- `MediaRecorder` for mic capture, browser `SpeechSynthesis` for TTS
- `@anthropic-ai/sdk` for spell generation, OpenAI Whisper via `fetch`
- `fastest-levenshtein` + `double-metaphone` for scoring
- `framer-motion` for screen transitions and HP-bar animation

## File map

```
src/
  App.tsx                  top-level state machine, screen router
  main.tsx                 entry
  index.css                Tailwind theme + base
  game/
    types.ts               Spell / Outcome / GameState / actions
    state.ts               reducer, initialState
    spells.ts              hardcoded fallback spell pool
    scoring.ts             normalize + Levenshtein + Metaphone scoring
  api/
    spellGen.ts            Claude call → 3 spells, with fallback
    transcribe.ts          Whisper call
  audio/
    recorder.ts            MediaRecorder wrapper (start/stop → Blob)
    tts.ts                 SpeechSynthesis wrapper (speak / sequence)
  components/
    HpBar.tsx              animated HP bar
    SpellCard.tsx          one card per tier
    Timer.tsx              circular countdown ring
  screens/
    TitleScreen.tsx
    RoundIntroScreen.tsx   announces round + reads spell names aloud
    SpellSelectScreen.tsx  pick a spell, hit Cast
    CastingScreen.tsx      mic + timer + Whisper + scoring
    ResolutionScreen.tsx   shows transcript, score, damage
    MatchOverScreen.tsx    winner + rematch
```

## Calibration

The thresholds in `src/game/spells.ts` (and the per-tier defaults in `src/api/spellGen.ts`) are starting estimates. Plan an hour before the demo where multiple people speak each tier and you tweak thresholds so that "good faith attempt" reliably scores in the perfect band and "obvious flub" reliably falls below 40%.
