import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import CircularProgress from "@mui/material/CircularProgress";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { apiGet, apiDelete } from "../services/api";
import { formatCpf, formatPhone } from "../utils/formatters";

export default function PatientsPage() {
  const navigate = useNavigate();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [error, setError] = useState("");

  async function fetchPatients() {
    setLoading(true);
    setError("");

    try {
      const data = await apiGet("/patients/");
      setPatients(data);
    } catch (err) {
      console.error(err);
      setError("Erro ao carregar pacientes. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPatients();
  }, []);

  async function handleDelete() {
    if (!deleteId) return;

    try {
      await apiDelete(`/patients/${deleteId}/`);
      setDeleteId(null);
      fetchPatients();
    } catch (err) {
      console.error(err);
      setError("Erro ao excluir paciente. Tente novamente.");
    }
  }

  return (
    <Box>
      {/* Cabeçalho da página */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" gutterBottom>
            Pacientes
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Lista de pacientes cadastrados na clínica.
          </Typography>
        </Box>

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => navigate("/patients/new")}
        >
          Novo paciente
        </Button>
      </Box>

      {/* Erro geral */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Tabela ou loading */}
      {loading ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 6,
          }}
        >
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer 
          component={Paper}
          sx={{
            width: "100%",
            overflowX: "auto",          // scroll horizontal se precisar
          }}
        >
          <Table 
            size="small"
            sx={{
              minWidth: 650,
            }}
          >
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Telefone</TableCell>
                <TableCell>Email</TableCell>
                <TableCell
                  sx={{
                    display: { xs: "none", sm: "table-cell" }, // esconde CPF no xs
                  }}
                >
                  CPF
                </TableCell>
                <TableCell align="right">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Nenhum paciente cadastrado.
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient.id} hover>
                    <TableCell>{patient.full_name}</TableCell>
                    <TableCell>{formatPhone(patient.phone_number)}</TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell
                      sx={{
                        display: { xs: "none", sm: "table-cell" }, // esconde CPF no xs
                      }}
                    >
                      {formatCpf(patient.cpf)}
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        sx={{ justifyContent: "flex-end" }}
                      >
                        <Tooltip title="Editar">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={() =>
                              navigate(`/patients/${patient.id}/edit`)
                            }
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Excluir">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => setDeleteId(patient.id)}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog de confirmação de exclusão */}
      <Dialog
        open={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
      >
        <DialogTitle>Excluir paciente</DialogTitle>
        <DialogContent>
          <Typography>
            Tem certeza que deseja excluir este paciente? Esta ação não pode ser
            desfeita.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancelar</Button>
          <Button
            onClick={handleDelete}
            color="error"
            variant="contained"
          >
            Excluir
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}