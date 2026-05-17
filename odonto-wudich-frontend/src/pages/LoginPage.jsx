import { useState } from "react";
import { usersPost } from "../services/api";

function LoginPage({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      // Ajuste aqui conforme o payload do seu /api/token/ (username ou email)
      const data = await usersPost("/token/", {
        username,          // se o backend espera "username", troque aqui
        password,
      });

      // data deve conter: { access: "...", refresh: "..." }
      const { access, refresh } = data;

      // Armazenar o token (simples, mas suficiente para nosso início)
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      if (onLoginSuccess) {
        onLoginSuccess();
      }
    } catch (error) {
      console.error(error);
      if (error.status === 401 || error.status === 400) {
        setErrorMessage("Credenciais inválidas. Verifique usuário/senha.");
      } else {
        setErrorMessage("Erro ao fazer login. Tente novamente mais tarde.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main style={{ padding: "2rem", maxWidth: "400px", margin: "0 auto" }}>
      <h1>Login - Odonto Wudich</h1>

      <form onSubmit={handleSubmit} style={{ marginTop: "1.5rem" }}>
        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Usuário ou Email
          </label>
          <input
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        <div style={{ marginBottom: "1rem" }}>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Senha
          </label>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </div>

        {errorMessage && (
          <p style={{ color: "red", marginBottom: "1rem" }}>{errorMessage}</p>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "0.5rem 1rem",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  );
}

export default LoginPage;