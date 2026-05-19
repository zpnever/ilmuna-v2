import { describe, expect, it } from "vitest";
import { loginSchema, registerSchema } from "@/features/auth/schemas";

describe("auth schemas", () => {
  it("accepts valid login payload", () => {
    const result = loginSchema.safeParse({
      email: "demo@ilmuna.id",
      password: "password123",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid register payload", () => {
    const result = registerSchema.safeParse({
      name: "Ab",
      username: "Bad Username",
      email: "not-an-email",
      password: "123",
    });

    expect(result.success).toBe(false);
  });
});

