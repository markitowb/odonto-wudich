import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1565C0",      // azul escuro (cor principal)
      light: "#5E92F3",
      dark: "#003C8F",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#00897B",      // verde-azulado (ações secundárias)
      contrastText: "#FFFFFF",
    },
    error: {
      main: "#C62828",      // vermelho (excluir, alertas)
    },
    background: {
      default: "#F4F6F8",   // cinza claro de fundo geral
      paper: "#FFFFFF",     // branco para cards e tabelas
    },
    text: {
      primary: "#1A237E",   // azul escuro para títulos
      secondary: "#546E7A", // cinza azulado para textos secundários
    },
  },
  typography: {
    fontFamily: "'Inter', 'Roboto', sans-serif",
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { textTransform: "none" }, // botões sem CAIXA ALTA
  },
  shape: {
    borderRadius: 8,         // arredondamento padrão
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true, // botões sem sombra excessiva
      },
    },
    MuiPaper: {
      defaultProps: {
        elevation: 2,
      },
    },
  },
});

export default theme;