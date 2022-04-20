import { useKeycloak } from "@react-keycloak/web";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ComponentSummary from "../components/ModelSummary";
import Terminal from "../components/Terminal";
import Welcome from "../pages/Welcome";
import Menu from "../components/Header";
import { PrivateRoute } from "./utils";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";
import CommandLine from "../components/CommandLine";
import GitRepo from "../pages/GitRepo";
import ModelSelector from "../components/ModelSelector";
import { DASHBOARD, MODELS, MODEL_NOTEBOOKS, NOTEBOOK_GIT_FORM } from "../constants/routes";

export const AppRouter = () => {
  const { initialized } = useKeycloak();
  if (!initialized) {
    return (
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: "background.paper",
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              <CircularProgress />
            </Typography>
          </Container>
        </Box>
      </main>
    );
  }
  return (
    <>
      <BrowserRouter>
        <Menu />
        <Switch>
          <Route 
            exact 
            path={DASHBOARD}
            component={Welcome} 
          />
          <PrivateRoute 
            exact path={MODELS}
            component={ModelSelector}
          />
          <PrivateRoute
            exact
            path={NOTEBOOK_GIT_FORM}
            component={GitRepo}
          />
          <PrivateRoute
            exact path="/commandLine"
            component={CommandLine}
          />
          <PrivateRoute
            path="/components/:componentId"
            component={ComponentSummary}
          />
          <Route path="/term/:modelId/:containerId">
            {" "}
            <Terminal />{" "}
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
};
