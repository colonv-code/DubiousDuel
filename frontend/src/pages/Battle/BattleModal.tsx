import type { Battle } from "../../api/battle.api";
import type { Pokemon } from "../../api/pokemon.api";
import type { Trainer } from "../../api/trainer.api";
import { Modal } from "../../components/Modal";
import { nameToImageUri } from "../../helpers/nameToImageUri";
import "./BattleModal.css";

export interface BattleModalProps {
  visible: boolean;
  battle: Battle;
  trainer: Trainer;
  selectedMoveName: string | null;
  selectedPokemonIndex: number | null;
  onClose: () => void;
  onMoveSelected: (moveName: string) => void;
  onPokemonSelected: (pokemonIndex: number) => void;
  onTurnComplete: () => void;
}

export function BattleModal({
  visible,
  battle,
  trainer,
  selectedMoveName,
  selectedPokemonIndex,
  onClose,
  onMoveSelected,
  onPokemonSelected,
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

  const yourPokemon =
    battle.trainer1 === trainer.username ? pokemon1 : pokemon2;
  const yourPokemonIndex =
    battle.trainer1 === trainer.username
      ? latestTurn.pokemon1
      : latestTurn.pokemon2;

  // filter out moves that have Power of "--" or "??"
  // these are usually status moves that don't do damage
  // our UI only shows damaging moves for now
  const filteredMoves = Object.entries(yourPokemon.Moves).filter(
    ([, move]) => move.Power !== "--" && move.Power !== "??"
  );

  const yourTeam =
    battle.trainer1 === trainer.username
      ? battle.trainer1team
      : battle.trainer2team;

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
          battle.trainer1 === trainer.username
            ? "battleModalTrainer1"
            : "battleModalTrainer2"
        }`}
      >
        <div className="battleSideContainer">
          <p>{yourPokemon.Name}'s Moves</p>
          <div className="movesContainer">
            {filteredMoves.map(([moveName, move]) => (
              <div
                className={`moveRow ${
                  selectedMoveName === moveName ? "selectedMove" : ""
                }`}
                key={moveName}
                onClick={createMoveSelectedHandler(moveName)}
              >
                {moveName}: {move.Power}
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
                alt={pokemon ? pokemon.Name : "No Pokemon"}
              />
            ))}
          </div>
        </div>
        <div className="battleCenterContainer">
          <p>
            {battle.trainer1} vs. {battle.trainer2}
          </p>
          {isYourTurn && (
            <p>Your turn! Choose a move or switch your pokemon.</p>
          )}
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
      </div>
    </Modal>
  );
}
