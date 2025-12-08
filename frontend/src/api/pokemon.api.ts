export type PokemonType =
  | "Normal"
  | "Fire"
  | "Water"
  | "Electric"
  | "Grass"
  | "Ice"
  | "Fighting"
  | "Poison"
  | "Ground"
  | "Flying"
  | "Psychic"
  | "Bug"
  | "Rock"
  | "Ghost"
  | "Dragon"
  | "Dark"
  | "Steel"
  | "Fairy";

export interface Pokemon {
  _id: string;
  Id: string;
  Name: string;
  Type1: PokemonType;
  Type2: PokemonType | "None";
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
  const json = await res.json();
  const formattedData: Pokemon[] = json.map((pokeData: any) => ({
    ...pokeData,
    SpAttack: pokeData["Sp. Attack"],
    SpDefense: pokeData["Sp. Defense"],
    Type1: pokeData["Type 1"],
    Type2: pokeData["Type 2"],
    HeightFt: pokeData["Height (ft)"],
    HeightM: pokeData["Height (m)"],
    WeightLbs: pokeData["Weight (lbs)"],
    WeightKg: pokeData["Weight (kg)"],
    EggSteps: pokeData["Egg Steps"],
    ExpGroup: pokeData["Exp Group"],
    CaptureRate: pokeData["Capture Rate"],
  }));
  return formattedData;
}
