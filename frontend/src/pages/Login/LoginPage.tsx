import type { Trainer } from "../../api/trainer.api";

export interface LoginPageProps {
  trainer: Trainer;
  setTrainer: (trainer: Trainer) => void;
}

export function LoginPage({}: LoginPageProps) {
  return (
    <div>
      <p>Login Page Here!</p>
    </div>
  );
}
