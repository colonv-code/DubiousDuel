import type { Trainer } from "../../api/trainer.api";

export interface PokedexPageProps {
  trainer: Trainer | null;
  setTrainer: (trainer: Trainer) => void;
}

export function PokedexPage({}: PokedexPageProps) {
  return (
    <div>
      <p>Pokedex Page Here!</p>
    </div>
  );
}
