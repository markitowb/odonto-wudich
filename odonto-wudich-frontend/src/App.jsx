import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PatientsPage from "./pages/PatientsPage";
import PatientFormPage from "./pages/PatientFormPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import AppointmentFormPage from "./pages/AppointmentFormPage";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Raiz → /login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* Rota pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas privadas */}
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <HomePage />
            </PrivateRoute>
          }
        />

        {/* Pacientes */}
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

        {/* Agendamentos */}
        <Route
          path="/appointments"
          element={
            <PrivateRoute>
              <AppointmentsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments/new"
          element={
            <PrivateRoute>
              <AppointmentFormPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/appointments/:id/edit"
          element={
            <PrivateRoute>
              <AppointmentFormPage />
            </PrivateRoute>
          }
        />

        {/* Rota curinga */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;