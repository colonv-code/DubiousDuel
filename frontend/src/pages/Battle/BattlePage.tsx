import type { Trainer } from "../../api/trainer.api";

export interface BattlePageProps {
  trainer: Trainer | null;
  setTrainer: (trainer: Trainer) => void;
}

export function BattlePage({}: BattlePageProps) {
  return (
    <div>
      <p>Battle Page Here!</p>
    </div>
  );
}
