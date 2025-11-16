import { useEffect, useMemo, useState } from "react";
import { upsertTrainer, type Trainer } from "../../api/trainer.api";
import { getPokemon, type Pokemon } from "../../api/pokemon.api";
import "./TrainerPage.css";
import { nameToImageUri } from "../../helpers/nameToImageUri";
import pokeball from "../../assets/pokeball.png";

export interface TrainerPageProps {
  trainer: Trainer | null;
  setTrainer: (trainer: Trainer) => void;
}

export function TrainerPage({ trainer, setTrainer }: TrainerPageProps) {
  // shouldn't get to this page if trainer is null
  if (!trainer?.username) return;

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

  const [initialTeam, setInitialTeam] = useState<Pokemon[]>(trainer.team);
  const [pendingTeam, setPendingTeam] = useState<Pokemon[]>(trainer.team);

  useEffect(() => {
    setIsLoading(true);
    getPokemon().then((res) => {
      setPokemonList(res);
      setIsLoading(false);
    });
  }, []);

  const createPokemonImageClickHandler = (index: number) => () => {
    setPendingTeam(pendingTeam.filter((_, i) => index !== i));
  };

  const handleResetClick = () => {
    setPendingTeam(initialTeam);
  };

  const handleSaveClick = () => {
    setInitialTeam(pendingTeam);
    const updatedTrainer = {
      username: trainer.username,
      team: pendingTeam,
    };
    upsertTrainer(updatedTrainer);
    // todo: add a .then to confirm team was updated or some shit
    setTrainer(updatedTrainer);
  };

  const createPokemonRowClickHandler = (pokemon: Pokemon) => () => {
    if (pendingTeam.length < 6) {
      setPendingTeam([...pendingTeam, pokemon]);
    }
  };

  return (
    <div className="trainerPage">
      <div className="teamBuilder">
        <h1>Welcome, Trainer {trainer.username}!</h1>
        <div className="teamImageContainer">
          {Array.from({ length: 6 }).map((_, i) => (
            <img
              key={i}
              className="teamPokemonImage"
              src={
                pendingTeam[i] ? nameToImageUri(pendingTeam[i].Name) : pokeball
              }
              onClick={createPokemonImageClickHandler(i)}
            />
          ))}
        </div>
        <div className="teamActionContainer">
          <button className="teamActionButton" onClick={handleResetClick}>
            Reset
          </button>
          <button
            className="teamActionButton"
            disabled={
              JSON.stringify(initialTeam) === JSON.stringify(pendingTeam)
            }
            onClick={handleSaveClick}
          >
            Save
          </button>
        </div>
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
