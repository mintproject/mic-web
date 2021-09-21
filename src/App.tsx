import React from 'react';
import logo from './logo.svg';
import './App.css';
import Terminal from './components/Terminal';
import History from './components/History';
import {Link, Switch, Route} from 'react-router-dom'
import IPython from './components/IPython';
import IPythonLogs from './components/IPythonLogs';
import Notebooks from './components/Notebooks';
import { IPYTHON_API } from './components/environment';
function App() {
  return (
    <div className="App">
      {IPYTHON_API}
      <Link to='/ipython'>IPython2MINT</Link> <br></br>
      <Link to='/term'>Term</Link>
      <Switch>
        <Route exact path='/ipython'><IPython /></Route>
        <Route path='/notebooks/:taskId'><Notebooks /></Route>
        <Route exact path='/term'> <Terminal /> </Route> 
      </Switch>
    </div>

  );
}

export default App;
