import { useState } from "react";
import type { Battle } from "../../api/battle.api";
import type { Trainer } from "../../api/trainer.api";
import { BattleModal } from "./BattleModal";

export function useBattleModal(
  trainer: Trainer,
  onAccepted: (battle: Battle) => void
) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [battle, setBattle] = useState<Battle | null>(null);

  const openModal = (battleToAccept: Battle) => {
    setBattle(battleToAccept);
    setIsVisible(true);
  };

  const handleClose = () => {
    setBattle(null);
    setIsVisible(false);
  };

  const handleTurnComplete = () => {
    if (battle) {
      // todo: complete turn api call
      onAccepted(battle);
    }
  };

  return {
    children: (
      <BattleModal
        battle={battle!}
        trainer={trainer}
        visible={isVisible}
        onClose={handleClose}
        onTurnComplete={handleTurnComplete}
      />
    ),
    openModal,
  };
}
