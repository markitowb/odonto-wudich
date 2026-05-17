import { useState } from "react";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    Boolean(localStorage.getItem("accessToken"))
  );

  function handleLogout() {
    // Remove tokens do storage
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    // Reseta o estado - força a exibição da tela de login
    setIsAuthenticated(false);
  }

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return <HomePage onLogout={handleLogout} />;
}

export default App;