import React from 'react';
import logo from './logo.svg';
import './App.css';
import Terminal from './components/Terminal';
import History from './components/History';
import {Link, Switch, Route} from 'react-router-dom'
import IPython from './components/IPython';
function App() {
  return (
    <div className="App">
      <Link to='/ipython'>IPython2MINT</Link>
      <Switch>
        <Route exact path='/ipython'><IPython /></Route>
      </Switch>
    </div>

  );
}

export default App;
