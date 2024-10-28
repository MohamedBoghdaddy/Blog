import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx"; // Added .jsx extension
import reportWebVitals from "./reportWebVitals.js"; // Added .jsx extension
import { AuthProvider } from "./context/AuthContext.jsx"; // Added .jsx extension
import DashboardProvider from './context/DashboardContext.jsx'; // Adjust import to match the export
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <DashboardProvider>
        <App />
      </DashboardProvider>
    </AuthProvider>
  </React.StrictMode>
);

reportWebVitals();
