import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { Toaster } from "./components/ui/sonner.tsx";
import { store } from "./app/store.tsx";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
      <Toaster />
      <ToastContainer />
    </Provider>
  </StrictMode>
);
