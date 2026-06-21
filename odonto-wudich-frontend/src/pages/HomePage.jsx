import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";

import PeopleIcon from "@mui/icons-material/People";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",        // centraliza tudo horizontalmente
      }}
    >
      {/* Títulos */}
      <Typography
        variant="h4"
        align="center"
        gutterBottom
        sx={{ mb: 1 }}
      >
        Bem-vindo(a) à Odonto Wudich
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        align="center"
        sx={{ mb: 4, maxWidth: 600 }}
      >
        Selecione uma das opções abaixo para gerenciar pacientes ou agendamentos.
      </Typography>

      {/* Container dos cards */}
      <Box
        sx={{
          width: "100%",
          maxWidth: 600,             // largura máxima dos cards
          display: "flex",
          flexDirection: "column",
          gap: 2,                    // espaço entre os cards
        }}
      >
        {/* Card de Pacientes */}
        <Card>
          <CardContent>
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ alignItems: "center", mb: 2 }}
            >
              <Box
                sx={{
                  backgroundColor: "primary.light",
                  color: "primary.contrastText",
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <PeopleIcon />
              </Box>
              <Box>
                <Typography variant="h6">Pacientes</Typography>
                <Typography variant="body2" color="text.secondary">
                  Cadastre, edite e gerencie os dados dos pacientes da clínica.
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/patients")}
            >
              Ver pacientes
            </Button>
          </CardContent>
        </Card>

        {/* Card de Agendamentos */}
        <Card>
          <CardContent>
            <Stack 
              direction="row" 
              spacing={2} 
              sx={{ alignItems: "center", mb: 2 }}
            >
              <Box
                sx={{
                  backgroundColor: "secondary.main",
                  color: "secondary.contrastText",
                  borderRadius: "50%",
                  width: 48,
                  height: 48,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <CalendarMonthIcon />
              </Box>
              <Box>
                <Typography variant="h6">Agendamentos</Typography>
                <Typography variant="body2" color="text.secondary">
                  Organize as consultas dos pacientes e a agenda da equipe.
                </Typography>
              </Box>
            </Stack>

            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate("/appointments")}
            >
              Ver agendamentos
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}