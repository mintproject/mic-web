import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./App.css";
import { ReactKeycloakProvider } from "@react-keycloak/web";
import keycloak from "./keycloak";
import { AppRouter } from "./routes";
const theme = createTheme();

const eventLogger = (event: unknown, error: unknown) => {
  console.log("onKeycloakEvent", event, error);
};

const tokenLogger = (tokens: unknown) => {
  console.log("onKeycloakTokens", tokens);
};

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
