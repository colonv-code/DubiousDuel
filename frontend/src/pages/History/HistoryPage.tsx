import { useEffect, useState } from "react";
import type { Trainer } from "../../api/trainer.api";
import { getBattlesForTrainer, type Battle } from "../../api/battle.api";
import { HistoryCard } from "./HistoryCard";
import "./HistoryPage.css";
import { HistoryModal } from "./HistoryModal";

export interface HistoryPageProps {
  trainer: Trainer | null;
}

export function HistoryPage({ trainer }: HistoryPageProps) {
  if (!trainer) return;

  const [battles, setBattles] = useState<Battle[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBattle, setSelectedBattle] = useState<Battle | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getBattlesForTrainer(trainer.username).then((res) => {
      setBattles(res);
      setIsLoading(false);
    });
  }, [trainer]);
  //only show finished battles
  const finishedBattles = battles.filter(
    (b) => b.status === "trainer1win" || b.status === "trainer2win"
  );

  return (
    <div className="historyPage">
      <h1>Battle History</h1>

      {isLoading && <p>Loading...</p>}

      {!isLoading && battles.length === 0 && <p>No battles played yet.</p>}

      <div className="historyList">
        {finishedBattles.map((battle) => (
          <HistoryCard
            key={battle._id}
            battle={battle}
            onClick={() => setSelectedBattle(battle)}
          />
        ))}
      </div>
      {selectedBattle && (
        <HistoryModal
          visible={true}
          battle={selectedBattle}
          onClose={() => setSelectedBattle(null)}
        />
      )}
    </div>
  );
}
