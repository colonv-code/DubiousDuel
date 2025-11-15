import type { Trainer } from "../../api/trainer.api";

export interface TrainerPageProps {
  trainer: Trainer | null;
  setTrainer: (trainer: Trainer) => void;
}

export function TrainerPage({ trainer }: TrainerPageProps) {
  return (
    <div>
      <p>Hello, {trainer?.username}!</p>
    </div>
  );
}
