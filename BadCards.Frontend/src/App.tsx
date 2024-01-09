import "./App.css";
import { useContext, useEffect } from "react";
import { AuthContext } from "./Context/AuthContext";

function App() {
  const user = useContext(AuthContext);

  useEffect(() => {
    if (!user.IsLoggedIn && user.IsFetched) {
      window.location.href = "/";
    } else if (user.IsLoggedIn && user.IsFetched) {
      window.location.href = "/start";
    }
  }, []);

  return <></>;
}

export default App;
