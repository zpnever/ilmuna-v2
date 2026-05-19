import {
  BookMarked,
  Compass,
  Home,
  ScrollText,
  Shield,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { AppShellNavItem } from "@/shared/api/contracts";

export const appShellNavItems: AppShellNavItem[] = [
  { to: "/feed", label: "Feed", iconKey: "home", access: "auth" },
  { to: "/explore", label: "Explore", iconKey: "explore", access: "auth" },
  { to: "/quran", label: "Quran", iconKey: "quran", access: "auth" },
  { to: "/hadist", label: "Hadist", iconKey: "hadith", access: "auth" },
  { to: "/groups", label: "Grup", iconKey: "groups", access: "auth" },
  { to: "/admin", label: "Admin", iconKey: "admin", access: "admin" },
];

export const navIcons: Record<AppShellNavItem["iconKey"], LucideIcon> = {
  home: Home,
  explore: Compass,
  quran: BookMarked,
  hadith: ScrollText,
  groups: Users,
  admin: Shield,
};
