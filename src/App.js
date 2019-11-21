import React from "react";
// import logo from "./logo.svg";
import "./App.css";
import "./main.css";
import Navigation from "./components/Navigation";
import ImageUploader from "./components/ImageUploader";

function App() {
  return (
    <div className="App">
      <Navigation />
      <div className="main">
        <ImageUploader />
      </div>
    </div>
  );
}

export default App;
