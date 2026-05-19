import { describe, expect, it } from "vitest";
import { normalizeApiError } from "@/shared/api/errors";

describe("normalizeApiError", () => {
  it("normalizes unknown error instances", async () => {
    const normalized = await normalizeApiError(new Error("Boom"));

    expect(normalized).toEqual({
      status: 500,
      code: "UNKNOWN_ERROR",
      message: "Boom",
    });
  });
});

