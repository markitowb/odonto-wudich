import { Navigate } from "react-router-dom";

/**
 * Componente que protege rotas privadas.
 *
 * Se o usuário tiver um accessToken válido no localStorage,
 * renderiza o componente filho normalmente.
 *
 * Se não tiver token, redireciona automaticamente para /login.
 */
function PrivateRoute({ children }) {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    // Redireciona para login sem renderizar nada
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;