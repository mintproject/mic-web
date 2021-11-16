import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { AppRouter } from "./routes";
import { ContextProvider } from "./contexts/ModelCatalog";
import { MicContextProvider } from "./contexts/MicContext";

const theme = createTheme({
  palette: {
    primary: {
      light: "#6fbf73",
      main: "#4caf50",
      dark: "#357a38",
    },
    secondary: {
      light: "#ffcf33",
      main: "#ffc400",
      dark: "#b28900",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReactKeycloakProvider authClient={keycloak}>
        <ContextProvider>
          <MicContextProvider>
            <AppRouter />
          </MicContextProvider>
        </ContextProvider>
      </ReactKeycloakProvider>
    </ThemeProvider>
  );
}

export default App;
