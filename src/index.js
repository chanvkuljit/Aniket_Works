import React from "react";
import { createRoot } from "react-dom/client";
import "./styles/Navbar.css";
import reportWebVitals from "./reportWebVitals";
import App from "./App";
import "../src/index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { ToastProvider } from "./components/Toast";
import { BrowserRouter as Router } from "react-router-dom";

const container = document.getElementById("root");
const root = createRoot(container);

root.render(
  <React.StrictMode>
    {/* <Router> */}
    {/* <ToastProvider> */}
    <App />
    {/* </ToastProvider> */}
    {/* </Router> */}
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
