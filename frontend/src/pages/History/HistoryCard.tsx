import type { Battle } from "../../api/battle.api";
import "./HistoryCard.css";

export interface HistoryCardProps {
  battle: Battle;
  onClick: (() => void) | undefined;
}

export function HistoryCard({ battle, onClick }: HistoryCardProps) {
  const { trainer1, trainer2, status } = battle;

  let result = "In Progress";
  if (status === "trainer1win") result = `${trainer1} won 👑`;
  if (status === "trainer2win") result = `${trainer2} won 👑`;

  return (
    <div className="historyCard" onClick={onClick}>
      <div className="hc-result">{result}</div>
      <div className="hc-row">
        <span>{trainer1}</span> <span>vs</span> <span>{trainer2}</span>
      </div>
    </div>
  );
}
