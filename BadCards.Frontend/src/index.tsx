import ReactDOM from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Auth } from "./Components/Auth/Auth";
import { AuthProvider } from "./Components/Auth/AuthProvider";
import { Start } from "./Components/Start";
import { NavBar } from "./Components/NavBar/NavBar";
import { Trans } from "react-i18next";
import i18next from "i18next";
import "./i18n";
import { Legal } from "./Components/Legal";
import { Config } from "./Config";
import { GameController } from "./Components/GameController";
import { ConnectionProvider } from "./Components/ConnectionProvider/ConnectionProvider";

Config.default = new Config();

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <AuthProvider>
    <ConnectionProvider>
      <Trans i18n={i18next}>
        <NavBar />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Start />}></Route>
            <Route path="/legal" element={<Legal />}></Route>
            <Route path="/lobby" element={<GameController />}></Route>
            <Route path="/start" element={<Start />}></Route>
            <Route path="/auth/discord" element={<Auth />}></Route>
            <Route path="*" element={<Start />}></Route>
          </Routes>
        </BrowserRouter>
      </Trans>
    </ConnectionProvider>
  </AuthProvider>
);
