import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Game from "./components/compound/Game/game.tsx";
import React from "react";
import { AppTypeContextProvider } from "./contexts/appTypeContext.tsx";

createRoot(document.getElementById("root")!).render(
  // <div className="text-3xl text-custom-border">
  //   Vite works with Reddit Devvit
  // </div>
  // <HowToPlay />
  <StrictMode>
    <AppTypeContextProvider>
      <Game />
    </AppTypeContextProvider>
  </StrictMode>
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
