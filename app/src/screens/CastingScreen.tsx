import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { Spell } from "../game/types";
import { CAST_TIME_LIMIT_MS } from "../game/types";
import { Timer } from "../components/Timer";
import { startRecorder, type RecorderHandle } from "../audio/recorder";
import { transcribe } from "../api/transcribe";
import { resolveCast } from "../game/scoring";
import type { Outcome } from "../game/types";

type Phase = "starting" | "recording" | "processing" | "error";

export function CastingScreen({
  spell,
  caster,
  onResolved,
}: {
  spell: Spell;
  caster: 0 | 1;
  onResolved: (outcome: Outcome) => void;
}) {
  const [phase, setPhase] = useState<Phase>("starting");
  const [error, setError] = useState<string | null>(null);
  const [remaining, setRemaining] = useState(CAST_TIME_LIMIT_MS);
  const recRef = useRef<RecorderHandle | null>(null);
  const tickRef = useRef<number | null>(null);
  const settled = useRef(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const handle = await startRecorder();
        if (cancelled) {
          handle.cancel();
          return;
        }
        recRef.current = handle;
        setPhase("recording");
        const start = performance.now();
        tickRef.current = window.setInterval(() => {
          const left = CAST_TIME_LIMIT_MS - (performance.now() - start);
          if (left <= 0) {
            setRemaining(0);
            void finish();
          } else {
            setRemaining(left);
          }
        }, 50);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Could not access microphone");
        setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
      if (tickRef.current) window.clearInterval(tickRef.current);
      recRef.current?.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function finish() {
    if (settled.current) return;
    settled.current = true;
    if (tickRef.current) window.clearInterval(tickRef.current);
    setPhase("processing");
    try {
      const blob = await recRef.current!.stop();
      const transcript = await transcribe(blob);
      const outcome = resolveCast(spell, transcript, caster);
      onResolved(outcome);
    } catch (e) {
      console.error(e);
      const outcome = resolveCast(spell, "", caster);
      onResolved(outcome);
    }
  }

  if (phase === "error") {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-6">
        <h2 className="font-display text-3xl text-tier-hard">Microphone unavailable</h2>
        <p className="text-arcane-muted text-center max-w-md">{error}</p>
        <button
          className="px-6 py-3 rounded-full bg-arcane-panel border border-arcane-border"
          onClick={() => {
            settled.current = true;
            onResolved(resolveCast(spell, "", caster));
          }}
        >
          Skip turn (fizzle)
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-6">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
        <p className="font-mono text-xs tracking-[0.4em] text-arcane-muted mb-2">SPEAK THE SPELL</p>
        <h2 className="font-display text-4xl text-balance">{spell.name}</h2>
        <code className="font-mono text-lg text-arcane-muted block mt-3">{spell.phonetic}</code>
      </motion.div>

      <Timer remainingMs={remaining} totalMs={CAST_TIME_LIMIT_MS} />

      <div className="flex flex-col items-center gap-4">
        {phase === "recording" && (
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 1.2, repeat: Infinity }}
            className="text-5xl"
          >
            🎙️
          </motion.div>
        )}
        {phase === "processing" && (
          <p className="font-mono text-sm text-arcane-muted">transcribing your incantation...</p>
        )}
        {phase === "recording" && (
          <button
            onClick={() => void finish()}
            className="px-8 py-3 rounded-full bg-arcane-panel border border-arcane-border hover:border-amber-300 transition"
          >
            Done speaking
          </button>
        )}
      </div>
    </div>
  );
}
