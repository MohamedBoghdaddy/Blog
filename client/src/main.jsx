import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { AuthProvider } from "./context/AuthContext";
import DashboardProvider from "./context/DashboardContext"; // ✅ Added DashboardProvider
import "./index.css"; // ✅ Ensures styles are included

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AuthProvider>
          <DashboardProvider>
            <App />
          </DashboardProvider>
        </AuthProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
