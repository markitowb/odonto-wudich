import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";
import PrivateRoute from "./components/PrivateRoute";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import PatientsPage from "./pages/PatientsPage";
import PatientFormPage from "./pages/PatientFormPage";
import AppointmentsPage from "./pages/AppointmentsPage";
import AppointmentFormPage from "./pages/AppointmentFormPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota pública */}
        <Route path="/login" element={<LoginPage />} />

        {/* Rotas privadas com Layout */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/home" element={<HomePage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/patients/new" element={<PatientFormPage />} />
          <Route path="/patients/:id/edit" element={<PatientFormPage />} />
          <Route path="/appointments" element={<AppointmentsPage />} />
          <Route path="/appointments/new" element={<AppointmentFormPage />} />
          <Route path="/appointments/:id/edit" element={<AppointmentFormPage />} />
        </Route>

        {/* Qualquer outra rota vai para login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}