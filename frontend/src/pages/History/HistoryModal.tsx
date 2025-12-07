import { Modal } from "../../components/Modal";
import type { Battle, BattleTurn } from "../../api/battle.api";
import { nameToImageUri } from "../../helpers/nameToImageUri";
import { useState } from "react";
import "./HistoryModal.css";
export interface HistoryModalProps {
  visible: boolean;
  battle: Battle;
  onClose: () => void;
}
export function HistoryModal({ visible, battle, onClose }: HistoryModalProps) {
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);

  //if not visible or no battle, return null
  if (!visible || !battle) return null;

  //gets the current turn if current turn is 0 then prevTurn is null
  const currentTurn: BattleTurn = battle.turns[currentTurnIndex];
  const prevTurn: BattleTurn | null =
    currentTurnIndex > 0 ? battle.turns[currentTurnIndex - 1] : null;

  //getting active pokemone to make it easier to display images and hp
  const activePokemon1 = battle.trainer1team[currentTurn.pokemon1];
  const activePokemon2 = battle.trainer2team[currentTurn.pokemon2];

  //gets hp from status if not first turn else just display starting hp
  const displayHP1 = Number(
    currentTurnIndex === 0
      ? activePokemon1.HP
      : prevTurn?.team1status[currentTurn.pokemon1].hp ?? activePokemon1.HP
  );

  const displayHP2 = Number(
    currentTurnIndex === 0
      ? activePokemon2.HP
      : prevTurn?.team2status[currentTurn.pokemon2].hp ?? activePokemon2.HP
  );

  const nextTurn = () => {
    if (currentTurnIndex < battle.turns.length - 1) {
      setCurrentTurnIndex((i) => i + 1);
    }
  };

  const prevTurnFunc = () => {
    if (currentTurnIndex > 0) {
      setCurrentTurnIndex((i) => i - 1);
    }
  };
  //helper function to show if a trainer switched or used a move or both (on case of death)
  function descSwitch(
    trainerName: string,
    prevPokemonIndex: number,
    currentPokemonIndex: number,
    currentPokemonName: string,
    movedThisTurn: boolean,
    moveUsed: string | null
  ): string | null {
    if (prevPokemonIndex !== currentPokemonIndex && movedThisTurn && moveUsed) {
      return `${trainerName} switched to ${currentPokemonName} and used ${moveUsed}`;
    }
    if (prevPokemonIndex !== currentPokemonIndex) {
      return `${trainerName} switched to ${currentPokemonName}`;
    }
    if (movedThisTurn && moveUsed) {
      return `${trainerName} used ${moveUsed}`;
    }
    return null;
  }

  function getTurnDescription(
    turn: BattleTurn,
    prevTurn: BattleTurn | null,
    battle: Battle
  ): string {
    if (!prevTurn) return "Start Round";

    const events = [
      descSwitch(
        battle.trainer1,
        prevTurn.pokemon1,
        turn.pokemon1,
        battle.trainer1team[turn.pokemon1].Name,
        turn.movingTrainer === 1,
        turn.moveUsed
      ),
      descSwitch(
        battle.trainer2,
        prevTurn.pokemon2,
        turn.pokemon2,
        battle.trainer2team[turn.pokemon2].Name,
        turn.movingTrainer === 2,
        turn.moveUsed
      ),
    ].filter(Boolean);

    return events.length > 0 ? events.join(" & ") : "No move";
  }

  return (
    <Modal visible={visible} onClose={onClose}>
      <div className="historyBattleModalContainer">
        <button className="modalCloseButton" onClick={onClose}>
          ✕
        </button>
        <h2>
          {battle.trainer1} vs {battle.trainer2}
        </h2>

        <p>
          Turn {currentTurn.turnNumber + 1} of {battle.turns.length} —{" "}
          {getTurnDescription(currentTurn, prevTurn, battle)}
        </p>

        <div className="historyBattlePokemonContainer">
          <div>
            <img
              src={nameToImageUri(activePokemon1.Name)}
              className={displayHP1 <= 0 ? "faintedPokemon" : ""}
            />
            <p>
              {activePokemon1.Name} — HP: {displayHP1}
            </p>
            <p className="trainerName">{battle.trainer1}</p>
          </div>

          <div>
            <img
              src={nameToImageUri(activePokemon2.Name)}
              className={displayHP2 <= 0 ? "faintedPokemon" : ""}
            />
            <p>
              {activePokemon2.Name} — HP: {displayHP2}
            </p>
            <p className="trainerName">{battle.trainer2}</p>
          </div>
        </div>

        <div className="historyBattleNav">
          <button onClick={prevTurnFunc} disabled={currentTurnIndex === 0}>
            Previous
          </button>
          <button
            onClick={nextTurn}
            disabled={currentTurnIndex === battle.turns.length - 1}
          >
            Next
          </button>
        </div>

        {battle.status.includes("win") && (
          <p className="winnerText">
            🏆{" "}
            {battle.status === "trainer1win"
              ? battle.trainer1
              : battle.trainer2}{" "}
            has won!
          </p>
        )}
      </div>
    </Modal>
  );
}
