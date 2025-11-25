import type { Move, Pokemon } from "./pokemon.api";

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
  moveUsed: Move; // move used by the active pokemon
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
