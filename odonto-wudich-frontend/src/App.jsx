import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PatientsPage from "./pages/PatientsPage";
import PatientFormPage from "./pages/PatientFormPage";
import PrivateRoute from "./components/PrivateRoute";


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

        <Route
          path="/patients"
          element={
            <PrivateRoute>
              <PatientsPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/patients/new"
          element={
            <PrivateRoute>
              <PatientFormPage />
            </PrivateRoute>
          }
        />

        <Route
          path="/patients/:id/edit"
          element={
            <PrivateRoute>
              <PatientFormPage />
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