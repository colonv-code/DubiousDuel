import type { Trainer } from "../../api/trainer.api";

export interface HistoryPageProps {
  trainer: Trainer;
  setTrainer: (trainer: Trainer) => void;
}

export function HistoryPage({}: HistoryPageProps) {
  return (
    <div>
      <p>History Page Here!</p>
    </div>
  );
}
