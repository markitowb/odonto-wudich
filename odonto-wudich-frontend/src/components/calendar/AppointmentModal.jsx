import { useEffect, useState } from "react";
import dayjs from "dayjs";

import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";

import { useNavigate } from "react-router-dom";
import { apiGet, apiPatch } from "../../services/api";
import { formatAppointmentTime } from "../../utils/calendarHelpers";

const STATUS_LABEL = {
  scheduled: { label: "Agendada", color: "primary" },
  completed: { label: "Concluída", color: "success" },
  canceled: { label: "Cancelada", color: "error" },
};

/**
 * Modal de detalhes do agendamento / paciente.
 *
 * Props:
 *  - open: boolean
 *  - appointment: objeto do /appointments/ (ou null)
 *  - onClose: () => void
 */
export default function AppointmentModal({ open, appointment, onClose }) {
  const navigate = useNavigate();

  const [patient, setPatient] = useState(null);
  const [loadingPatient, setLoadingPatient] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [error, setError] = useState("");

  // Carregar dados completos do paciente quando abrir o modal
  useEffect(() => {
    if (!open || !appointment) {
      setPatient(null);
      setNewNote("");
      setError("");
      return;
    }

    async function fetchPatient() {
      setLoadingPatient(true);
      setError("");

      try {
        const data = await apiGet(`/patients/${appointment.patient_detail_id}/`);
        setPatient(data);
      } catch (err) {
        console.error(err);
        setError("Erro ao carregar dados do paciente.");
      } finally {
        setLoadingPatient(false);
      }
    }

    fetchPatient();
  }, [open, appointment]);

  if (!appointment) {
    return null;
  }

  const statusInfo =
    STATUS_LABEL[appointment.status] || {
      label: appointment.status,
      color: "default",
    };

  const timeRange = formatAppointmentTime(
    appointment.start_datetime,
    appointment.end_datetime,
  );

  const appointmentDate = dayjs(appointment.start_datetime).format(
    "DD/MM/YYYY",
  );

  async function handleSaveNote() {
    if (!newNote.trim() || !patient) return;

    setSaving(true);
    setError("");

    try {
      const now = dayjs();
      const header = now.format("[Consulta em] DD/MM/YYYY [às] HH:mm");
      const newLine = `${header}\n${newNote.trim()}`;

      const existingNotes = patient.notes || "";
      const updatedNotes = existingNotes
        ? `${existingNotes}\n\n${newLine}`
        : newLine;

      await apiPatch(`/patients/${patient.id}/`, {
        notes: updatedNotes,
      });

      setPatient((prev) => ({ ...prev, notes: updatedNotes }));
      setNewNote("");
    } catch (err) {
      console.error(err);
      setError("Erro ao salvar observação. Tente novamente.");
    } finally {
      setSaving(false);
    }
  }

  function handleOpenPatient() {
    if (!patient) return;
    navigate(`/patients/${patient.id}/edit`);
    onClose?.();
  }

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Detalhes da consulta</DialogTitle>

      <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        {/* Cabeçalho: paciente + status + data/hora */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Stack 
            direction="row" 
            spacing={2} 
            sx={{ alignItems: "center" }}
          >
            <Typography variant="h6">{appointment.patient}</Typography>
            <Chip label={statusInfo.label} color={statusInfo.color} size="small" />
          </Stack>

          <Typography variant="body2" color="text.secondary">
            {appointmentDate} — {timeRange}
          </Typography>
        </Box>

        {/* Erro */}
        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}

        {/* Dados do paciente */}
        <Box sx={{ mt: 1 }}>
          {loadingPatient ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
              <CircularProgress size={24} />
            </Box>
          ) : patient ? (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              <Typography variant="subtitle2">Dados do paciente</Typography>
              <Typography variant="body2">
                <strong>Nome:</strong> {patient.full_name}
              </Typography>
              {patient.birth_date && (
                <Typography variant="body2">
                  <strong>Nascimento:</strong>{" "}
                  {dayjs(patient.birth_date).format("DD/MM/YYYY")}
                </Typography>
              )}
              {patient.phone && (
                <Typography variant="body2">
                  <strong>Telefone:</strong> {patient.phone}
                </Typography>
              )}
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Não foi possível carregar os dados do paciente.
            </Typography>
          )}
        </Box>

        {/* Observações anteriores (anamnese / histórico) */}
        {patient && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle2" gutterBottom>
              Histórico / Anamnese
            </Typography>
            <Box
              sx={{
                maxHeight: 200,
                overflowY: "auto",
                p: 1,
                borderRadius: 1,
                border: 1,
                borderColor: "divider",
                backgroundColor: "grey.50",
                whiteSpace: "pre-wrap",
                fontSize: "0.85rem",
              }}
            >
              {patient.notes && patient.notes.trim()
                ? patient.notes
                : "Nenhuma observação registrada até o momento."}
            </Box>
          </Box>
        )}

        {/* Campo para registrar consulta atual */}
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Registro da consulta atual
          </Typography>
          <TextField
            multiline
            minRows={3}
            fullWidth
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Descreva aqui o que foi feito nesta consulta..."
          />
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Fechar</Button>

        <Button
          onClick={handleOpenPatient}
          disabled={!patient}
          variant="outlined"
        >
          Ver ficha completa
        </Button>

        <Button
          onClick={handleSaveNote}
          disabled={!newNote.trim() || saving || !patient}
          variant="contained"
          color="primary"
        >
          {saving ? "Salvando..." : "Salvar registro"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}