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
  movingTeam: 1 | 2; // 1 for trainer1, 2 for trainer2
  trainer1pokemon: number; // index of pokemon in trainer1team
  trainer2pokemon: number; // index of pokemon in trainer2team
  moveUsed: Move; // move used by the active pokemon
  team1status: PokemonStatus[]; // status of all pokemon in trainer1team
  team2status: PokemonStatus[]; // status of all pokemon in trainer2team
}

export interface Battle {
  _id: string;
  status: BattleStatus;
  trainer1username: string;
  trainer1team: Pokemon[];
  trainer2username: string;
  trainer2team: Pokemon[];
  turns: BattleTurn[];
}
