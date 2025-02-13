import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { CssBaseline } from "@mui/material";
import { AppRouter } from "./router/index.tsx";
import { AuthProvider } from "./hooks/useAuth/auth-context.tsx";
import "./main.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <CssBaseline />
      <AppRouter />
    </AuthProvider>
  </StrictMode>
);
