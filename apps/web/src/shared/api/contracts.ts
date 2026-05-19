export type UserRole = "member" | "admin";

export type ApiErrorShape = {
  status: number;
  code: string;
  message: string;
  issues?: Record<string, string[]>;
};

export type PaginatedResponse<T> = {
  data: T[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    hasMore: boolean;
  };
};

export type RouteAccessRule = "public" | "guest" | "auth" | "admin";

export type AppShellRouteTo =
  | "/feed"
  | "/explore"
  | "/quran"
  | "/hadist"
  | "/groups"
  | "/settings/profile"
  | "/settings/account"
  | "/admin";

export type CurrentUser = {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  bio: string | null;
  imageUrl: string | null;
  location: string | null;
  website: string | null;
  isVerified: boolean;
  emailVerified: boolean;
  followerCount: number;
  followingCount: number;
  groupCount: number;
};

export type AuthSession = {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
  user: CurrentUser;
};

export type AppShellNavItem = {
  to: AppShellRouteTo;
  label: string;
  iconKey: "home" | "explore" | "quran" | "hadith" | "groups" | "profile" | "settings" | "admin";
  access: RouteAccessRule;
};

export type LandingStat = {
  label: string;
  value: string;
  caption: string;
};

export type QuranSurahSummary = {
  number: number;
  slug: string;
  latinName: string;
  arabicName: string;
  totalAyahs: number;
  revelation: "Makkiyah" | "Madaniyah";
};

export type QuranAyahPreview = {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  arabic: string;
  translation: string;
};

export type GroupSummary = {
  id: string;
  slug: string;
  name: string;
  description: string;
  memberCount: number;
  studyFocus: string;
  isPublic: boolean;
};

export type FeedPostPreview = {
  id: string;
  author: Pick<CurrentUser, "name" | "username" | "imageUrl" | "isVerified">;
  excerpt: string;
  createdAt: string;
  likes: number;
  comments: number;
  quote?: QuranAyahPreview;
};

export type HadithBookSummary = {
  slug: string;
  name: string;
  narrator: string;
  totalItems: number;
};

export type LandingSnapshot = {
  stats: LandingStat[];
  dailyAyah: QuranAyahPreview;
  featuredGroups: GroupSummary[];
  featuredPost: FeedPostPreview;
};

export type NotificationSummary = {
  unreadCount: number;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  username: string;
  email: string;
  password: string;
};
