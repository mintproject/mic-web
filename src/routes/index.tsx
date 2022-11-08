import { useKeycloak } from "@react-keycloak/web";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ModelSummary from "../components/ModelSummary";
import Welcome from "../pages/Welcome";
import Menu from "../components/Header";
import { PrivateRoute } from "./utils";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";
import CommandLine from "../components/CommandLine";
import IPython2Cwl from "../components/Analyzers/Ipython2cwl";
import ModelSelector from "../components/ModelSelector";
import { COMPONENTS_URL, DASHBOARD, MODELS, MODEL_NOTEBOOKS, ANALYZE_PAGE, NOTEBOOKS_PAGE } from "../constants/routes";
import { ComponentNew } from "../pages/ComponentNew";
import Analyze from "../pages/Analyze";
import Notebooks from "../pages/Notebooks";
import ComponentSummary from "../pages/ComponentSummary";
import SubmitComponent from "../pages/SubmitComponent";

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
            exact
            path={COMPONENTS_URL}
            component={ComponentNew}
            />

          <PrivateRoute 
            exact path={MODELS}
            component={ModelSelector}
          />
          <PrivateRoute
            exact
            path={NOTEBOOKS_PAGE}
            component={Notebooks}
          />
          <PrivateRoute
            exact
            path={ANALYZE_PAGE}
            component={Analyze}
          />
          <PrivateRoute
            exact path="/commandLine"
            component={CommandLine}
          />
          <PrivateRoute
            exact path="/components/:componentId"
            component={ComponentSummary}
          />
          <PrivateRoute
            exact path="/components/:componentId/submit"
            component={SubmitComponent}
          />
        </Switch>
      </BrowserRouter>
    </>
  );
};
