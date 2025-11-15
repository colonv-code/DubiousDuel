import { useEffect, useMemo, useState } from "react";
import type { Trainer } from "../../api/trainer.api";
import { getPokemon, type Pokemon } from "../../api/pokemon.api";
import "./TrainerPage.css";

export interface TrainerPageProps {
  trainer: Trainer | null;
  setTrainer: (trainer: Trainer) => void;
}

export function TrainerPage({ trainer }: TrainerPageProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);

  const [searchInput, setSearchInput] = useState<string>("");
  const filteredList = useMemo(
    () =>
      pokemonList.filter(
        (pokemon) =>
          pokemon.Name.toLocaleLowerCase().includes(
            searchInput.toLocaleLowerCase()
          ) ||
          pokemon.Id.toLocaleLowerCase().includes(
            searchInput.toLocaleLowerCase()
          )
      ),
    [pokemonList, searchInput]
  );

  useEffect(() => {
    setIsLoading(true);
    getPokemon().then((res) => {
      setPokemonList(res);
      setIsLoading(false);
    });
  }, []);

  const createPokemonRowClickHandler = (pokemon: Pokemon) => () => {
    // todo
  };

  return (
    <div className="trainerPage">
      <div className="teamBuilder">
        <h1>Welcome, Trainer {trainer?.username}!</h1>
      </div>
      <div className="pokemonSidebar">
        <input
          type="text"
          placeholder="search"
          onChange={(e) => setSearchInput(e.target.value)}
        />
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <div className="scrollContainer">
            {filteredList.map((pokemon) => (
              <p
                className="pokemonRow"
                onClick={createPokemonRowClickHandler(pokemon)}
                key={pokemon.Id}
              >
                {pokemon.Id} - {pokemon.Name}
              </p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
