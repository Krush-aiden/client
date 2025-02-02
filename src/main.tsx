import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { store } from "./app/store.tsx";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
  </StrictMode>
);
