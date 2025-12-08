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

  const createNavClickHandler = (page: Page) => {
    return () => setCurrentPage(page);
  };

  return (
    <div className="pageframe">
      {showSidebar && (
        <div className="sidebar">
          <div className="sidebar-top">
            <h1>Dubious Duel</h1>
            <nav className="nav-buttons">
              <button
                className={`navbutton ${
                  currentPage === "trainer" && "navbuttonselected"
                }`}
                onClick={createNavClickHandler("trainer")}
              >
                <span className="nav-emoji">👤</span>
                <span className="nav-text">Trainer</span>
              </button>
              <button
                className={`navbutton ${
                  currentPage === "battle" && "navbuttonselected"
                }`}
                onClick={createNavClickHandler("battle")}
              >
                <span className="nav-emoji">⚔️</span>
                <span className="nav-text">Battle</span>
              </button>
              <button
                className={`navbutton ${
                  currentPage === "history" && "navbuttonselected"
                }`}
                onClick={createNavClickHandler("history")}
              >
                <span className="nav-emoji">📜</span>
                <span className="nav-text">Battle History</span>
              </button>
              <button
                className={`navbutton ${
                  currentPage === "pokedex" && "navbuttonselected"
                }`}
                onClick={createNavClickHandler("pokedex")}
              >
                <span className="nav-emoji">📖</span>
                <span className="nav-text">Pokedex</span>
              </button>
            </nav>
          </div>
          <div className="sidebar-bottom">
            <button
              className="navbutton logout-button"
              onClick={handleLogoutClick}
            >
              <span className="nav-emoji">🚪</span>
              <span className="nav-text">Logout</span>
            </button>
          </div>
        </div>
      )}
      <div className="content">{pageComponents[currentPage]}</div>
    </div>
  );
}
