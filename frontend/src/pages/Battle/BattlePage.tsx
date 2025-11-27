import { useEffect, useState } from "react";
import type { Trainer } from "../../api/trainer.api";
import "./BattlePage.css";
import {
  getBattlesForTrainer,
  startBattle,
  type Battle,
} from "../../api/battle.api";
import { BattleCard } from "./BattleCard";
import { useAcceptBattleModal } from "./useAcceptBattleModal";

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

  // once the battle gets accepted, update the battle in the list
  const handleBattleChanged = (changedBattle: Battle) => {
    setLoadedBattles((prev) =>
      prev.map((battle) =>
        battle._id === changedBattle._id ? changedBattle : battle
      )
    );
  };

  const acceptBattleModal = useAcceptBattleModal(trainer, handleBattleChanged);

  const loadBattles = () => {
    setIsLoading(true);
    getBattlesForTrainer(trainer.username).then((battles) => {
      setLoadedBattles(battles);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    loadBattles();
  }, []);

  const onStartNewBattleClick = () => {
    setIsLoading(true);
    startBattle(trainer).then((battle) => {
      setLoadedBattles((prev) => [...prev, battle]);
      setIsLoading(false);
    });
  };

  const createBattleClickHandler = (battle: Battle) => () => {
    switch (battle.status) {
      case "new":
        // join battle
        acceptBattleModal.openModal(battle);
        break;
      case "trainer1turn":
      case "trainer2turn":
        // go to battle page
        break;
    }
  };

  return (
    <>
      <div className="battlePage">
        <div className="battleHeader">
          <button className="battleButton" onClick={onStartNewBattleClick}>
            Start New Battle
          </button>
          <button className="battleButton" onClick={loadBattles}>
            Refresh Battles
          </button>
        </div>
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
                      onClick={createBattleClickHandler(battle)}
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
                      onClick={
                        battle.status !== "new"
                          ? createBattleClickHandler(battle)
                          : undefined
                      }
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
      {acceptBattleModal.children}
    </>
  );
}
