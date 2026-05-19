import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "@/app/router";
import { appEnv } from "@/app/env";
import "@/shared/styles/app.css";

async function bootstrap() {
  if (appEnv.apiMocking !== "disabled") {
    const { enableMocking } = await import("@/mocks/browser");
    await enableMocking(appEnv.apiMocking);
  }

  const rootElement = document.getElementById("root");

  if (!rootElement) {
    throw new Error("Root element #root tidak ditemukan.");
  }

  createRoot(rootElement).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

void bootstrap();

