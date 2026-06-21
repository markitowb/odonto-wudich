import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import TodayIcon from "@mui/icons-material/Today";
import dayjs from "dayjs";

import {
  getWeekDays,
  getHourSlots,
  formatHour,
  formatWeekRange,
  getAppointmentsForSlot,
  isSameDay,
  formatAppointmentTime,
} from "../../utils/calendarHelpers";

const TIME_COL_WIDTH = 64;
const HOURS = getHourSlots(8, 18);

function abreviarNome(nomeCompleto) {
  if (!nomeCompleto) return "";
  const partes = nomeCompleto.trim().split(/\s+/);
  if (partes.length === 1) return partes[0];
  const primeiro = partes[0];
  const resto = partes
    .slice(1)
    .map((p) => `${p[0].toUpperCase()}.`)
    .join(" ");
  return `${primeiro} ${resto}`;
}

export default function WeekGrid({
  weekStart,
  selectedDate,
  appointments,
  onChangeWeek,
  onSlotClick,
  onAppointmentClick,
}) {
  const weekDays = getWeekDays(weekStart);

  function handleToday() {
    onChangeWeek(dayjs());
  }

  function handlePrevWeek() {
    onChangeWeek(selectedDate.subtract(1, "week"));
  }

  function handleNextWeek() {
    onChangeWeek(selectedDate.add(1, "week"));
  }

  return (
    <Box sx={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>

      {/* Controles: Hoje / setas / período */}
      <Box sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<TodayIcon />}
          onClick={handleToday}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          Hoje
        </Button>
        <IconButton size="small" onClick={handlePrevWeek}>
          <ChevronLeftIcon fontSize="small" />
        </IconButton>
        <IconButton size="small" onClick={handleNextWeek}>
          <ChevronRightIcon fontSize="small" />
        </IconButton>
        <Typography variant="subtitle1" sx={{ ml: 0.5, fontWeight: 500 }}>
          {formatWeekRange(weekStart)}
        </Typography>
      </Box>

      {/* Grade completa */}
      <Box
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 1,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Linha do cabeçalho dos dias */}
        <Box
          sx={{
            display: "flex",
            borderBottom: "1px solid",
            borderColor: "divider",
            backgroundColor: "grey.50",
          }}
        >
          {/* Célula vazia — coluna de horários */}
          <Box
            sx={{
              width: TIME_COL_WIDTH,
              flexShrink: 0,
              borderRight: "1px solid",
              borderColor: "divider",
              padding: 0,              // força zero
            }}
          />

          {/* 7 colunas de dias */}
          {weekDays.map((day, index) => {
            const isToday = day.isSame(dayjs(), "day");
            const isSelected = isSameDay(day, selectedDate);

            return (
              <Box
                key={day.toString()}
                sx={{
                  flex: 1,
                  padding: 0,          // força zero — igual à célula da grade
                  borderRight: index < weekDays.length - 1 ? "1px solid" : "none",
                  borderColor: "divider",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  minHeight: 48,
                }}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", fontSize: "0.7rem", lineHeight: 1.2 }}
                >
                  {day.format("ddd").toUpperCase()}
                </Typography>
                <Box
                  sx={{
                    mt: 0.3,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isSelected
                      ? "primary.main"
                      : isToday
                      ? "primary.100"
                      : "transparent",
                    color: isSelected ? "white" : "text.primary",
                    fontWeight: isToday || isSelected ? 700 : 400,
                    fontSize: "0.82rem",
                  }}
                >
                  {day.format("D")}
                </Box>
              </Box>
            );
          })}
        </Box>

        {/* Linhas de horário */}
        {HOURS.map((hour, rowIndex) => (
          <Box
            key={hour}
            sx={{
              display: "flex",
              height: 36,
              borderBottom: rowIndex < HOURS.length - 1 ? "1px solid" : "none",
              borderColor: "divider",
            }}
          >
            {/* Coluna de horário */}
            <Box
              sx={{
                width: TIME_COL_WIDTH,
                flexShrink: 0,
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "flex-end",
                paddingRight: "8px",
                paddingTop: "3px",
                padding: 0,            // reseta tudo
                paddingRight: "8px",   // só padding-right para o texto ficar à direita
                paddingTop: "3px",
                borderRight: "1px solid",
                borderColor: "divider",
                backgroundColor: "grey.50",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ fontSize: "0.68rem" }}
              >
                {formatHour(hour)}
              </Typography>
            </Box>

            {/* 7 colunas de dias */}
            {weekDays.map((day, colIndex) => {
              const slotAppts = getAppointmentsForSlot(appointments, day, hour);
              const appt = slotAppts[0] ?? null;

              return (
                <Box
                  key={`${day.toString()}-${hour}`}
                  onClick={() => {
                    if (appt) {
                      onAppointmentClick?.(appt);
                    } else {
                      onSlotClick?.({ date: day, hour });
                    }
                  }}
                  sx={{
                    flex: 1,
                    padding: 0,        // força zero — igual ao cabeçalho
                    borderRight: colIndex < weekDays.length - 1 ? "1px solid" : "none",
                    borderColor: "divider",
                    cursor: "pointer",
                    overflow: "hidden",
                    "&:hover": {
                      backgroundColor: appt ? "primary.50" : "action.hover",
                    },
                  }}
                >
                  {appt && (
                    <Box
                      sx={{
                        height: "100%",
                        backgroundColor: "primary.main",
                        color: "white",
                        borderRadius: "4px",
                        px: 0.5,
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <Typography
                        sx={{
                          fontSize: "0.68rem",
                          fontWeight: 700,
                          lineHeight: 1.2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {abreviarNome(appt.patient)}
                      </Typography>
                      <Typography
                        sx={{
                          fontSize: "0.62rem",
                          lineHeight: 1.2,
                          opacity: 0.9,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {formatAppointmentTime(appt.start_datetime, appt.end_datetime)}
                      </Typography>
                    </Box>
                  )}
                </Box>
              );
            })}
          </Box>
        ))}
      </Box>
    </Box>
  );
}