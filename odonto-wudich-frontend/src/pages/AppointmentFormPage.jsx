import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";

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
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

import { apiGet, apiPost, apiPatch } from "../services/api";

const STATUS_OPTIONS = [
  { value: "scheduled", label: "Agendada" },
  { value: "completed", label: "Concluída" },
  { value: "canceled", label: "Cancelada" },
];

export default function AppointmentFormPage() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const dateParam = searchParams.get("date"); // ex: "2026-06-03"
  const timeParam = searchParams.get("time"); // ex: "15:00"

  // Valor inicial do DateTimePicker de início:
  // - Se vier da URL (?date=...&time=...), usa esses valores
  // - Senão, usa hoje às 08:00
  const initialStartDateTime =
    dateParam && timeParam
      ? dayjs(`${dateParam}T${timeParam}`)
      : dayjs().hour(8).minute(0).second(0).millisecond(0);

  // Estado do DateTimePicker de início
  const [startDateTime, setStartDateTime] = useState(initialStartDateTime);

  // Estado do DateTimePicker de fim
  const [endDateTime, setEndDateTime] = useState(null);

  // Demais campos do formulário
  const [formData, setFormData] = useState({
    patient_id: "",
    dentist_id: "",
    status: "scheduled",
    notes: "",
  });

  const [patients, setPatients] = useState([]);
  const [dentists, setDentists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [patientsData, dentistsData] = await Promise.all([
          apiGet("/patients/"),
          apiGet("/users/dentists/"),
        ]);

        setPatients(patientsData);
        setDentists(dentistsData);

        // Se for edição, carrega os dados do agendamento existente
        if (isEditing) {
          const appointmentData = await apiGet(`/appointments/${id}/`);

          setFormData({
            patient_id: appointmentData.patient_id ?? "",
            dentist_id: appointmentData.dentist_id ?? "",
            status: appointmentData.status,
            notes: appointmentData.notes || "",
          });

          // Preenche os DateTimePickers com os valores do agendamento
          if (appointmentData.start_datetime) {
            setStartDateTime(dayjs(appointmentData.start_datetime));
          }
          if (appointmentData.end_datetime) {
            setEndDateTime(dayjs(appointmentData.end_datetime));
          }
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

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");
    setIsLoading(true);

    // payload montado aqui dentro do handleSubmit,
    // depois que todos os estados já existem e têm valor
    const payload = {
      patient_id: formData.patient_id,
      dentist_id: formData.dentist_id,
      // Converte os objetos dayjs para string ISO com fuso horário
      start_datetime: startDateTime
        ? startDateTime.format("YYYY-MM-DDTHH:mm:ssZ")
        : "",
      end_datetime: endDateTime
        ? endDateTime.format("YYYY-MM-DDTHH:mm:ssZ")
        : "",
      status: formData.status,
      notes: formData.notes,
    };

    try {
      if (isEditing) {
        await apiPatch(`/appointments/${id}/`, payload);
        setSuccessMessage("Agendamento atualizado com sucesso!");
      } else {
        await apiPost("/appointments/", payload);
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
          {isEditing ? "Editar Agendamento" : "Novo Agendamento"}
        </Typography>

        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/appointments")}
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
                {/* Paciente */}
                <TextField
                  label="Paciente"
                  name="patient_id"
                  value={formData.patient_id}
                  onChange={handleChange}
                  required
                  select
                  fullWidth
                >
                  <MenuItem value="">Selecione o paciente...</MenuItem>
                  {patients.map((patient) => (
                    <MenuItem key={patient.id} value={patient.id}>
                      {patient.full_name}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Dentista */}
                <TextField
                  label="Dentista"
                  name="dentist_id"
                  value={formData.dentist_id}
                  onChange={handleChange}
                  required
                  select
                  fullWidth
                >
                  <MenuItem value="">Selecione o dentista...</MenuItem>
                  {dentists.map((dentist) => (
                    <MenuItem key={dentist.id} value={dentist.id}>
                      {dentist.username}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Data/hora de início e fim */}
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                  <DateTimePicker
                    label="Início"
                    value={startDateTime}
                    onChange={(newValue) => setStartDateTime(newValue)}
                    format="DD/MM/YYYY HH:mm"
                    ampm={false}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                      },
                    }}
                  />

                  <DateTimePicker
                    label="Fim"
                    value={endDateTime}
                    onChange={(newValue) => setEndDateTime(newValue)}
                    format="DD/MM/YYYY HH:mm"
                    ampm={false}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        required: true,
                      },
                    }}
                  />
                </Stack>

                {/* Status */}
                <TextField
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  required
                  select
                  fullWidth
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>

                {/* Observações */}
                <TextField
                  label="Observações"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  fullWidth
                />

                {/* Botão de envio */}
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
                      <CalendarMonthIcon />
                    )
                  }
                  fullWidth
                >
                  {isLoading
                    ? "Salvando..."
                    : isEditing
                    ? "Salvar alterações"
                    : "Criar agendamento"}
                </Button>
              </Stack>
            </Box>
          </LocalizationProvider>
        </CardContent>
      </Card>
    </Box>
  );
}