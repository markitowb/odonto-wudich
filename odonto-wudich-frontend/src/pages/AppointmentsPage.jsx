import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";

import dayjs from "dayjs";

import { apiGet } from "../services/api";
import MiniCalendar from "../components/calendar/MiniCalendar";
import WeekGrid from "../components/calendar/WeekGrid";
import AppointmentModal from "../components/calendar/AppointmentModal";
import { getWeekStart } from "../utils/calendarHelpers";

export default function AppointmentsPage() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [weekStart, setWeekStart] = useState(getWeekStart(dayjs()));
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  async function fetchAppointments() {
    setLoading(true);
    setError("");

    try {
      const data = await apiGet("/appointments/");
      setAppointments(data);
    } catch (err) {
      console.error(err);
      if (err.status === 401) {
        navigate("/login", { replace: true });
      } else {
        setError("Erro ao carregar agendamentos. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchAppointments();
  }, []);

  function handleDateChange(newDate) {
    setSelectedDate(newDate);
    setWeekStart(getWeekStart(newDate));
  }

  function handleWeekChange(newDate) {
    setSelectedDate(newDate);
    setWeekStart(getWeekStart(newDate));
  }

  function handleSlotClick({ date, hour }) {
    const dateParam = date.hour(hour).minute(0).format("YYYY-MM-DD");
    const timeParam = date.hour(hour).minute(0).format("HH:mm");
    navigate(`/appointments/new?date=${dateParam}&time=${timeParam}`);
  }

  return (
    <Box>
      {/* Título centralizado */}
      <Box sx={{ mb: 3, textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          Agenda semanal
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Visualização semanal dos agendamentos da clínica.
        </Typography>
      </Box>

      {/* Erro */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Loading ou conteúdo */}
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        /*
          Layout de duas colunas usando apenas Box + flexbox.
          Sem Grid do MUI para evitar as variáveis CSS
          --Grid-columnSpacing que causam desalinhamento.
        */
        <Box
          sx={{
            display: "flex",
            gap: 3,
            alignItems: "flex-start",
          }}
        >
          {/* Coluna esquerda: mini calendário */}
          <Box sx={{ flexShrink: 0 }}>
            <MiniCalendar
              selectedDate={selectedDate}
              onChange={handleDateChange}
            />
          </Box>

          {/* Coluna direita: grade semanal */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <WeekGrid
              weekStart={weekStart}
              selectedDate={selectedDate}
              appointments={appointments}
              onChangeWeek={handleWeekChange}
              onSlotClick={handleSlotClick}
              onAppointmentClick={(appointment) =>
                setSelectedAppointment(appointment)
              }
            />
          </Box>
        </Box>
      )}

      {/* Modal de detalhes do agendamento */}
      <AppointmentModal
        open={Boolean(selectedAppointment)}
        appointment={selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
      />
    </Box>
  );
}