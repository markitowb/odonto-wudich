import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

/**
 * Mini calendário mensal exibido na sidebar esquerda da agenda.
 *
 * Props:
 *  - selectedDate: dayjs — dia atualmente selecionado
 *  - onChange: (dayjs) => void — chamado ao clicar em um dia
 */
export default function MiniCalendar({ selectedDate, onChange }) {
  const navigate = useNavigate();

  function handleNewAppointment() {
    // Abre o formulário de novo agendamento com a data selecionada
    const dateParam = selectedDate.format("YYYY-MM-DD");
    navigate(`/appointments/new?date=${dateParam}`);
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {/* Calendário mensal compacto */}
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
        <DateCalendar
          value={selectedDate}
          onChange={(newDate) => onChange(newDate)}
          showDaysOutsideCurrentMonth
          sx={{
            width: "100%",
            maxWidth: 240,
            "& .MuiDayCalendar-weekDayLabel": {
              fontSize: "0.7rem",
            },
            "& .MuiPickersDay-root": {
              fontSize: "0.75rem",
              width: 30,
              height: 30,
              margin: 0.2,
            },

            "& .MuiPickersCalendarHeader-root": {
              paddingLeft: 1,
              paddingRight: 1,
              "& .MuiTypography-root": {
                fontSize: "0.85rem",
              },
            },
            // Destaque do dia selecionado com cor primária
            "& .Mui-selected": {
              backgroundColor: "primary.main",
              color: "white",
              "&:hover": {
                backgroundColor: "primary.dark",
              },
            },
            // Dia de hoje com borda sutil quando não selecionado
            "& .MuiPickersDay-today:not(.Mui-selected)": {
              borderColor: "primary.main",
            },
          }}
        />
      </LocalizationProvider>

      {/* Botão de novo agendamento abaixo do calendário */}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleNewAppointment}
        fullWidth
        sx={{
          maxWidth: 240,
          mt: 1,
          borderRadius: 8,
          textTransform: "none",
          fontWeight: 600,
          boxShadow: 2,
          fontSize: "0.85rem",
          py: 0.75,
        }}
      >
        Novo agendamento
      </Button>
    </Box>
  );
}