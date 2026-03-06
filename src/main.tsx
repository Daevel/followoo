import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { GetStarted } from "./components/pages/GetStarted.tsx";
import { InstructionsToStart } from "./components/pages/InstructionsToStart.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<Navigate to="/" />} />
        <Route path="/" element={<App />} />
        <Route path="/get-started" element={<GetStarted />} />
        <Route path="/instructions-to-start" element={<InstructionsToStart />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
