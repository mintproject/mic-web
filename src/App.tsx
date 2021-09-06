import React from 'react';
import logo from './logo.svg';
import './App.css';
import Terminal from './components/Terminal';
import History from './components/History';

function App() {
  return (
    <div className="App">
      <Terminal />
      <History />
    </div>
  );
}

export default App;
