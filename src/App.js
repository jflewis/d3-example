import React from "react";
// import logo from "./logo.svg";
import { ApexChart } from "./components/ApexChart";
import "./App.css";
import { GoogleChart } from "./components/GoogleChart";
import { D3Chart } from "./components/D3Chart";

function App() {
  return (
    <div className="App">
      {/* <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header> */}
      {/* <ApexChart />
      <GoogleChart /> */}
      <D3Chart />
    </div>
  );
}

export default App;
