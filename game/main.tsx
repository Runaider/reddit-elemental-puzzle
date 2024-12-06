import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router";
import Menu from "./components/pages/Menu/index.tsx";
import Game from "./components/compound/Game/game.tsx";
import HowToPlay from "./components/compound/HowToPlay/index.tsx";
import React from "react";

createRoot(document.getElementById("root")!).render(
  // <div className="text-3xl text-custom-border">
  //   Vite works with Reddit Devvit
  // </div>
  // <HowToPlay />
  <Game difficulty="easy" />
  // <StrictMode>
  //   <BrowserRouter>
  //     <Routes>
  //       <Route path="/" element={<Menu />} />
  //       <Route path="/easy" element={<Game difficulty="easy" />} />
  //       <Route path="/medium" element={<Game difficulty="medium" />} />
  //       <Route path="/hard" element={<Game difficulty="hard" />} />
  //       <Route path="/how-to-play" element={<HowToPlay />} />
  //     </Routes>
  //   </BrowserRouter>
  // </StrictMode>
);
