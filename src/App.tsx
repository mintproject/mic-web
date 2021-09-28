import './App.css';
import Terminal from './components/Terminal';
import {Link, Switch, Route} from 'react-router-dom'
import IPython from './components/IPython';
import Notebooks from './components/Notebooks';
import ModelSummary from './components/ModelSummary';
import ModelList from './components/ModelList';

function App() {
  return (
    <div className="App">
      <header>
        <Link to='/ipython'>IPython2MINT</Link>
      </header>
     
      <Switch>
        <Route exact path='/ipython'><IPython /></Route>
        <Route path='/notebooks/:taskId'><Notebooks /></Route>
        <Route exact path='/models/'><ModelList /></Route>
        <Route path='/models/:modelId/summary'><ModelSummary /></Route>
        <Route exact path='/term'> <Terminal /> </Route> 
      </Switch>
    </div>

  );
}

export default App;
