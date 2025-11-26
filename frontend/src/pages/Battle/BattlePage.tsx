import { useEffect, useState } from "react";
import type { Trainer } from "../../api/trainer.api";
import "./BattlePage.css";
import {
  getBattlesForTrainer,
  startBattle,
  type Battle,
} from "../../api/battle.api";
import { BattleCard } from "./BattleCard";

export interface BattlePageProps {
  trainer: Trainer | null;
  setTrainer: (trainer: Trainer) => void;
}

export function BattlePage({ trainer }: BattlePageProps) {
  if (!trainer) return;

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadedBattles, setLoadedBattles] = useState<Battle[]>([]);

  const newBattles = loadedBattles.filter(
    (battle) =>
      battle.status === "new" &&
      battle.trainer1 != trainer.username &&
      battle.trainer2 != trainer.username
  );
  const yourBattles = loadedBattles.filter(
    (battle) =>
      battle.trainer1 == trainer.username || battle.trainer2 == trainer.username
  );

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
      <button className="newBattleButton" onClick={onStartBattle}>
        Start New Battle
      </button>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          {newBattles.length > 0 && (
            <>
              <p>Open Battles</p>
              <div className="battleList">
                {newBattles.map((battle) => (
                  <BattleCard
                    key={battle._id}
                    trainer1={battle.trainer1}
                    trainer2={battle.trainer2}
                    status={battle.status}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </>
          )}
          {yourBattles.length > 0 && (
            <>
              <p>Your Battles</p>
              <div className="battleList">
                {yourBattles.map((battle) => (
                  <BattleCard
                    key={battle._id}
                    trainer1={battle.trainer1}
                    trainer2={battle.trainer2}
                    status={battle.status}
                    onClick={() => {}}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
