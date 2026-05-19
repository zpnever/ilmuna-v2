import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Bell, LogOut, Search } from "lucide-react";
import { authApi } from "@/shared/api/auth-api";
import { currentUserQueryOptions, dailyAyahQueryOptions, featuredGroupsQueryOptions, notificationSummaryQueryOptions } from "@/shared/api/query-options";
import { Avatar } from "@/shared/ui/avatar";
import { Button, buttonClasses } from "@/shared/ui/button";
import { Logo } from "@/shared/ui/logo";
import { useSessionStore } from "@/features/auth/session-store";
import { appShellNavItems, navIcons } from "@/features/app-shell/nav";
import { cn } from "@/shared/utils/cn";

function SidebarNav() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });
  const currentUser = useQuery(currentUserQueryOptions()).data;

  const items = appShellNavItems.filter((item) => {
    if (item.access === "admin" && currentUser?.role !== "admin") {
      return false;
    }

    return true;
  });

  return (
    <>
      <aside className="hidden border-r border-line/80 px-4 py-6 md:flex md:flex-col md:gap-8 xl:px-6">
        <Logo compact className="hidden xl:flex" />
        <div className="xl:hidden">
          <Logo compact />
        </div>
        <nav className="flex flex-col gap-2">
          {items.map((item) => {
            const Icon = navIcons[item.iconKey];
            const isProfileRoute = item.to === "/settings/profile";
            const navClassName = cn(
              "group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition",
              pathname === item.to || (isProfileRoute && pathname === `/${currentUser?.username}`)
                ? "border-gold/40 bg-gold/10 text-ink"
                : "border-transparent text-ink-muted hover:border-line hover:bg-white/60 hover:text-ink",
            );

            if (isProfileRoute && currentUser) {
              return (
                <Link
                  key={item.label}
                  to="/$username"
                  params={{ username: currentUser.username }}
                  className={navClassName}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span className="hidden xl:inline">{item.label}</span>
                </Link>
              );
            }

            return (
              <Link key={item.label} to={item.to} className={navClassName}>
                <Icon className="h-5 w-5 shrink-0" />
                <span className="hidden xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      <nav className="glass-panel fixed inset-x-4 bottom-4 z-30 flex items-center justify-between rounded-full p-2 md:hidden">
        {items.slice(0, 5).map((item) => {
          const Icon = navIcons[item.iconKey];
          const isProfileRoute = item.to === "/settings/profile";
          const navClassName = cn(
            "flex min-w-0 flex-1 flex-col items-center rounded-full px-3 py-2 text-[11px] font-medium",
            pathname === item.to || (isProfileRoute && pathname === `/${currentUser?.username}`)
              ? "bg-ink text-white"
              : "text-ink-muted",
          );

          if (isProfileRoute && currentUser) {
            return (
              <Link
                key={item.label}
                to="/$username"
                params={{ username: currentUser.username }}
                className={navClassName}
              >
                <Icon className="mb-1 h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          }

          return (
            <Link key={item.label} to={item.to} className={navClassName}>
              <Icon className="mb-1 h-4 w-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

function RightRail() {
  const { data: ayah } = useQuery(dailyAyahQueryOptions());
  const { data: groups } = useQuery(featuredGroupsQueryOptions());

  return (
    <aside className="hidden border-l border-line/80 px-6 py-6 xl:block">
      <div className="sticky top-6 space-y-5">
        <div className="glass-panel rounded-[1.75rem] p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-strong">Ayat hari ini</div>
          <div className="arabic-text mt-4 text-right text-3xl leading-[1.9] text-ink">{ayah?.arabic}</div>
          <div className="mt-3 text-sm text-ink-muted">
            QS. {ayah?.surahName} : {ayah?.ayahNumber}
          </div>
          <p className="mt-2 text-sm leading-7 text-ink-muted">{ayah?.translation}</p>
        </div>

        <div className="glass-panel rounded-[1.75rem] p-5">
          <div className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-strong">Grup unggulan</div>
          <div className="mt-4 space-y-4">
            {groups?.slice(0, 3).map((group) => (
              <div key={group.id} className="rounded-[1.25rem] border border-line bg-white/70 p-4">
                <div className="text-sm font-semibold text-ink">{group.name}</div>
                <div className="mt-2 text-sm leading-6 text-ink-muted">{group.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

export function AppShellLayout() {
  const clearSession = useSessionStore((state) => state.clearSession);
  const { data: currentUser } = useQuery(currentUserQueryOptions());
  const { data: notifications } = useQuery(notificationSummaryQueryOptions());

  return (
    <div className="app-shell-grid">
      <SidebarNav />

      <main className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-line/80 bg-canvas/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-4 md:px-6 xl:px-10">
            <div className="hidden flex-1 items-center gap-3 rounded-full border border-line bg-white/75 px-4 py-3 text-sm text-ink-muted md:flex">
              <Search className="h-4 w-4" />
              Slot pencarian siap untuk fase berikutnya
            </div>
            <div className="ml-auto flex items-center gap-3">
              <button
                type="button"
                className="relative flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white/80 text-ink transition hover:border-gold"
                aria-label="Notifikasi"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-bold text-ink">
                  {notifications?.unreadCount ?? 0}
                </span>
              </button>

              <Link
                to="/$username"
                params={{ username: currentUser?.username ?? "demo-user" }}
                className="hidden items-center gap-3 rounded-full border border-line bg-white/80 px-4 py-2 text-sm font-medium text-ink md:flex"
              >
                <Avatar name={currentUser?.name ?? "Demo User"} imageUrl={currentUser?.imageUrl} className="h-9 w-9" />
                <div className="text-left">
                  <div>{currentUser?.name}</div>
                  <div className="text-xs text-ink-muted">@{currentUser?.username}</div>
                </div>
              </Link>

              <Button
                variant="ghost"
                size="sm"
                onClick={async () => {
                  await authApi.logout().catch(() => null);
                  clearSession();
                  window.location.href = "/login";
                }}
              >
                <LogOut className="mr-2 h-4 w-4" />
                Keluar
              </Button>
            </div>
          </div>
        </header>

        <div className="px-4 py-6 pb-28 md:px-6 xl:px-10">
          <Outlet />
        </div>
      </main>

      <RightRail />
    </div>
  );
}
