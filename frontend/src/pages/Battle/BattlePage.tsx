import { useEffect, useState } from "react";
import type { Trainer } from "../../api/trainer.api";
import "./BattlePage.css";
import {
  getBattlesForTrainer,
  startBattle,
  type Battle,
} from "../../api/battle.api";

export interface BattlePageProps {
  trainer: Trainer | null;
  setTrainer: (trainer: Trainer) => void;
}

export function BattlePage({ trainer }: BattlePageProps) {
  if (!trainer) return;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadedBattles, setLoadedBattles] = useState<Battle[]>([]);

  // load initial data
  useEffect(() => {
    setIsLoading(true);
    getBattlesForTrainer(trainer.username).then((battles) => {
      setLoadedBattles(battles);
      setIsLoading(false);
    });
  }, []);

  const onStartBattle = () => {
    setIsLoading(true);
    startBattle(trainer).then((battle) => {
      setLoadedBattles((prev) => [...prev, battle]);
      setIsLoading(false);
    });
  };

  return (
    <div className="battlePage">
      <button onClick={onStartBattle}>Start New Battle</button>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {loadedBattles.map((battle) => (
            <li key={battle._id}>
              Battle ID: {battle._id}, Status: {battle.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
