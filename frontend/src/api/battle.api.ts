import type { Pokemon } from "./pokemon.api";
import type { Trainer } from "./trainer.api";

export type BattleStatus =
  | "new"
  | "trainer1turn"
  | "trainer2turn"
  | "trainer1win"
  | "trainer2win"
  | "cancelled";

export interface PokemonStatus {
  hp: number;
}

export interface BattleTurn {
  turnNumber: number;
  movingTrainer: 1 | 2; // 1 for trainer1, 2 for trainer2
  moveUsed: string | null; // move used by the active pokemon, null on first or switch out pokemon
  pokemon1: number; // index of pokemon in trainer1team
  pokemon2: number; // index of pokemon in trainer2team
  team1status: PokemonStatus[]; // status of all pokemon in trainer1team
  team2status: PokemonStatus[]; // status of all pokemon in trainer2team
}

export interface Battle {
  _id: string;
  status: BattleStatus;
  trainer1: string;
  trainer1team: Pokemon[];
  trainer2: string;
  trainer2team: Pokemon[];
  turns: BattleTurn[];
}

// For when a turn is sent from frontend to backend
// the status of the team will be calculated on the backend
// based on the moves used and other factors
// so that the frontend cannot calculate it incorrectly or cheat
export interface BattleTurnRequest {
  movingTrainer: 1 | 2; // 1 for trainer1, 2 for trainer2
  moveUsed: string | null; // move used by the active pokemon, null on first or switch out pokemon
  pokemon1: number; // index of pokemon in trainer1team
  pokemon2: number; // index of pokemon in trainer2team
}

export async function getBattlesForTrainer(username: string) {
  const res = await fetch(
    `http://localhost:3001/battles/refresh?username=${username}`
  );
  return (await res.json()) as Battle[];
}

export async function getBattleById(battleId: string) {
  const res = await fetch(`http://localhost:3001/battles/${battleId}`);
  return (await res.json()) as Battle;
}

export async function startBattle(trainer: Trainer) {
  const res = await fetch("http://localhost:3001/battles", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trainer }),
  });
  return (await res.json()) as Battle;
}

export async function acceptBattle(battleId: string, trainer: Trainer) {
  const res = await fetch(`http://localhost:3001/battles/${battleId}/accept`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ trainer }),
  });
  return (await res.json()) as Battle;
}

export async function processTurn(
  battleId: string,
  turnRequest: BattleTurnRequest
) {
  const res = await fetch(`http://localhost:3001/battles/${battleId}/turn`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(turnRequest),
  });
  return (await res.json()) as Battle;
}
