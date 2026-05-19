import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { getDefaultUser, issueSessionForUser } from "@/mocks/fixtures";
import { renderRoute } from "@/test/render-app";

describe("app routing", () => {
  it("renders landing CTA", async () => {
    await renderRoute({ route: "/" });

    expect(await screen.findByRole("heading", { name: /Ilmu kita bersama/i })).toBeInTheDocument();
    expect((await screen.findAllByRole("link", { name: /mulai gratis/i })).length).toBeGreaterThan(0);
  });

  it("redirects guests from protected routes", async () => {
    await renderRoute({ route: "/feed" });

    expect(await screen.findByRole("heading", { name: /Kembali belajar bersama/i })).toBeInTheDocument();
  });

  it("logs in and opens the feed", async () => {
    const user = userEvent.setup();
    await renderRoute({ route: "/login" });

    await user.type(await screen.findByLabelText(/email/i), "demo@ilmuna.id");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /masuk ke aplikasi/i }));

    expect(await screen.findByRole("heading", { name: /Feed sosial sudah punya bentuk awal/i })).toBeInTheDocument();
  });

  it("restores an existing session for profile routes", async () => {
    const session = issueSessionForUser(getDefaultUser());
    await renderRoute({
      route: `/${session.user.username}`,
      session,
    });

    expect(await screen.findByRole("heading", { name: session.user.name })).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getAllByText(`@${session.user.username}`).length).toBeGreaterThan(0);
    });
  });
});
