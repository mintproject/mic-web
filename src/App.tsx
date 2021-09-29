import "./App.css";
import { Switch, Route } from "react-router-dom";
import IPython from "./components/IPython";
import Notebooks from "./components/Notebooks";
import ModelList from "./components/ModelList";
import ModelSummary from "./components/ModelSummary";
import Terminal from "./components/Terminal";
import Welcome from "./components/Welcome";


function App() {
  return (
    <div>

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
        <Route exact path="/term">
          {" "}
          <Terminal />{" "}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
