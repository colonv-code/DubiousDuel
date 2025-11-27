import type { Battle } from "../../api/battle.api";
import type { Trainer } from "../../api/trainer.api";
import { Modal } from "../../components/Modal";
import { nameToImageUri } from "../../helpers/nameToImageUri";
import "./BattleModal.css";

export interface BattleModalProps {
  visible: boolean;
  battle: Battle;
  trainer: Trainer;
  onClose: () => void;
  onTurnComplete: () => void;
}

export function BattleModal({
  visible,
  battle,
  trainer,
  onClose,
  onTurnComplete,
}: BattleModalProps) {
  if (!visible) return null;

  const latestTurn = battle.turns[battle.turns.length - 1];

  const pokemon1 = battle.trainer1team[latestTurn.pokemon1];
  const pokemon2 = battle.trainer2team[latestTurn.pokemon2];

  const isYourTurn =
    (battle.status === "trainer1turn" &&
      battle.trainer1 === trainer.username) ||
    (battle.status === "trainer2turn" && battle.trainer2 === trainer.username);

  return (
    <Modal visible={visible} onClose={onClose}>
      <div className="battleModalContainer">
        <p>
          {battle.trainer1} vs. {battle.trainer2}
        </p>
        {isYourTurn && <p>Your turn! Choose a move or switch your pokemon.</p>}
        <div className="battlePokemonContainer">
          <div style={{ flexDirection: "column" }}>
            <img
              src={nameToImageUri(pokemon1.Name)}
              alt={pokemon1 ? pokemon1.Name : "No Pokemon"}
            />
            <p>HP: {latestTurn.team1status[latestTurn.pokemon1].hp}</p>
          </div>
          <div style={{ flexDirection: "column" }}>
            <img
              src={nameToImageUri(pokemon2.Name)}
              alt={pokemon2 ? pokemon2.Name : "No Pokemon"}
            />
            <p>HP: {latestTurn.team2status[latestTurn.pokemon2].hp}</p>
          </div>
        </div>
      </div>
    </Modal>
  );
}
