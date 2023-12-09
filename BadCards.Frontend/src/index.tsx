import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Auth } from "./Components/Auth/Auth";
import { AuthProvider } from "./Components/Auth/AuthProvider";
import { LobbyManager } from "./Components/LobbyManager";
import { Login } from "./Components/Auth/Login";
import { Lobby } from "./Components/Lobby";
import { NavBar } from "./Components/NavBar";
import { Trans } from "react-i18next";
import i18next from "i18next";
import "./i18n"
import { Legal } from "./Components/Legal";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <AuthProvider>
    <Trans i18n={i18next}>
      <NavBar></NavBar>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LobbyManager />}></Route>
          <Route path="/legal" element={<Legal />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/auth/discord" element={<Auth />}></Route>
          <Route path="/dashboard" element={<LobbyManager />}></Route>
          <Route path="/lobby" element={<Lobby />}></Route>
          <Route path="*" element={<LobbyManager/>}></Route>
        </Routes>
      </BrowserRouter>
    </Trans>
  </AuthProvider>
);
