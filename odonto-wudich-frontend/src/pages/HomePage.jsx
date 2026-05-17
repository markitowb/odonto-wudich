import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  function handleLogoutClick() {
    if (window.confirm("Deseja realmente sair?")) {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
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
        <h2>Menu</h2>
        <nav style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            onClick={() => navigate("/patients")}
            style={menuButtonStyle}
          >
            Pacientes
          </button>
          <button
            onClick={() => navigate("/appointments")}
            style={menuButtonStyle}
          >
            Agendamentos
          </button>
        </nav>
      </section>
    </main>
  );
}

const menuButtonStyle = {
  padding: "0.75rem 1.5rem",
  background: "#0d6efd",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default HomePage;