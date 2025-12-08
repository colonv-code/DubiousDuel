import type { Pokemon } from "../../api/pokemon.api";
import { Modal } from "../../components/Modal";
import "./PokemonModal.css";
import { nameToImageUri } from "../../helpers/nameToImageUri";
import TypePill from "../../components/TypePill";

export interface PokemonModalProps {
  pokemon: Pokemon;
  visible: boolean;
  onClose: () => void;
}

export function PokemonModal({ visible, pokemon, onClose }: PokemonModalProps) {
  return (
    <div className="pokemonModalOuter">
      <Modal visible={visible} onClose={onClose}>
        <div className="pokemonModalContainer">
          <button className="modalCloseButton" onClick={onClose}>
            ✕
          </button>
          <h2>{pokemon.Name}</h2>
          <div className="main">
            <div className="pokemonModal-image">
              <img src={nameToImageUri(pokemon.Name)} alt={pokemon.Name} />
            </div>
            <div className="stats">
              <TypePill type={pokemon.Type1} />
              {pokemon.Type2 !== "None" && <TypePill type={pokemon.Type2} />}
              <p>Category: {pokemon.Category}</p>
              <p>❤️ HP: {pokemon.HP}</p>
              <p>⚔️ Attack: {pokemon.Attack}</p>
              <p>🛡️ Defense: {pokemon.Defense}</p>
              <p>✨ Sp. Attack: {pokemon.SpAttack}</p>
              <p>🫧 Sp. Defense: {pokemon.SpDefense}</p>
              <p>💨 Speed: {pokemon.Speed}</p>
            </div>
          </div>

          <h3>Moves</h3>
          <table className="pokemonModal-movesTable">
            <thead>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Power</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(pokemon.Moves).map(([moveName, move]) => (
                <tr key={moveName}>
                  <td>{moveName}</td>
                  <td>{move.Description}</td>
                  <td>{move.Power}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </div>
  );
}
