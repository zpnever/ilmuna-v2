import type { ApiErrorShape } from "@/shared/api/contracts";
import { ApiHttpError } from "@/shared/api/client";

export async function normalizeApiError(error: unknown): Promise<ApiErrorShape> {
  if (error instanceof ApiHttpError) {
    const response = error.response;
    const body = error.body as Partial<ApiErrorShape> | string | null;

    if (body && typeof body === "object") {
      return {
        status: body.status ?? response.status,
        code: body.code ?? "HTTP_ERROR",
        message: body.message ?? response.statusText ?? "Permintaan tidak dapat diproses.",
        issues: body.issues,
      };
    }

    return {
      status: response.status,
      code: "HTTP_ERROR",
      message:
        typeof body === "string" && body.length > 0
          ? body
          : response.statusText || "Permintaan tidak dapat diproses.",
    };
  }

  if (error instanceof Error) {
    return {
      status: 500,
      code: "UNKNOWN_ERROR",
      message: error.message,
    };
  }

  return {
    status: 500,
    code: "UNKNOWN_ERROR",
    message: "Terjadi kesalahan yang tidak dikenal.",
  };
}
