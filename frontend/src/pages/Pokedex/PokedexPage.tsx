import type { Pokemon } from "../../api/pokemon.api";
import { getPokemon } from "../../api/pokemon.api";
import { useState, useEffect } from "react";
import "./PokedexPage.css";
import { PokemonCard } from "./PokemonCard";
import { PokemonModal } from "./PokemonModal";

export interface PokedexPageProps {}
/*my plan here is to have a similar structure as history and battle
Cards of pokemon will appear in rows according to their number cards 
cards will show pokemone name and image and when clicked on
open a modal with more detailed info - such as stats, types, moves, etc.
*/
export function PokedexPage({}: PokedexPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getPokemon().then((res) => {
      setPokemon(res);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="pokedexPage">
      <h1>Pokedex</h1>
      {isLoading && <p>Loading...</p>}
      <div className="pokemonList">
        {pokemon.map((p) => (
          <PokemonCard
            key={p._id}
            pokemon={p}
            onClick={() => setSelectedPokemon(p)}
          />
        ))}
      </div>
      {selectedPokemon && (
        <PokemonModal
          visible={true}
          pokemon={selectedPokemon}
          onClose={() => setSelectedPokemon(null)}
        />
      )}
    </div>
  );
}
