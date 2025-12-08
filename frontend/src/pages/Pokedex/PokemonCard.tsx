import type { Pokemon } from "../../api/pokemon.api";
import "./PokemonCard.css";
import { nameToImageUri } from "../../helpers/nameToImageUri";

export interface PokemonCardProps {
  pokemon: Pokemon;
  onClick?: () => void;
}

export function PokemonCard({ pokemon, onClick }: PokemonCardProps) {
  return (
    <div className="pokemonCard" onClick={onClick}>
      <div className="pokemonCard-image">
        <img src={nameToImageUri(pokemon.Name)} alt={pokemon.Name} />
      </div>

      <div className="pokemonCard-name">{pokemon.Name}</div>
    </div>
  );
}
