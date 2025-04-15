import "./App.css";
import { useState, useEffect } from "react";
import LoginPage from "./loginPage";
import MobileSchedule from "./unifiedSchedule";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
    }
  }, []);

  return (
    <div className="App">
      {isAuthenticated ? (
        <MobileSchedule />
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
