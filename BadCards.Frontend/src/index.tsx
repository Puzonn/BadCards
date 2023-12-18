import ReactDOM from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Auth } from "./Components/Auth/Auth";
import { AuthProvider } from "./Components/Auth/AuthProvider";
import { Start } from "./Components/Start";
import { Lobby } from "./Components/Lobby";
import { NavBar } from "./Components/NavBar";
import { Trans } from "react-i18next";
import i18next from "i18next";
import "./i18n";
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
          <Route path="/" element={<Start />}></Route>
          <Route path="/legal" element={<Legal />}></Route>
          <Route path="/start" element={<Start />}></Route>
          <Route path="/auth/discord" element={<Auth />}></Route>
          <Route path="/lobby" element={<Lobby />}></Route>
          <Route path="*" element={<Start />}></Route>
        </Routes>
      </BrowserRouter>
    </Trans>
  </AuthProvider>
);
