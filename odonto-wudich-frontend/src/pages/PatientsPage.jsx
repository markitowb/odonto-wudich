import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet, apiDelete } from "../services/api";

function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  // Carrega a lista de pacientes ao montar o componente
  useEffect(() => {
    loadPatients();
  }, []);

  async function loadPatients() {
    setIsLoading(true);
    setErrorMessage("");


    try {
      const data = await apiGet("/patients/");
      setPatients(data);
    } catch (error) {
      console.error(error);
      if (error.status === 401) {
        navigate("/login", { replace: true });
      } else {
        setErrorMessage("Erro ao carregar pacientes. Tente novamente.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(patientId, patientName) {
    if (!window.confirm(`Deseja excluir o paciente "${patientName}"?`)) {
      return;
    }

    const token = localStorage.getItem("accessToken");

    try {
      await apiDelete(`/patients/${patientId}/`);
      // Recarrega a lista após excluir
      await loadPatients();
    } catch (error) {
      console.error(error);
      setErrorMessage("Erro ao excluir paciente. Tente novamente.");
    }
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
        <h1>Pacientes</h1>
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
            onClick={() => navigate("/patients/new")}
            style={{
              padding: "0.5rem 1rem",
              background: "#198754",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            + Novo Paciente
          </button>
        </div>
      </header>

      {isLoading && <p>Carregando pacientes...</p>}

      {errorMessage && (
        <p style={{ color: "red" }}>{errorMessage}</p>
      )}

      {!isLoading && patients.length === 0 && (
        <p>Nenhum paciente cadastrado.</p>
      )}

      {!isLoading && patients.length > 0 && (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Nome</th>
              <th style={thStyle}>Email</th>
              <th style={thStyle}>Telefone</th>
              <th style={thStyle}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((patient) => (
              <tr key={patient.id}>
                <td style={tdStyle}>{patient.full_name}</td>
                <td style={tdStyle}>{patient.email}</td>
                <td style={tdStyle}>{patient.phone_number}</td>
                <td style={tdStyle}>
                  <button
                    onClick={() => navigate(`/patients/${patient.id}/edit`)}
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
                    onClick={() =>
                      handleDelete(patient.id, patient.full_name)
                    }
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

// Estilos inline reutilizáveis para a tabela
const thStyle = {
  borderBottom: "2px solid #444",
  textAlign: "left",
  padding: "0.75rem 0.5rem",
};

const tdStyle = {
  borderBottom: "1px solid #333",
  padding: "0.75rem 0.5rem",
};

export default PatientsPage;