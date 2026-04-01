import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/App";
import "@/styles/global.css";
import "@/styles/layout.css";

function applyDocumentTitleFromEnv(): void {
  const env = import.meta.env.ENV;
  const label = env ? `${env} | ` : "";
  const title = `Kairos Living | ${label}health Check`;
  document.title = title;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) {
    meta.setAttribute("content", title);
  }
}

applyDocumentTitleFromEnv();

const el = document.getElementById("root");
if (!el) {
  throw new Error("Root element #root not found");
}

createRoot(el).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
