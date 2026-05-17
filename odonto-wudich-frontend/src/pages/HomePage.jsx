import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiGet } from "../services/api";

function HomePage() {
  const [patients, setPatients] = useState([]);
  const [statusMessage, setStatusMessage] = useState(
    "Tentando conectar à API..."
  );
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    async function loadPatients() {
      setIsLoading(true);
      setStatusMessage("Carregando pacientes...");

      const token = localStorage.getItem("accessToken");

      if (!token) {
        setStatusMessage("Nenhum token encontrado. Faça login novamente.");
        setIsLoading(false);
        return;
      }

      try {
        const data = await apiGet("/patients/", token);
        setPatients(data);
        setStatusMessage("Pacientes carregados com sucesso.");
      } catch (error) {
        console.error(error);
        if (error.status === 401) {
          setStatusMessage(
            "Token inválido ou expirado. Faça login novamente."
          );
        } else {
          setStatusMessage(
            "Erro ao comunicar com a API. Verifique se o backend está rodando."
          );
        }
      } finally {
        setIsLoading(false);
      }
    }

    loadPatients();
  }, []);

  function handleLogoutClick() {
    if (window.confirm("Deseja realmente sair?")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Redireciona para /login após limpar os tokens
      navigate("/login", { replace: true });
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
        <h1>Odonto Wudich</h1>
        <button
          onClick={handleLogoutClick}
          style={{
            background: "#d9534f",
            color: "#fff",
            border: "none",
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Sair
        </button>
      </header>

      <p>Dashboard inicial da clínica odontológica.</p>

      <section style={{ marginTop: "2rem" }}>
        <h2>Status da integração com a API</h2>
        <p>{statusMessage}</p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <h2>Pacientes</h2>

        {isLoading && <p>Carregando...</p>}

        {!isLoading && patients.length === 0 && (
          <p>Nenhum paciente encontrado.</p>
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
                <th
                  style={{
                    borderBottom: "1px solid #444",
                    textAlign: "left",
                    padding: "0.5rem",
                  }}
                >
                  Nome
                </th>
                <th
                  style={{
                    borderBottom: "1px solid #444",
                    textAlign: "left",
                    padding: "0.5rem",
                  }}
                >
                  Email
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <tr key={patient.id}>
                  <td
                    style={{
                      borderBottom: "1px solid #333",
                      padding: "0.5rem",
                    }}
                  >
                    {patient.full_name}
                  </td>
                  <td
                    style={{
                      borderBottom: "1px solid #333",
                      padding: "0.5rem",
                    }}
                  >
                    {patient.email}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}

export default HomePage;