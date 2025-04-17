// App.js
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import LoginPage from "./loginPage";
import MobileSchedule from "./unifiedSchedule";
import PublicSchedule from "./publicSchedule";
import Footer from "./footer";
import Header from "./header";

function Layout({ children }) {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";

  return (
    <>
      {!hideLayout && <Header />}
      {children}
    </>
  );
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return !!localStorage.getItem("token");
  });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     fetch("https://beach-manager-api.onrender.com/ping")
  //       .then((res) => res.text())
  //       .then((text) => console.log("✅ Backend respondendo:", text))
  //       .catch((err) => console.error("❌ Erro ao pingar:", err));
  //   }, 60000);

  //   fetch("https://beach-manager-api.onrender.com/ping")
  //     .then((res) => res.text())
  //     .then((text) => console.log("✅ Backend inicial:", text))
  //     .catch((err) => console.error("❌ Erro inicial:", err));

  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <Layout>
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
      </Layout>
      <Footer />
    </Router>
  );
}

export default App;
