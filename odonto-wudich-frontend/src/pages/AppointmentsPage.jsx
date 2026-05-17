import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiDelete } from "../services/api";

function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    setIsLoading(true);
    setErrorMessage("");


    try {
      const data = await apiGet("/appointments/");
      setAppointments(data);
    } catch (error) {
      console.error(error);
      if (error.status === 401) {
        navigate("/login", { replace: true });
      } else {
        setErrorMessage("Erro ao carregar agendamentos. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(appointmentId) {
    if (!window.confirm("Deseja excluir este agendamento?")) return;


    try {
      await apiDelete(`/appointments/${appointmentId}/`);
      await loadAppointments();
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao excluir agendamento. Tente novamente.");
    }
  }

  function formatDateTime(isoString) {
    if (!isoString) return "-";

    // Não deixar o JavaScript ajustar automaticamente o fuso.
    // Vamos tratar a string "yyyy-MM-ddTHH:mm:ssZ" como se já estivesse no horário local.
    const [datePart, timePartWithZone] = isoString.split("T");
    const [year, month, day] = datePart.split("-");
    const timePart = timePartWithZone.slice(0, 5); // "HH:mm"

    return `${day}/${month}/${year} ${timePart}`;
  }

  // Traduz o status para português
  function translateStatus(status) {
    const map = {
      scheduled: "Agendada",
      completed: "Concluída",
      canceled: "Cancelada",
    };
    return map[status] || status;
  }

  return (
    <main style={{ padding: "2rem" }}>
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
        }}
      >
        <h1>Agendamentos</h1>
        <div style={{ display: "flex", gap: "1rem" }}>
          <button
            onClick={() => navigate("/home")}
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
          <button
            onClick={() => navigate("/appointments/new")}
            style={{
              padding: "0.5rem 1rem",
              background: "#198754",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            + Novo Agendamento
          </button>
        </div>
      </header>

      {isLoading && <p>Carregando agendamentos...</p>}

      {errorMessage && (
        <p style={{ color: "red" }}>{errorMessage}</p>
      )}

      {!isLoading && appointments.length === 0 && (
        <p>Nenhum agendamento cadastrado.</p>
      )}

      {!isLoading && appointments.length > 0 && (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={thStyle}>Paciente</th>
              <th style={thStyle}>Dentista</th>
              <th style={thStyle}>Início</th>
              <th style={thStyle}>Fim</th>
              <th style={thStyle}>Status</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appointment) => (
              <tr key={appointment.id}>
                <td style={tdStyle}>{appointment.patient}</td>
                <td style={tdStyle}>{appointment.dentist}</td>
                <td style={tdStyle}>
                  {formatDateTime(appointment.start_datetime)}
                </td>
                <td style={tdStyle}>
                  {formatDateTime(appointment.end_datetime)}
                </td>
                <td style={tdStyle}>
                  {translateStatus(appointment.status)}
                </td>
                <td style={tdStyle}>
                  <button
                    onClick={() =>
                      navigate(`/appointments/${appointment.id}/edit`)
                    }
                    style={{
                      marginRight: "0.5rem",
                      padding: "0.25rem 0.75rem",
                      background: "#0d6efd",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(appointment.id)}
                    style={{
                      padding: "0.25rem 0.75rem",
                      background: "#d9534f",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}

const thStyle = {
  borderBottom: "2px solid #444",
  textAlign: "left",
  padding: "0.75rem 0.5rem",
};

const tdStyle = {
  borderBottom: "1px solid #333",
  padding: "0.75rem 0.5rem",
};

export default AppointmentsPage;