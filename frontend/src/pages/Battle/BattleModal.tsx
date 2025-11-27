import type { PokemonStatus } from "../../api/battle.api";
import type { Move, Pokemon } from "../../api/pokemon.api";
import { Modal } from "../../components/Modal";
import { nameToImageUri } from "../../helpers/nameToImageUri";
import "./BattleModal.css";

export interface BattleModalProps {
  visible: boolean;
  isYourTurn: boolean;
  isTrainer1: boolean;
  trainer1: string;
  trainer2: string;
  pokemon1Name: string;
  pokemon2Name: string;
  pokemon1index: number;
  pokemon2index: number;
  team1status: PokemonStatus[];
  team2status: PokemonStatus[];
  yourPokemon: Pokemon;
  yourPokemonIndex: number;
  yourTeam: Pokemon[];
  yourMoves: Record<string, Move>;
  selectedMoveName: string | null;
  selectedPokemonIndex: number | null;
  turnMessage: string | null;
  onClose: () => void;
  onMoveSelected: (moveName: string) => void;
  onPokemonSelected: (pokemonIndex: number) => void;
  onTurnComplete: () => void;
}

export function BattleModal({
  visible,
  isYourTurn,
  isTrainer1,
  trainer1,
  trainer2,
  pokemon1Name,
  pokemon2Name,
  pokemon1index,
  pokemon2index,
  team1status,
  team2status,
  yourPokemon,
  yourPokemonIndex,
  yourTeam,
  yourMoves,
  selectedMoveName,
  selectedPokemonIndex,
  turnMessage,
  onClose,
  onMoveSelected,
  onPokemonSelected,
  onTurnComplete,
}: BattleModalProps) {
  if (!visible) return null;

  const createMoveSelectedHandler = (moveName: string) => () => {
    onMoveSelected(moveName);
  };

  const createPokemonSelectedHandler =
    (pokemon: Pokemon, pokemonIndex: number) => () => {
      if (pokemon === yourPokemon) return; // can't select the active pokemon
      onPokemonSelected(pokemonIndex);
    };

  return (
    <Modal visible={visible} onClose={onClose}>
      <div
        className={`battleModalContainer ${
          // Determine which side the trainer is on and display accordingly
          isTrainer1 ? "battleModalTrainer1" : "battleModalTrainer2"
        }`}
      >
        <div className="battleSideContainer">
          <p>{yourPokemon.Name}'s Moves</p>
          <div className="movesContainer">
            {Object.entries(yourMoves).map(([moveName, move]) => (
              <div
                className={`moveRow ${
                  selectedMoveName === moveName ? "selectedMove" : ""
                }`}
                key={moveName}
                onClick={createMoveSelectedHandler(moveName)}
                title={move.Description}
              >
                {moveName}: {move.Power} Power, {move.Accuracy}% Accuracy
              </div>
            ))}
          </div>
          <p>Your Team</p>
          <div className="teamContainer">
            {yourTeam.map((pokemon, index) => (
              <img
                src={nameToImageUri(pokemon.Name)}
                className={`teamPokemon ${
                  selectedPokemonIndex === index ? "selectedPokemon" : ""
                } 
                ${yourPokemonIndex === index ? "activePokemon" : ""}`}
                onClick={createPokemonSelectedHandler(pokemon, index)}
              />
            ))}
          </div>
        </div>
        <div className="battleCenterContainer">
          <p>
            {trainer1} vs. {trainer2}
          </p>
          {isYourTurn && (
            <p>Your turn! Choose a move or switch your pokemon.</p>
          )}
          <div className="battlePokemonContainer">
            <div style={{ flexDirection: "column" }}>
              <img src={nameToImageUri(pokemon1Name)} />
              <p>HP: {team1status[pokemon1index].hp}</p>
            </div>
            <div style={{ flexDirection: "column" }}>
              <img src={nameToImageUri(pokemon2Name)} />
              <p>HP: {team2status[pokemon2index].hp}</p>
            </div>
          </div>
          {isYourTurn && (
            <div className="battleActionContainer">
              <p>{turnMessage}</p>
              <button disabled={turnMessage === null} onClick={onTurnComplete}>
                Confirm
              </button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
