import { Switch, Route } from "react-router-dom";
import IPython from "./components/IPython";
import Notebooks from "./components/Notebooks";
import ModelList from "./components/ModelList";
import ModelSummary from "./components/ModelSummary";
import Terminal from "./components/Terminal";
import Welcome from "./components/Welcome";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import { Link as RouterLink } from 'react-router-dom';
import Link from '@mui/material/Link';
import './App.css'
import ParameterEditor from "./components/ParameterEditor";
import InputEditor from "./components/InputEditor";
const theme = createTheme();



function App() {
  return (
    <ThemeProvider theme={theme}>

      <CssBaseline />
      <AppBar position="relative">
        <Toolbar>
            <Link
              variant='h6'
              color='inherit'
              underline='none'
              component={RouterLink}
              to="/"
            >
              MINT Model Insertion
            </Link>
        </Toolbar>
      </AppBar>

      <Switch>
        <Route exact path='/'>
          <Welcome />
        </Route>
        <Route exact path="/ipython">
          <IPython />
        </Route>
        <Route path="/notebooks/:taskId">
          <Notebooks />
        </Route>
        <Route exact path="/models/">
          <ModelList />
        </Route>
        <Route path="/models/:modelId/summary">
          <ModelSummary />
        </Route>
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
    </ThemeProvider>
  );
}

export default App;
