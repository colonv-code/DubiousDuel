import { useEffect, useState } from "react";
import "./PageFrame.css";
import { type Trainer } from "../../api/trainer.api";
import { LoginPage } from "../Login/LoginPage";
import { TrainerPage } from "../Trainer/TrainerPage";
import { BattlePage } from "../Battle/BattlePage";
import { HistoryPage } from "../History/HistoryPage";
import { PokedexPage } from "../Pokedex/PokedexPage";

export type Page = "login" | "trainer" | "battle" | "history" | "pokedex";

export function PageFrame() {
  const [currentPage, setCurrentPage] = useState<Page>("login");
  const [loggedInTrainer, setLoggedInTrainer] = useState<Trainer | null>(null);
  const showSidebar = currentPage !== "login";

  useEffect(() => {
    if (loggedInTrainer) {
      setCurrentPage("trainer");
    } else {
      setCurrentPage("login");
    }
  }, [loggedInTrainer]);

  const pageComponents = {
    login: <LoginPage setTrainer={setLoggedInTrainer} />,
    trainer: (
      <TrainerPage trainer={loggedInTrainer} setTrainer={setLoggedInTrainer} />
    ),
    battle: (
      <BattlePage trainer={loggedInTrainer} setTrainer={setLoggedInTrainer} />
    ),
    history: <HistoryPage trainer={loggedInTrainer} />,
    pokedex: <PokedexPage />,
  };

  const handleLogoutClick = () => {
    setLoggedInTrainer(null);
  };

  return (
    <div className="pageframe">
      {showSidebar && (
        <div className="sidebar">
          <h1>Dubious Duel</h1>
          <button
            className={`navbutton ${
              currentPage === "trainer" && "navbuttonselected"
            }`}
            onClick={() => setCurrentPage("trainer")}
          >
            Trainer
          </button>
          <button
            className={`navbutton ${
              currentPage === "battle" && "navbuttonselected"
            }`}
            onClick={() => setCurrentPage("battle")}
          >
            Battle
          </button>
          <button
            className={`navbutton ${
              currentPage === "history" && "navbuttonselected"
            }`}
            onClick={() => setCurrentPage("history")}
          >
            History
          </button>
          <button
            className={`navbutton ${
              currentPage === "pokedex" && "navbuttonselected"
            }`}
            onClick={() => setCurrentPage("pokedex")}
          >
            Pokedex
          </button>
          <button className={`navbutton`} onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      )}
      <div className="content">{pageComponents[currentPage]}</div>
    </div>
  );
}
