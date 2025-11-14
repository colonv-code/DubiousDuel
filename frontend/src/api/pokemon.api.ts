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

export async function getPokemon() {
  const res = await fetch("http://localhost:3001/pokemon");
  return res.json();
}
