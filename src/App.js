import React from "react";
import "./App.css";
import Map from "./Map";

function App() {
  return (
    <div className="App">
      <header>
        <h1>Zero Deliveries</h1>
        <div className="header-border" />
      </header>
      <main>
        <Map />
      </main>
    </div>
  );
}

export default App;
