import { z } from "zod";

export const loginSchema = z.object({
  email: z.email("Masukkan email yang valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
});

export const registerSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter."),
  username: z
    .string()
    .min(3, "Username minimal 3 karakter.")
    .regex(/^[a-z0-9._]+$/, "Gunakan huruf kecil, angka, titik, atau garis bawah."),
  email: z.email("Masukkan email yang valid."),
  password: z.string().min(8, "Password minimal 8 karakter."),
});

export type LoginSchema = z.infer<typeof loginSchema>;
export type RegisterSchema = z.infer<typeof registerSchema>;

