import { useEffect, useReducer } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { initialState, reduce } from "./game/state";
import { generateSpells } from "./api/spellGen";
import { TitleScreen } from "./screens/TitleScreen";
import { RoundIntroScreen } from "./screens/RoundIntroScreen";
import { SpellSelectScreen } from "./screens/SpellSelectScreen";
import { CastingScreen } from "./screens/CastingScreen";
import { ResolutionScreen } from "./screens/ResolutionScreen";
import { MatchOverScreen } from "./screens/MatchOverScreen";
import { cancelSpeech } from "./audio/tts";

export default function App() {
  const [state, dispatch] = useReducer(reduce, undefined, initialState);

  useEffect(() => {
    if (!state.generating) return;
    let cancelled = false;
    (async () => {
      const spells = await generateSpells();
      if (!cancelled) dispatch({ type: "SET_SPELLS", spells });
    })();
    return () => {
      cancelled = true;
    };
  }, [state.generating, state.round]);

  useEffect(() => () => cancelSpeech(), []);

  return (
    <main className="flex-1 flex flex-col">
      <AnimatePresence mode="wait">
        <motion.div
          key={state.screen + ":" + state.round + ":" + state.active}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="flex-1 flex flex-col"
        >
          {state.screen === "title" && (
            <TitleScreen onStart={() => dispatch({ type: "START_MATCH" })} />
          )}

          {state.screen === "roundIntro" && (
            <RoundIntroScreen
              round={state.round}
              active={state.players[state.active]}
              spells={state.spells}
              generating={state.generating}
              onDone={() => dispatch({ type: "INTRO_DONE" })}
            />
          )}

          {state.screen === "spellSelect" && (
            <SpellSelectScreen
              state={state}
              onSelect={(idx) => dispatch({ type: "SELECT_SPELL", idx })}
              onCast={() => dispatch({ type: "BEGIN_CAST" })}
            />
          )}

          {state.screen === "casting" && state.selectedIdx !== null && (
            <CastingScreen
              spell={state.spells[state.selectedIdx]}
              caster={state.active}
              onResolved={(outcome) => dispatch({ type: "RESOLVE", outcome })}
            />
          )}

          {state.screen === "resolution" && state.lastOutcome && (
            <ResolutionScreen
              outcome={state.lastOutcome}
              players={state.players}
              active={state.active}
              onPass={() => dispatch({ type: "PASS_TURN" })}
            />
          )}

          {state.screen === "matchOver" && state.winner !== null && (
            <MatchOverScreen
              winner={state.players[state.winner]}
              loser={state.players[1 - state.winner]}
              onRematch={() => dispatch({ type: "REMATCH" })}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
}
