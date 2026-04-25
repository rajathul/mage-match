import type { GameState, Outcome, Spell } from "./types";
import { MAX_HP } from "./types";

export function initialState(): GameState {
  return {
    screen: "title",
    round: 0,
    active: 0,
    players: [
      { id: 0, name: "Player 1", hp: MAX_HP },
      { id: 1, name: "Player 2", hp: MAX_HP },
    ],
    spells: [],
    selectedIdx: null,
    lastOutcome: null,
    generating: false,
    winner: null,
  };
}

export type Action =
  | { type: "START_MATCH" }
  | { type: "BEGIN_GENERATING" }
  | { type: "SET_SPELLS"; spells: Spell[] }
  | { type: "INTRO_DONE" }
  | { type: "SELECT_SPELL"; idx: number }
  | { type: "BEGIN_CAST" }
  | { type: "RESOLVE"; outcome: Outcome }
  | { type: "PASS_TURN" }
  | { type: "REMATCH" };

export function reduce(s: GameState, a: Action): GameState {
  switch (a.type) {
    case "START_MATCH":
      return { ...initialState(), screen: "roundIntro", round: 1, generating: true };
    case "BEGIN_GENERATING":
      return { ...s, generating: true };
    case "SET_SPELLS":
      return { ...s, spells: a.spells, generating: false };
    case "INTRO_DONE":
      return { ...s, screen: "spellSelect" };
    case "SELECT_SPELL":
      return { ...s, selectedIdx: a.idx };
    case "BEGIN_CAST":
      return { ...s, screen: "casting" };
    case "RESOLVE": {
      const players = [...s.players] as GameState["players"];
      const opponent = (1 - s.active) as 0 | 1;
      players[opponent] = {
        ...players[opponent],
        hp: Math.max(0, players[opponent].hp - a.outcome.damageDealt),
      };
      players[s.active] = {
        ...players[s.active],
        hp: Math.max(0, players[s.active].hp - a.outcome.damageToSelf),
      };
      const winner: 0 | 1 | null =
        players[0].hp <= 0 ? 1 : players[1].hp <= 0 ? 0 : null;
      return {
        ...s,
        players,
        lastOutcome: a.outcome,
        screen: winner !== null ? "matchOver" : "resolution",
        winner,
      };
    }
    case "PASS_TURN": {
      const next = (1 - s.active) as 0 | 1;
      return {
        ...s,
        active: next,
        round: s.round + 1,
        selectedIdx: null,
        spells: [],
        lastOutcome: null,
        screen: "roundIntro",
        generating: true,
      };
    }
    case "REMATCH":
      return { ...initialState(), screen: "roundIntro", round: 1, generating: true };
  }
}
