// src/pages/PatientFormPage.jsx
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiGet, apiPost, apiPatch } from "../services/api";

function PatientFormPage() {
  const { id } = useParams(); // undefined se for criação, número se for edição
  const isEditing = Boolean(id);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    cpf: "",
    date_of_birth: "",
    gender: "",
    address: "",
    notes: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(isEditing);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Se for edição, carrega os dados do paciente
  useEffect(() => {
    if (!isEditing) return;

    async function loadPatient() {
      const token = localStorage.getItem("accessToken");
      try {
        const data = await apiGet(`/patients/${id}/`, token);
        setFormData({
          full_name: data.full_name || "",
          email: data.email || "",
          phone_number: data.phone_number || "",
          cpf: data.cpf || "",
          date_of_birth: data.date_of_birth || "",
          gender: data.gender || "",
          address: data.address || "",
          notes: data.notes || "",
        });
      } catch (error) {
        console.error(error);
        setErrorMessage("Erro ao carregar dados do paciente.");
      } finally {
        setIsFetching(false);
      }
    }

    loadPatient();
  }, [id, isEditing]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    const token = localStorage.getItem("accessToken");

    try {
      if (isEditing) {
        await apiPatch(`/patients/${id}/`, formData, token);
        setSuccessMessage("Paciente atualizado com sucesso!");
      } else {
        await apiPost("/patients/", formData, token);
        setSuccessMessage("Paciente cadastrado com sucesso!");
      }

      // Aguarda 1 segundo para o usuário ler a mensagem e redireciona
      setTimeout(() => navigate("/patients"), 1000);
    } catch (error) {
      console.error(error);
      setErrorMessage(
        isEditing
          ? "Erro ao atualizar paciente. Verifique os dados e tente novamente."
          : "Erro ao cadastrar paciente. Verifique os dados e tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  }

  if (isFetching) {
    return <p style={{ padding: "2rem" }}>Carregando dados do paciente...</p>;
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
        <h1>{isEditing ? "Editar Paciente" : "Novo Paciente"}</h1>
        <button
          onClick={() => navigate("/patients")}
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
        <div style={fieldStyle}>
          <label style={labelStyle}>Nome completo *</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Email *</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Telefone</label>
          <input
            type="text"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>CPF</label>
          <input
            type="text"
            name="cpf"
            value={formData.cpf}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Data de nascimento</label>
          <input
            type="date"
            name="date_of_birth"
            value={formData.date_of_birth}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Gênero</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="">Selecione...</option>
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
            <option value="O">Outro</option>
          </select>
        </div>

        <div style={fieldStyle}>
          <label style={labelStyle}>Endereço</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            style={inputStyle}
          />
        </div>

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
            : "Cadastrar paciente"}
        </button>
      </form>
    </main>
  );
}

// Estilos inline reutilizáveis para o formulário
const fieldStyle = { marginBottom: "1rem" };
const labelStyle = { display: "block", marginBottom: "0.25rem" };
const inputStyle = { width: "100%", padding: "0.5rem", boxSizing: "border-box" };

export default PatientFormPage;