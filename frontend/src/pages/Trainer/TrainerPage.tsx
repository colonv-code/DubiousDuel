import type { Trainer } from "../../api/trainer.api";

export interface TrainerPageProps {
  trainer: Trainer;
  setTrainer: (trainer: Trainer) => void;
}

export function TrainerPage({}: TrainerPageProps) {
  return (
    <div>
      <p>Trainer Page Here!</p>
    </div>
  );
}
