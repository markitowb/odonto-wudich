import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import PersonAddIcon from "@mui/icons-material/PersonAdd";

import { apiGet, apiPost, apiPatch } from "../services/api";
import CpfField from "../components/CpfField";
import PhoneField from "../components/PhoneField";

const GENDER_OPTIONS = [
  { value: "M", label: "Masculino" },
  { value: "F", label: "Feminino" },
  { value: "O", label: "Outro" },
];

export default function PatientFormPage() {
  const { id } = useParams();
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

  useEffect(() => {
    if (!isEditing) return;

    async function loadPatient() {
      try {
        const data = await apiGet(`/patients/${id}/`);
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

    try {
      if (isEditing) {
        await apiPatch(`/patients/${id}/`, formData);
        setSuccessMessage("Paciente atualizado com sucesso!");
      } else {
        await apiPost("/patients/", formData);
        setSuccessMessage("Paciente cadastrado com sucesso!");
      }
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
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      {/* Cabeçalho */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 640,
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h4">
          {isEditing ? "Editar Paciente" : "Novo Paciente"}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/patients")}
        >
          Voltar
        </Button>
      </Box>

      {/* Alertas */}
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2, width: "100%", maxWidth: 640 }}>
          {errorMessage}
        </Alert>
      )}
      {successMessage && (
        <Alert severity="success" sx={{ mb: 2, width: "100%", maxWidth: 640 }}>
          {successMessage}
        </Alert>
      )}

      {/* Formulário */}
      <Card sx={{ width: "100%", maxWidth: 640 }}>
        <CardContent sx={{ p: 3 }}>
          <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
            <Box component="form" onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Nome completo"
                  name="full_name"
                  value={formData.full_name}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  fullWidth
                />

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <PhoneField
                    value={formData.phone_number}
                    onChange={(digits) =>
                      setFormData((prev) => ({ ...prev, phone_number: digits }))
                    }
                    fullWidth
                  />

                  <CpfField
                    value={formData.cpf}
                    onChange={(digits) =>
                      setFormData((prev) => ({ ...prev, cpf: digits }))
                    }
                    fullWidth
                  />
                </Stack>

                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <DatePicker
                    label="Data de nascimento"
                    value={
                      formData.date_of_birth
                        ? dayjs(formData.date_of_birth)
                        : null
                    }
                    onChange={(newValue) => {
                      setFormData((prev) => ({
                        ...prev,
                        // Salva como "YYYY-MM-DD" que o backend Django espera
                        date_of_birth: newValue
                          ? newValue.format("YYYY-MM-DD")
                          : "",
                      }));
                    }}
                    format="DD/MM/YYYY" // Exibe no formato brasileiro
                    slotProps={{
                      textField: {
                        fullWidth: true,
                      },
                    }}
                  />

                  <TextField
                    label="Gênero"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    select
                    fullWidth
                  >
                    <MenuItem value="">Selecione...</MenuItem>
                    {GENDER_OPTIONS.map((opt) => (
                      <MenuItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Stack>

                <TextField
                  label="Endereço"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  fullWidth
                />

                <TextField
                  label="Observações"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                />

                <Button
                  type="submit"
                  variant="contained"
                  color={isEditing ? "primary" : "success"}
                  size="large"
                  disabled={isLoading}
                  startIcon={
                    isLoading ? (
                      <CircularProgress size={18} color="inherit" />
                    ) : isEditing ? (
                      <SaveIcon />
                    ) : (
                      <PersonAddIcon />
                    )
                  }
                  fullWidth
                >
                  {isLoading
                    ? "Salvando..."
                    : isEditing
                    ? "Salvar alterações"
                    : "Cadastrar paciente"}
                </Button>
              </Stack>
            </Box>
          </LocalizationProvider>
        </CardContent>
      </Card>
    </Box>
  );
}