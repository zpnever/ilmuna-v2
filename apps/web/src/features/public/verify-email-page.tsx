import { Link } from "@tanstack/react-router";
import { MailCheck } from "lucide-react";
import { buttonClasses } from "@/shared/ui/button";
import { useSessionStore } from "@/features/auth/session-store";

export function VerifyEmailPage() {
  const session = useSessionStore((state) => state.session);

  return (
    <div className="glass-panel w-full max-w-2xl rounded-[2rem] p-6 md:p-8">
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-gold/10 text-gold-strong">
        <MailCheck className="h-7 w-7" />
      </div>
      <div className="mt-6 text-xs font-semibold uppercase tracking-[0.28em] text-gold-strong">
        Verifikasi email
      </div>
      <h1 className="mt-3 font-display text-4xl font-semibold text-ink">Akun demo berhasil dibuat.</h1>
      <p className="mt-4 text-sm leading-7 text-ink-muted md:text-base">
        Dalam backend final, halaman ini akan menerima status verifikasi email dari API. Untuk fase
        foundation, kita tetap menampilkan checkpoint ini agar alur auth lengkap dari landing hingga
        app shell.
      </p>
      <div className="mt-6 rounded-[1.5rem] border border-line bg-white/80 p-4 text-sm text-ink-muted">
        Email aktif: <span className="font-semibold text-ink">{session?.user.email ?? "ilmuna@gmail.com"}</span>
      </div>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Link
          to={session ? "/feed" : "/login"}
          className={buttonClasses({ variant: "primary", size: "lg" })}
        >
          {session ? "Masuk ke aplikasi" : "Kembali ke login"}
        </Link>
        <Link to="/" className={buttonClasses({ variant: "secondary", size: "lg" })}>
          Lihat landing page
        </Link>
      </div>
    </div>
  );
}
