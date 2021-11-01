import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { AppRouter } from "./routes";
const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ReactKeycloakProvider
        authClient={keycloak}
      >
        <AppRouter />
      </ReactKeycloakProvider>
    </ThemeProvider>
  );
}

export default App;
