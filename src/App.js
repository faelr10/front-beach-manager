// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./loginPage";
import MobileSchedule from "./unifiedSchedule";
import PublicSchedule from "./publicSchedule";
import Footer from "./footer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("⏰ Fazendo ping no backend...");

      fetch("https://beach-manager-api.onrender.com/ping")
        .then((res) => res.text())
        .then((text) => {
          console.log("✅ Resposta do backend:", text);
        })
        .catch((err) => {
          console.error("❌ Erro ao pingar o backend:", err);
        });
    }, 1 * 60 * 1000); // a cada 1 minuto

    // executa uma vez imediatamente ao abrir a aplicação
    fetch("https://beach-manager-api.onrender.com/ping")
      .then((res) => res.text())
      .then((text) => {
        console.log("✅ Backend inicial respondido:", text);
      })
      .catch((err) => {
        console.error("❌ Erro ao pingar inicialmente:", err);
      });

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/agendamento" replace />
            ) : (
              <LoginPage onLogin={() => setIsAuthenticated(true)} />
            )
          }
        />
        <Route
          path="/agendamento"
          element={
            isAuthenticated ? (
              <MobileSchedule />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="/agenda-publica" element={<PublicSchedule />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
