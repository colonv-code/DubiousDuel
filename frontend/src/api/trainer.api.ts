import type { Pokemon } from "./pokemon.api";

export interface Trainer {
  username: string;
  team: Pokemon[];
}

export async function getTrainerByName(username: String) {
  const res = await fetch(`http://localhost:3001/trainer?username=${username}`);
  return (await res.json()) as Trainer;
}

export async function upsertTrainer(trainer: Trainer) {
  const res = await fetch("http://localhost:3001/trainer", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(trainer),
  });

  if (!res.ok) {
    throw new Error("Failed to upsert trainer");
  }

  return (await res.json()) as Trainer;
}
