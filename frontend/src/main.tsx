import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { PageFrame } from "./pages/RootLayout/PageFrame.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <PageFrame />
  </StrictMode>
);
