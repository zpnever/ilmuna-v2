import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "@tanstack/react-router";
import { ArrowRight, LoaderCircle } from "lucide-react";
import { authApi } from "@/shared/api/auth-api";
import { normalizeApiError } from "@/shared/api/errors";
import { currentUserQueryOptions } from "@/shared/api/query-options";
import { Button, buttonClasses } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { useSessionStore } from "@/features/auth/session-store";
import { loginSchema, registerSchema } from "@/features/auth/schemas";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

type AuthFormValues = {
  name: string;
  username: string;
  email: string;
  password: string;
};

const emailValidator = (value: string) => {
  if (!value.trim()) return "Email wajib diisi.";
  if (!/\S+@\S+\.\S+/.test(value)) return "Masukkan email yang valid.";
  return undefined;
};

const passwordValidator = (value: string) => {
  if (!value.trim()) return "Password wajib diisi.";
  if (value.length < 8) return "Password minimal 8 karakter.";
  return undefined;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setSession = useSessionStore((state) => state.setSession);
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: async (value: AuthFormValues) => {
      if (mode === "login") {
        return authApi.login(
          loginSchema.parse({
            email: value.email,
            password: value.password,
          }),
        );
      }

      return authApi.register(registerSchema.parse(value));
    },
    onSuccess: async (session) => {
      setSession(session);
      queryClient.setQueryData(currentUserQueryOptions().queryKey, session.user);
      await router.navigate({
        to: mode === "login" ? "/feed" : "/verify-email",
      });
    },
    onError: async (error) => {
      const normalized = await normalizeApiError(error);
      setFormError(normalized.message);
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setFormError(null);
      await mutation.mutateAsync(value);
    },
  });

  return (
    <div className="glass-panel w-full max-w-xl rounded-[2rem] p-6 md:p-8">
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-strong">
          {mode === "login" ? "Masuk ke Ilmuna" : "Buat akun Ilmuna"}
        </div>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink">
          {mode === "login" ? "Kembali belajar bersama." : "Mulai ruang ilmu digitalmu."}
        </h1>
        <p className="mt-3 max-w-lg text-sm leading-7 text-ink-muted">
          {mode === "login"
            ? "Masuk untuk membuka feed, grup pengajian, dan referensi Al-Quran yang sudah kamu simpan."
            : "Daftar dengan email untuk mencoba alur onboarding, shell aplikasi, dan kontrak API mock yang sudah siap."}
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        {mode === "register" ? (
          <form.Field
            name="name"
            validators={{
              onBlur: ({ value }) => (!value.trim() ? "Nama wajib diisi." : undefined),
            }}
          >
            {(field) => (
              <label className="block">
                <div className="mb-2 text-sm font-medium text-ink">Nama lengkap</div>
                <Input
                  name={field.name}
                  value={field.state.value}
                  invalid={field.state.meta.errors.length > 0}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="Salsabila Nurul Hidayah"
                />
                {field.state.meta.errors[0] ? (
                  <div className="mt-2 text-sm text-danger">{field.state.meta.errors[0]}</div>
                ) : null}
              </label>
            )}
          </form.Field>
        ) : null}

        {mode === "register" ? (
          <form.Field
            name="username"
            validators={{
              onBlur: ({ value }) =>
                !value.trim()
                  ? "Username wajib diisi."
                  : !/^[a-z0-9._]+$/.test(value)
                    ? "Gunakan huruf kecil, angka, titik, atau garis bawah."
                    : undefined,
            }}
          >
            {(field) => (
              <label className="block">
                <div className="mb-2 text-sm font-medium text-ink">Username</div>
                <Input
                  name={field.name}
                  value={field.state.value}
                  invalid={field.state.meta.errors.length > 0}
                  onBlur={field.handleBlur}
                  onChange={(event) => field.handleChange(event.target.value)}
                  placeholder="salsabila.nur"
                />
                {field.state.meta.errors[0] ? (
                  <div className="mt-2 text-sm text-danger">{field.state.meta.errors[0]}</div>
                ) : null}
              </label>
            )}
          </form.Field>
        ) : null}

        <form.Field
          name="email"
          validators={{
            onBlur: ({ value }) => emailValidator(value),
          }}
        >
          {(field) => (
            <label className="block">
              <div className="mb-2 text-sm font-medium text-ink">Email</div>
              <Input
                name={field.name}
                type="email"
                value={field.state.value}
                invalid={field.state.meta.errors.length > 0}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="demo@ilmuna.id"
              />
              {field.state.meta.errors[0] ? (
                <div className="mt-2 text-sm text-danger">{field.state.meta.errors[0]}</div>
              ) : null}
            </label>
          )}
        </form.Field>

        <form.Field
          name="password"
          validators={{
            onBlur: ({ value }) => passwordValidator(value),
          }}
        >
          {(field) => (
            <label className="block">
              <div className="mb-2 text-sm font-medium text-ink">Password</div>
              <Input
                name={field.name}
                type="password"
                value={field.state.value}
                invalid={field.state.meta.errors.length > 0}
                onBlur={field.handleBlur}
                onChange={(event) => field.handleChange(event.target.value)}
                placeholder="password123"
              />
              {field.state.meta.errors[0] ? (
                <div className="mt-2 text-sm text-danger">{field.state.meta.errors[0]}</div>
              ) : null}
            </label>
          )}
        </form.Field>

        {formError ? (
          <div className="rounded-2xl border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
            {formError}
          </div>
        ) : null}

        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting] as const}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" block size="lg" disabled={!canSubmit || isSubmitting || mutation.isPending}>
              {mutation.isPending ? <LoaderCircle className="mr-2 h-4 w-4 animate-spin" /> : null}
              {mode === "login" ? "Masuk ke aplikasi" : "Buat akun demo"}
            </Button>
          )}
        </form.Subscribe>
      </form>

      <div className="mt-6 flex flex-col gap-3 text-sm text-ink-muted md:flex-row md:items-center md:justify-between">
        <div>{mode === "login" ? "Belum punya akun?" : "Sudah punya akun?"}</div>
        <Link
          to={mode === "login" ? "/register" : "/login"}
          className={buttonClasses({
            variant: "ghost",
            size: "sm",
            className: "justify-start px-0",
          })}
        >
          {mode === "login" ? "Daftar sekarang" : "Masuk ke akun"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
