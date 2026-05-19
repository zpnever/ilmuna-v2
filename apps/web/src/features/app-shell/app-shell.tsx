import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { Bell, ChevronDown, LogOut, Search, Settings, UserRound } from "lucide-react";
import { appShellNavItems, navIcons } from "@/features/app-shell/nav";
import { useSessionStore } from "@/features/auth/session-store";
import { authApi } from "@/shared/api/auth-api";
import { currentUserQueryOptions, notificationSummaryQueryOptions } from "@/shared/api/query-options";
import { Avatar } from "@/shared/ui/avatar";
import { Logo } from "@/shared/ui/logo";
import { cn } from "@/shared/utils/cn";

function useAccountMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!ref.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return {
    open,
    ref,
    setOpen,
    toggle: () => setOpen((value) => !value),
    close: () => setOpen(false),
  };
}

type AccountMenuProps = {
  currentUser: {
    name?: string;
    username?: string;
    email?: string;
    imageUrl?: string | null;
  } | null | undefined;
  onLogout: () => Promise<void>;
  mobile?: boolean;
};

function AccountMenu({ currentUser, onLogout, mobile = false }: AccountMenuProps) {
  const menu = useAccountMenu();
  const username = currentUser?.username ?? "demo-user";
  const name = currentUser?.name ?? "Demo User";
  const email = currentUser?.email ?? "ilmuna@gmail.com";

  return (
    <div className="relative" ref={menu.ref}>
      <button
        type="button"
        onClick={menu.toggle}
        className={cn(
          "flex items-center rounded-full border border-line bg-white/80 text-ink transition hover:border-gold",
          mobile ? "h-11 w-11 justify-center" : "gap-3 px-4 py-2 text-sm font-medium",
        )}
        aria-haspopup="menu"
        aria-expanded={menu.open}
        aria-label={mobile ? "Buka menu profil" : "Buka menu akun"}
      >
        <Avatar name={name} imageUrl={currentUser?.imageUrl} className="h-9 w-9" />
        {mobile ? null : (
          <>
            <div className="text-left leading-tight">
              <div className="text-xs text-ink-muted">{email}</div>
              <div className="mt-1 text-sm font-semibold text-ink">@{username}</div>
            </div>
            <ChevronDown className={cn("h-4 w-4 text-ink-muted transition", menu.open && "rotate-180")} />
          </>
        )}
      </button>

      {menu.open ? (
        <div
          className={cn(
            "glass-panel absolute right-0 z-40 min-w-52 rounded-[1.5rem] p-2",
            mobile ? "top-14" : "top-[calc(100%+0.75rem)]",
          )}
          role="menu"
        >
          <div className="rounded-[1.25rem] border border-line/70 bg-white/70 px-4 py-3">
            <div className="text-sm font-semibold text-ink">{name}</div>
            <div className="mt-1 text-xs text-ink-muted">{email}</div>
            <div className="mt-1 text-xs font-medium text-gold-strong">@{username}</div>
          </div>

          <div className="mt-2 flex flex-col gap-1">
            <Link
              to="/$username"
              params={{ username }}
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-ink transition hover:bg-black/5"
              role="menuitem"
              onClick={menu.close}
            >
              <UserRound className="h-4 w-4" />
              Lihat profile
            </Link>
            <Link
              to="/settings/account"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-ink transition hover:bg-black/5"
              role="menuitem"
              onClick={menu.close}
            >
              <Settings className="h-4 w-4" />
              Setting
            </Link>
            <button
              type="button"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium text-danger transition hover:bg-danger/5"
              role="menuitem"
              onClick={async () => {
                menu.close();
                await onLogout();
              }}
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

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
            const navClassName = cn(
              "group flex items-center gap-3 rounded-2xl border px-3 py-3 text-sm font-medium transition",
              pathname === item.to
                ? "border-gold/40 bg-gold/10 text-ink"
                : "border-transparent text-ink-muted hover:border-line hover:bg-white/60 hover:text-ink",
            );

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
          const navClassName = cn(
            "flex min-w-0 flex-1 flex-col items-center rounded-full px-3 py-2 text-[11px] font-medium transition",
            pathname === item.to
              ? "bg-ink text-white shadow-sm"
              : "text-ink hover:bg-black/5",
          );

          return (
            <Link key={item.label} to={item.to} className={navClassName}>
              <Icon className={cn("mb-1 h-4 w-4", pathname === item.to && "text-white")} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}

export function AppShellLayout() {
  const clearSession = useSessionStore((state) => state.clearSession);
  const { data: currentUser } = useQuery(currentUserQueryOptions());
  const { data: notifications } = useQuery(notificationSummaryQueryOptions());
  const handleLogout = async () => {
    await authApi.logout().catch(() => null);
    clearSession();
    window.location.href = "/login";
  };

  return (
    <div className="app-shell-grid">
      <SidebarNav />

      <main className="min-w-0">
        <header className="sticky top-0 z-20 border-b border-line/80 bg-canvas/80 backdrop-blur-xl">
          <div className="flex items-center gap-3 px-4 py-4 md:px-6 xl:px-10">
            <div className="md:hidden">
              <Logo compact />
            </div>
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

              <div className="md:hidden">
                <AccountMenu currentUser={currentUser} onLogout={handleLogout} mobile />
              </div>
              <div className="hidden md:block">
                <AccountMenu currentUser={currentUser} onLogout={handleLogout} />
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 py-6 pb-28 md:px-6 xl:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
