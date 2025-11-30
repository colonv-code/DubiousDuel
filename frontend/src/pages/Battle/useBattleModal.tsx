import { useEffect, useState } from "react";
import {
  processTurn,
  type Battle,
  type BattleTurnRequest,
} from "../../api/battle.api";
import type { Trainer } from "../../api/trainer.api";
import { BattleModal } from "./BattleModal";
import type { Move } from "../../api/pokemon.api";

export function useBattleModal(
  trainer: Trainer,
  onAccepted: (battle: Battle) => void
) {
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [battle, setBattle] = useState<Battle | null>(null);

  const [selectedMoveName, setSelectedMoveName] = useState<string | null>(null);
  const [selectedPokemonIndex, setSelectedPokemonIndex] = useState<
    number | null
  >(null);
  const [turnMessage, setTurnMessage] = useState<string | null>(null);
  const [latestTurnMessage, setLatestTurnMessage] = useState<string | null>(
    null
  );
  const [effectiveMoves, setEffectiveMoves] = useState<Record<
    string,
    Move
  > | null>(null);

  const openModal = (battleToAccept: Battle) => {
    setBattle(battleToAccept);
    setIsVisible(true);
  };

  useEffect(() => {
    // update latest turn message
    // length greater than 1 cuz first turn is just initialization
    if (battle && battle.turns.length > 1) {
      const latestTurn = battle.turns[battle.turns.length - 1];

      const trainerName =
        latestTurn.movingTrainer === 1 ? battle.trainer1 : battle.trainer2;

      const pokemonName =
        latestTurn.movingTrainer === 1
          ? battle.trainer1team[latestTurn.pokemon1].Name
          : battle.trainer2team[latestTurn.pokemon2].Name;

      setLatestTurnMessage(
        latestTurn.moveUsed === null
          ? `${trainerName} switched to ${pokemonName}!`
          : `${trainerName}'s ${pokemonName} used ${latestTurn.moveUsed}!`
      );
    }
  }, [battle]);

  if (!battle) {
    return { children: null, openModal };
  }

  // Compute battle-derived values only when battle exists
  const latestTurn = battle.turns[battle.turns.length - 1];
  const pokemon1 = battle.trainer1team[latestTurn.pokemon1];
  const pokemon2 = battle.trainer2team[latestTurn.pokemon2];

  const isTrainer1 = battle.trainer1 === trainer.username;
  const isYourTurn =
    (battle.status === "trainer1turn" && isTrainer1) ||
    (battle.status === "trainer2turn" && !isTrainer1);

  const yourPokemon = isTrainer1 ? pokemon1 : pokemon2;
  const yourPokemonIndex = isTrainer1
    ? latestTurn.pokemon1
    : latestTurn.pokemon2;

  const yourTeam = isTrainer1 ? battle.trainer1team : battle.trainer2team;
  const yourStatus = isTrainer1
    ? latestTurn.team1status
    : latestTurn.team2status;

  const justFainted = yourStatus[yourPokemonIndex].hp <= 0;

  const handleMoveSelected = (moveName: string) => {
    setSelectedMoveName(moveName);
    if (justFainted) {
      if (selectedPokemonIndex !== null) {
        setTurnMessage(
          `Switch to ${yourTeam[selectedPokemonIndex].Name} and use ${moveName}!`
        );
      }
    } else {
      setSelectedPokemonIndex(null);
      setTurnMessage(`${yourPokemon.Name} will use ${moveName}!`);
    }
  };

  const handlePokemonSelected = (pokemonIndex: number) => {
    setSelectedPokemonIndex(pokemonIndex);
    setSelectedMoveName(null);
    const newPokemonName = yourTeam[pokemonIndex].Name;

    if (justFainted) {
      // when just fainted you switch AND move in one turn
      // so set effective moves to the new pokemon's moves
      setEffectiveMoves(yourTeam[pokemonIndex].Moves);
      setTurnMessage(null);
    } else {
      setTurnMessage(`Switch to ${newPokemonName}!`);
    }
  };

  const handleClose = () => {
    setSelectedMoveName(null);
    setSelectedPokemonIndex(null);
    setBattle(null);
    setIsVisible(false);
  };

  const handleTurnComplete = () => {
    if (battle) {
      const turnRequest: BattleTurnRequest = {
        movingTrainer: isTrainer1 ? 1 : 2,
        moveUsed: selectedMoveName,
        pokemon1: isTrainer1
          ? selectedPokemonIndex !== null
            ? selectedPokemonIndex
            : latestTurn.pokemon1
          : latestTurn.pokemon1,
        pokemon2: !isTrainer1
          ? selectedPokemonIndex !== null
            ? selectedPokemonIndex
            : latestTurn.pokemon2
          : latestTurn.pokemon2,
      };
      processTurn(battle._id, turnRequest).then((updatedBattle) => {
        setBattle(updatedBattle);
        onAccepted(updatedBattle);
        setSelectedMoveName(null);
        setSelectedPokemonIndex(null);
        setTurnMessage(null);
      });
    }
  };

  return {
    children: (
      <BattleModal
        visible={isVisible}
        isYourTurn={isYourTurn}
        isTrainer1={isTrainer1}
        trainer1={battle.trainer1}
        trainer2={battle.trainer2}
        pokemon1Name={pokemon1.Name}
        pokemon2Name={pokemon2.Name}
        pokemon1index={latestTurn.pokemon1}
        pokemon2index={latestTurn.pokemon2}
        team1status={latestTurn.team1status}
        team2status={latestTurn.team2status}
        yourPokemon={yourPokemon}
        yourPokemonIndex={yourPokemonIndex}
        yourTeam={yourTeam}
        yourMoves={effectiveMoves ?? yourPokemon.Moves}
        yourStatus={yourStatus}
        selectedMoveName={selectedMoveName}
        selectedPokemonIndex={selectedPokemonIndex}
        turnMessage={turnMessage}
        latestTurnMessage={latestTurnMessage}
        justFainted={justFainted}
        onMoveSelected={handleMoveSelected}
        onPokemonSelected={handlePokemonSelected}
        onClose={handleClose}
        onTurnComplete={handleTurnComplete}
      />
    ),
    openModal,
  };
}
