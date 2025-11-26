import type { BattleStatus } from "../../api/battle.api";
import "./BattleCard.css";

export interface BattleCardProps {
  trainer1: string;
  trainer2: string;
  status: BattleStatus;
  onClick: () => void;
}

export function BattleCard({
  trainer1,
  trainer2,
  status,
  onClick,
}: BattleCardProps) {
  return (
    <div className="battleCard" onClick={onClick}>
      <p>
        {trainer1} {status === "trainer1turn" && "←"}
      </p>
      <p>vs.</p>
      <p>
        {trainer2 || "???"} {status === "trainer2turn" && "←"}
      </p>
    </div>
  );
}
