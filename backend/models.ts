export interface Pokemon {
  _id: string;
  Id: string;
  Name: string;
  Type1: string;
  Type2: string | null;
  Abilities: string[];
  Category: string;
  HeightFt: string;
  HeightM: string;
  WeightLbs: string;
  WeightKg: string;
  CaptureRate: string;
  EggSteps: string;
  ExpGroup: string;
  Total: string;
  HP: string;
  Attack: string;
  Defense: string;
  SpAttack: string;
  SpDefense: string;
  Speed: string;
  Moves: Record<string, Move>;
}

export interface Move {
  Type: string;
  Level: string;
  Power: string;
  Accuracy: string;
  PP: string;
  EffectPercent: string;
  Description: string;
}

export interface Trainer {
  username: string;
  team: Pokemon[];
}

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
