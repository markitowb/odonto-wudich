// src/pages/AppointmentFormPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPatch } from "../services/api";

function AppointmentFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patient_id: "",
    dentist_id: "",
    start_datetime: "",
    end_datetime: "",
    status: "scheduled",
    notes: "",
  });

  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Carrega pacientes, dentistas e (se edição) dados do agendamento
  useEffect(() => {
    async function loadInitialData() {

      try {
        // Carrega pacientes e dentistas em paralelo
        const [patientsData, dentistsData] = await Promise.all([
          apiGet("/patients/"),
          apiGet("/users/dentists/"),
        ]);

        setPatients(patientsData);
        setDentists(dentistsData);

        // Se for edição, carrega os dados do agendamento
        if (isEditing) {
          const appointmentData = await apiGet(`/appointments/${id}/`);

          // O serializer retorna patient (nome) e dentist (username) na leitura
          // mas para preencher o form precisamos dos IDs
          // Por isso usamos patient_id e dentist_id que vêm do objeto
          setFormData({
            patient_id: appointmentData.patient_id ?? "",
            dentist_id: appointmentData.dentist_id ?? "",
            start_datetime: formatForInput(appointmentData.start_datetime),
            end_datetime: formatForInput(appointmentData.end_datetime),
            status: appointmentData.status,
            notes: appointmentData.notes || "",
          });
        }
      } catch (error) {
        console.error(error);
        setErrorMessage("Erro ao carregar dados. Tente novamente.");
      } finally {
        setIsFetching(false);
      }
    }

    loadInitialData();
  }, [id, isEditing]);

  // Converte "2026-05-17T10:00:00Z" → "2026-05-17T10:00" (formato aceito pelo input datetime-local)
  function formatForInput(isoString) {
    if (!isoString) return "";
    return isoString.slice(0, 16);
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);


    try {
      if (isEditing) {
        await apiPatch(`/appointments/${id}/`, formData);
        setSuccessMessage("Agendamento atualizado com sucesso!");
      } else {
        await apiPost("/appointments/", formData);
        setSuccessMessage("Agendamento criado com sucesso!");
      }

      setTimeout(() => navigate("/appointments"), 1000);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        isEditing
          ? "Erro ao atualizar agendamento. Verifique os dados."
          : "Erro ao criar agendamento. Verifique os dados."
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return <p style={{ padding: "2rem" }}>Carregando...</p>;
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>{isEditing ? "Editar Agendamento" : "Novo Agendamento"}</h1>
        <button
          onClick={() => navigate("/appointments")}
          style={{
            padding: "0.5rem 1rem",
            background: "#6c757d",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Voltar
        </button>
      </header>

      {errorMessage && (
        <p style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</p>
      )}
      {successMessage && (
        <p style={{ color: "green", marginBottom: "1rem" }}>{successMessage}</p>
      )}

      <form onSubmit={handleSubmit}>
        {/* Paciente */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Paciente *</label>
          <select
            name="patient_id"
            value={formData.patient_id}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Selecione o paciente...</option>
            {patients.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.full_name}
              </option>
            ))}
          </select>
        </div>

        {/* Dentista */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Dentista *</label>
          <select
            name="dentist_id"
            value={formData.dentist_id}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="">Selecione o dentista...</option>
            {dentists.map((dentist) => (
              <option key={dentist.id} value={dentist.id}>
                {dentist.username}
              </option>
            ))}
          </select>
        </div>

        {/* Início */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Data e hora de início *</label>
          <input
            type="datetime-local"
            name="start_datetime"
            value={formData.start_datetime}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* Fim */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Data e hora de fim *</label>
          <input
            type="datetime-local"
            name="end_datetime"
            value={formData.end_datetime}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        {/* Status */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Status *</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
            style={inputStyle}
          >
            <option value="scheduled">Agendada</option>
            <option value="completed">Concluída</option>
            <option value="canceled">Cancelada</option>
          </select>
        </div>

        {/* Observações */}
        <div style={fieldStyle}>
          <label style={labelStyle}>Observações</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            style={inputStyle}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{
            marginTop: "1rem",
            padding: "0.75rem 1.5rem",
            background: isEditing ? "#0d6efd" : "#198754",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: isLoading ? "not-allowed" : "pointer",
            width: "100%",
          }}
        >
          {isLoading
            ? "Salvando..."
            : isEditing
            ? "Salvar alterações"
            : "Criar agendamento"}
        </button>
      </form>
    </main>
  );
}

const fieldStyle = { marginBottom: "1rem" };
const labelStyle = { display: "block", marginBottom: "0.25rem" };
const inputStyle = {
  width: "100%",
  padding: "0.5rem",
  boxSizing: "border-box",
};

export default AppointmentFormPage;