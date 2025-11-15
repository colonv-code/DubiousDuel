import { useState } from "react";
import {
  getTrainerByName,
  upsertTrainer,
  type Trainer,
} from "../../api/trainer.api";
import "./LoginPage.css";

export interface LoginPageProps {
  setTrainer: (trainer: Trainer) => void;
}

export function LoginPage({ setTrainer }: LoginPageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [usernameInput, setUsernameInput] = useState<string>("");

  const onPlayClick = async () => {
    setIsLoading(true);
    // get trainer
    const existingTrainer = await getTrainerByName(usernameInput);
    // if null, insert new trainer
    setTrainer(
      existingTrainer ??
        (await upsertTrainer({
          username: usernameInput,
          team: [],
        }))
    );
    setIsLoading(false);
  };

  return (
    <div className="loginPage">
      <h1>Dubious Duel</h1>
      <input
        type="text"
        placeholder="username"
        disabled={isLoading}
        onChange={(e) => setUsernameInput(e.target.value)}
      />

      <button className="playButton" disabled={isLoading} onClick={onPlayClick}>
        Play
      </button>
    </div>
  );
}
