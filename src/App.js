import "./App.css";
import VolleyballCourtBooking from "./agenda";
import { useState, useEffect } from "react";
import LoginPage from "./loginPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  // Se quiser, também pode adicionar um logout automático se o token for removido
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <div className="App">
      {isAuthenticated ? (
        <VolleyballCourtBooking />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
