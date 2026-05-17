import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PrivateRoute from "./components/PrivateRoute";

/**
 * Componente raiz da aplicação.
 *
 * Responsabilidades:
 * - Configurar o roteamento da aplicação.
 * - Proteger rotas privadas com PrivateRoute.
 * - Redirecionar / para /login por padrão.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redireciona a raiz para /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rota pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas privadas – só acessíveis com token */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        {/* Rota curinga – qualquer URL inválida vai para /login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;