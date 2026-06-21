import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import isoWeek from "dayjs/plugin/isoWeek";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

// Plugins necessários para semana ISO (segunda = dia 1)
dayjs.extend(isoWeek);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

// Locale padrão para português do Brasil
dayjs.locale("pt-br");

/**
 * Retorna a segunda-feira da semana ISO de uma data.
 * Semana ISO: segunda = 1, domingo = 7.
 *
 * @param {dayjs.Dayjs} date
 * @returns {dayjs.Dayjs}
 */
export function getWeekStart(date) {
  return date.isoWeekday(1).startOf("day");
}

/**
 * Retorna um array com os 7 dias da semana (seg → dom)
 * a partir de uma segunda-feira.
 *
 * @param {dayjs.Dayjs} weekStart - Segunda-feira da semana
 * @returns {dayjs.Dayjs[]}
 */
export function getWeekDays(weekStart) {
  return Array.from({ length: 7 }, (_, i) => weekStart.add(i, "day"));
}

/**
 * Retorna array de horas inteiras entre start e end (inclusive).
 * Ex.: getHourSlots(8, 18) → [8, 9, 10, ..., 18]
 *
 * @param {number} startHour
 * @param {number} endHour
 * @returns {number[]}
 */
export function getHourSlots(startHour = 8, endHour = 18) {
  return Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i
  );
}

/**
 * Formata hora inteira como string "HH:00".
 * Ex.: formatHour(8) → "08:00"
 *
 * @param {number} hour
 * @returns {string}
 */
export function formatHour(hour) {
  return `${String(hour).padStart(2, "0")}:00`;
}

/**
 * Filtra agendamentos que pertencem a um dia e hora específicos.
 * Usa start_datetime do agendamento (horário local).
 *
 * @param {Array} appointments - Lista de agendamentos da API
 * @param {dayjs.Dayjs} day    - Dia da coluna
 * @param {number} hour        - Hora da linha (ex.: 10)
 * @returns {Array}
 */
export function getAppointmentsForSlot(appointments, day, hour) {
  return appointments.filter((appt) => {
    const start = dayjs(appt.start_datetime);
    return (
      start.isSame(day, "day") &&
      start.hour() === hour
    );
  });
}

/**
 * Formata intervalo da semana para exibição no cabeçalho.
 * Ex.: "26 de Mai – 1 de Jun de 2026"
 *
 * @param {dayjs.Dayjs} weekStart
 * @returns {string}
 */
export function formatWeekRange(weekStart) {
  const weekEnd = weekStart.add(6, "day");
  const startFormatted = weekStart.format("D [de] MMM");
  const endFormatted = weekEnd.format("D [de] MMM [de] YYYY");
  return `${startFormatted} – ${endFormatted}`;
}

/**
 * Verifica se dois objetos dayjs representam o mesmo dia.
 *
 * @param {dayjs.Dayjs} a
 * @param {dayjs.Dayjs} b
 * @returns {boolean}
 */
export function isSameDay(a, b) {
  return a.isSame(b, "day");
}

/**
 * Formata start e end de um agendamento para exibição.
 * Ex.: "10:00 – 10:30"
 *
 * @param {string} startDatetime
 * @param {string} endDatetime
 * @returns {string}
 */
export function formatAppointmentTime(startDatetime, endDatetime) {
  const start = dayjs(startDatetime).format("HH:mm");
  const end = dayjs(endDatetime).format("HH:mm");
  return `${start} – ${end}`;
}