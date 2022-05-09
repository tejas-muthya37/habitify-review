import React from "react";
import ReactDOM from "react-dom";
import { makeServer } from "./server";
import App from "./App";

makeServer();

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
