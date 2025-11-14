import { useEffect, useState } from "react";
import "./App.css";
import { getPokemon, type Pokemon } from "./api/pokemon.api";

function App() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);

  useEffect(() => {
    getPokemon().then(setPokemon);
  }, []);

  return (
    <div>
      {pokemon.map((pok) => (
        <p>{pok.Name}</p>
      ))}
    </div>
  );
}

export default App;
