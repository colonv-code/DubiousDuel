import type { Battle } from "../../api/battle.api";
import { nameToImageUri } from "../../helpers/nameToImageUri";
import pokeball from "../../assets/pokeball.png";
import { Modal } from "../../components/Modal";

export interface AcceptBattleModalProps {
  visible: boolean;
  battle: Battle;
  onClose: () => void;
  onAccept: () => void;
}

export function AcceptBattleModal({
  visible,
  battle,
  onClose,
  onAccept,
}: AcceptBattleModalProps) {
  if (!visible) return null;

  // display the team1pokemon
  return (
    <Modal visible={visible} onClose={onClose}>
      <p>
        Trainer <b>{battle.trainer1}</b> wants to battle!
      </p>
      {Array.from({ length: 6 }).map((_, i) => (
        <img
          key={i}
          className="teamPokemonImage"
          src={
            battle.trainer1team[i]
              ? nameToImageUri(battle.trainer1team[i].Name)
              : pokeball
          }
        />
      ))}
      <button onClick={onAccept}>Accept Battle</button>
      <button onClick={onClose}>Decline</button>
    </Modal>
  );
}
