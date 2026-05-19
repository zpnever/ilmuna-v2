import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { BookOpenText, ChevronRight, Compass, ScrollText, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform } from "motion/react";
import { landingSnapshotQueryOptions } from "@/shared/api/query-options";
import { buttonClasses } from "@/shared/ui/button";
import { Logo } from "@/shared/ui/logo";

const featureCards = [
  {
    icon: BookOpenText,
    title: "Grup Pengajian Privat",
    body: "Ruang belajar terisolasi per komunitas dengan materi, tugas, dan forum internal.",
  },
  {
    icon: Sparkles,
    title: "Feed Sosial Islami",
    body: "Bagikan rangkuman kajian, kutipan ayat, dan refleksi harian dengan interaksi ringan.",
  },
  {
    icon: ScrollText,
    title: "Referensi Terstruktur",
    body: "Buka surah, kitab hadist, dan bookmark pribadi dari satu alur yang konsisten.",
  },
] as const;

export function LandingPage() {
  const { data } = useQuery(landingSnapshotQueryOptions());
  const { scrollYProgress } = useScroll();
  const patternShift = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const haloShift = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <div className="overflow-hidden">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-canvas/75 backdrop-blur-xl">
        <div className="section-shell flex items-center justify-between py-4">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm text-ink-muted md:flex">
            <a href="#fitur" className="transition hover:text-ink">
              Fitur
            </a>
            <a href="#cara-kerja" className="transition hover:text-ink">
              Cara kerja
            </a>
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/login" className={buttonClasses({ variant: "ghost", size: "sm" })}>
              Masuk
            </Link>
            <Link to="/register" className={buttonClasses({ variant: "primary", size: "sm" })}>
              Mulai gratis
            </Link>
          </div>
        </div>
      </header>

      <section className="relative isolate border-b border-line/70 py-16 md:py-24">
        <motion.div
          className="ornament-grid absolute inset-x-0 top-0 -z-10 h-[32rem] opacity-50"
          style={{ y: patternShift }}
        />
        <motion.div
          className="absolute right-[-12rem] top-[-6rem] -z-10 h-80 w-80 rounded-full bg-gold/16 blur-3xl"
          style={{ y: haloShift }}
        />

        <div className="section-shell grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.25em] text-gold-strong">
              <Compass className="h-3.5 w-3.5" />
              Frontend foundation preview
            </div>
            <h1 className="text-balance font-display text-5xl font-semibold leading-[1.02] text-ink md:text-7xl">
              Ilmu kita bersama, dalam ritme digital yang tenang.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-ink-muted md:text-lg">
              Ilmuna merangkai landing yang ekspresif, auth yang ringan, dan app shell yang siap
              dikembangkan untuk feed, grup pengajian, Al-Quran, serta hadist.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/register" className={buttonClasses({ variant: "primary", size: "lg" })}>
                Mulai gratis
              </Link>
              <a href="#fitur" className={buttonClasses({ variant: "secondary", size: "lg" })}>
                Pelajari lebih lanjut
              </a>
            </div>
          </div>

          <div className="glass-panel relative overflow-hidden rounded-[2rem] p-6">
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-br from-gold/25 via-transparent to-ink/5" />
            <div className="relative grid gap-4">
              <div className="rounded-[1.5rem] border border-line bg-white p-5">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.24em] text-gold-strong">
                  Cuplikan ayat
                </div>
                <div className="arabic-text text-right text-3xl leading-[1.9] text-ink">
                  {data?.dailyAyah.arabic ?? "Wa qul rabbi zidni ilma"}
                </div>
                <div className="mt-3 text-sm text-ink-muted">
                  {data?.dailyAyah.translation ??
                    "Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan."}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {data?.stats.map((stat) => (
                  <div key={stat.label} className="rounded-[1.5rem] border border-line bg-canvas/70 p-4">
                    <div className="text-xs uppercase tracking-[0.2em] text-ink-muted">{stat.label}</div>
                    <div className="mt-3 text-3xl font-semibold text-ink">{stat.value}</div>
                    <div className="mt-2 text-sm text-ink-muted">{stat.caption}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" className="section-shell py-16 md:py-24">
        <div className="max-w-2xl">
          <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-strong">
            Fitur utama
          </div>
          <h2 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
            Tiga poros produk, satu sistem frontend yang konsisten.
          </h2>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {featureCards.map((feature) => (
            <article key={feature.title} className="glass-panel rounded-[1.75rem] p-6">
              <feature.icon className="h-9 w-9 text-gold-strong" />
              <h3 className="mt-5 text-xl font-semibold text-ink">{feature.title}</h3>
              <p className="mt-3 text-sm leading-7 text-ink-muted">{feature.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="cara-kerja" className="section-shell py-16 md:py-24">
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            "Buat akun dan masuk ke shell aplikasi yang sudah punya auth guard serta session store.",
            "Jelajahi feed, quran, hadist, grup, profil, dan settings lewat navigasi responsif.",
            "Lanjutkan implementasi fitur berat di atas fondasi query, route, dan mock contract yang sama.",
          ].map((step, index) => (
            <div key={step} className="glass-panel rounded-[1.75rem] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 bg-white text-lg font-semibold text-gold-strong">
                {index + 1}
              </div>
              <p className="mt-5 text-sm leading-7 text-ink-muted">{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-6 md:py-12">
        <div className="grid gap-5 md:grid-cols-3">
          {data?.stats.map((stat) => (
            <div key={stat.label} className="rounded-[1.75rem] border border-line bg-white px-6 py-8 shadow-panel">
              <div className="text-xs uppercase tracking-[0.24em] text-ink-muted">{stat.label}</div>
              <div className="mt-3 font-display text-5xl font-semibold text-ink">{stat.value}</div>
              <div className="mt-2 text-sm text-ink-muted">{stat.caption}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-shell py-16 md:py-24">
        <div className="glass-panel rounded-[2rem] p-8 md:p-10">
          <div className="max-w-2xl">
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-gold-strong">
              Mulai sekarang
            </div>
            <h2 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
              Frontend sudah punya fondasi yang bisa langsung diteruskan ke fase feed dan referensi.
            </h2>
            <p className="mt-4 text-sm leading-7 text-ink-muted md:text-base">
              Gunakan akun demo untuk menjelajah alur awal, lalu kembangkan modul berat tanpa perlu
              mengubah ulang struktur route, query, atau mock contract.
            </p>
          </div>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to="/login" className={buttonClasses({ variant: "secondary", size: "lg" })}>
              Coba akun demo
            </Link>
            <Link to="/register" className={buttonClasses({ variant: "primary", size: "lg" })}>
              Buat akun baru
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line/70 py-8">
        <div className="section-shell flex flex-col gap-5 text-sm text-ink-muted md:flex-row md:items-center md:justify-between">
          <Logo compact />
          <div className="flex items-center gap-5">
            <span>Mobile-first shell</span>
            <span>Mock-first API</span>
            <span>TanStack foundation</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
