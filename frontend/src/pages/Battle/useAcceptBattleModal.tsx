import { useState } from "react";
import { acceptBattle, type Battle } from "../../api/battle.api";
import { AcceptBattleModal } from "./AcceptBattleModal";
import type { Trainer } from "../../api/trainer.api";

export function useAcceptBattleModal(
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

  const handleAccept = () => {
    if (battle) {
      // accept battle api call
      acceptBattle(battle._id, trainer).then((updatedBattle) => {
        onAccepted(updatedBattle);
        handleClose();
      });
    }
  };

  return {
    children: (
      <AcceptBattleModal
        battle={battle!}
        visible={isVisible}
        onClose={handleClose}
        onAccept={handleAccept}
      />
    ),
    openModal,
  };
}
