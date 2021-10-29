import { useKeycloak } from "@react-keycloak/web";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import IPython from "../components/IPython";
import Notebooks from "../components/Notebooks";
import ModelList from "../components/ModelList";
import ModelSummary from "../components/ModelSummary";
import Terminal from "../components/Terminal";
import Welcome from "../components/Welcome";
import ParameterEditor from "../components/ParameterEditor";
import InputEditor from "../components/InputEditor";
import Menu from "../components/Menu";
import { PrivateRoute } from "./utils";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { CircularProgress } from "@mui/material";
import IPythonModelRegister from "../components/IPythonModelRegister";

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
      <Menu />
      <BrowserRouter>
        <Switch>
          <Route exact path="/">
            <Welcome />
          </Route>
          <PrivateRoute exact path="/ipython" component={IPythonModelRegister} />
          <PrivateRoute path="/notebooks/:taskId" component={Notebooks}/>
          <Route exact path="/models/">
            <ModelList />
          </Route>
          <PrivateRoute path="/models/:modelId/summary" component={ModelSummary} />
          <Route path="/inputs/:inputId">
            <InputEditor />
          </Route>
          <Route path="/parameters/:parameterId">
            <ParameterEditor />
          </Route>
          <Route exact path="/term">
            {" "}
            <Terminal />{" "}
          </Route>
        </Switch>
      </BrowserRouter>
    </>
  );
};
