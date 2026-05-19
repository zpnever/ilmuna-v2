import { setupWorker } from "msw/browser";
import { handlers } from "@/mocks/handlers";
import { enableInlineMocking } from "@/mocks/inline";

let worker: ReturnType<typeof setupWorker> | null = null;

export async function enableMocking(mode: string) {
  if (mode === "inline") {
    enableInlineMocking();
    return;
  }

  try {
    worker ??= setupWorker(...handlers);

    await worker.start({
      onUnhandledRequest: "bypass",
      quiet: true,
    });
  } catch (error) {
    console.warn("MSW browser worker gagal dijalankan, fallback ke inline mock.", error);
    enableInlineMocking();
  }
}

