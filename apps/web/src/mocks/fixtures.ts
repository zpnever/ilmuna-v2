import type {
  AuthSession,
  CurrentUser,
  FeedPostPreview,
  GroupSummary,
  HadithBookSummary,
  LandingSnapshot,
  NotificationSummary,
  PaginatedResponse,
  QuranAyahPreview,
  QuranSurahSummary,
} from "@/shared/api/contracts";
import { createRandomSegment } from "@/mocks/random";

type FollowUser = Pick<CurrentUser, "id" | "name" | "username" | "imageUrl" | "isVerified">;

type CredentialRecord = {
  password: string;
  userId: string;
};

type MockDb = {
  users: CurrentUser[];
  credentials: Record<string, CredentialRecord>;
  sessions: Record<string, string>;
  landingSnapshot: LandingSnapshot;
  feedPosts: FeedPostPreview[];
  quranSurahs: QuranSurahSummary[];
  ayahOfDay: QuranAyahPreview;
  hadithBooks: HadithBookSummary[];
  groups: GroupSummary[];
  followers: Record<string, PaginatedResponse<FollowUser>>;
  following: Record<string, PaginatedResponse<FollowUser>>;
  notifications: Record<string, NotificationSummary>;
};

const nowIso = "2026-05-19T08:00:00.000Z";

const baseUsers: CurrentUser[] = [
  {
    id: "user-1",
    name: "Salsabila Nur Hidayah",
    username: "salsabila.nur",
    email: "ilmuna@gmail.com",
    role: "member",
    bio: "Mencatat ilmu, membagikan ringkasan, dan belajar dari pengajian rutin setiap pekan.",
    imageUrl: null,
    location: "Jakarta",
    website: "https://ilmuna.id",
    isVerified: true,
    emailVerified: true,
    followerCount: 128,
    followingCount: 42,
    groupCount: 4,
  },
  {
    id: "user-2",
    name: "Ahmad Fauzan",
    username: "ahmad.fauzan",
    email: "fauzan@ilmuna.id",
    role: "admin",
    bio: "Mengelola komunitas kajian dan kurasi materi pembuka.",
    imageUrl: null,
    location: "Bandung",
    website: null,
    isVerified: true,
    emailVerified: true,
    followerCount: 341,
    followingCount: 18,
    groupCount: 6,
  },
  {
    id: "user-3",
    name: "Nadia Kamilah",
    username: "nadia.kamilah",
    email: "nadia@ilmuna.id",
    role: "member",
    bio: "Suka merangkum tafsir singkat dan catatan hafalan.",
    imageUrl: null,
    location: "Yogyakarta",
    website: null,
    isVerified: false,
    emailVerified: true,
    followerCount: 87,
    followingCount: 26,
    groupCount: 3,
  },
];

const featuredGroups: GroupSummary[] = [
  {
    id: "group-1",
    slug: "tafsir-subuh",
    name: "Tafsir Subuh",
    description: "Ruang pengajian subuh dengan fokus ayat-ayat tarbiyah dan adab belajar.",
    memberCount: 324,
    studyFocus: "Tafsir ringkas",
    isPublic: true,
  },
  {
    id: "group-2",
    slug: "halaqah-hafalan",
    name: "Halaqah Hafalan",
    description: "Setoran hafalan mingguan, catatan murajaah, dan evaluasi progres anggota.",
    memberCount: 198,
    studyFocus: "Tahfidz",
    isPublic: true,
  },
  {
    id: "group-3",
    slug: "kajian-akhlaq",
    name: "Kajian Akhlaq",
    description: "Forum komunitas untuk berbagi rangkuman kajian akhlaq praktis.",
    memberCount: 146,
    studyFocus: "Akhlaq",
    isPublic: true,
  },
];

const ayahOfDay: QuranAyahPreview = {
  surahNumber: 20,
  surahName: "Ta Ha",
  ayahNumber: 114,
  arabic: "وَقُل رَّبِّ زِدْنِي عِلْمًا",
  translation: "Dan katakanlah, 'Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan.'",
};

const quranSurahs: QuranSurahSummary[] = [
  { number: 1, slug: "al-fatihah", latinName: "Al-Fatihah", arabicName: "الفاتحة", totalAyahs: 7, revelation: "Makkiyah" },
  { number: 2, slug: "al-baqarah", latinName: "Al-Baqarah", arabicName: "البقرة", totalAyahs: 286, revelation: "Madaniyah" },
  { number: 3, slug: "ali-imran", latinName: "Ali Imran", arabicName: "آل عمران", totalAyahs: 200, revelation: "Madaniyah" },
  { number: 18, slug: "al-kahf", latinName: "Al-Kahf", arabicName: "الكهف", totalAyahs: 110, revelation: "Makkiyah" },
  { number: 36, slug: "ya-sin", latinName: "Ya-Sin", arabicName: "يس", totalAyahs: 83, revelation: "Makkiyah" },
  { number: 55, slug: "ar-rahman", latinName: "Ar-Rahman", arabicName: "الرحمن", totalAyahs: 78, revelation: "Madaniyah" },
  { number: 67, slug: "al-mulk", latinName: "Al-Mulk", arabicName: "الملك", totalAyahs: 30, revelation: "Makkiyah" },
  { number: 112, slug: "al-ikhlas", latinName: "Al-Ikhlas", arabicName: "الإخلاص", totalAyahs: 4, revelation: "Makkiyah" },
];

const feedPosts: FeedPostPreview[] = [
  {
    id: "post-1",
    author: {
      name: baseUsers[0].name,
      username: baseUsers[0].username,
      imageUrl: baseUsers[0].imageUrl,
      isVerified: baseUsers[0].isVerified,
    },
    excerpt:
      "Catatan kajian subuh tadi pagi: menjaga niat dalam menuntut ilmu berarti juga menjaga cara kita menulis, membagikan, dan mengamalkan ilmu itu sendiri.",
    createdAt: nowIso,
    likes: 57,
    comments: 12,
    quote: ayahOfDay,
  },
  {
    id: "post-2",
    author: {
      name: baseUsers[2].name,
      username: baseUsers[2].username,
      imageUrl: baseUsers[2].imageUrl,
      isVerified: baseUsers[2].isVerified,
    },
    excerpt:
      "Ringkasan ringkas dari sesi murajaah: target kecil yang konsisten lebih mudah dijaga daripada target besar yang tidak terukur.",
    createdAt: nowIso,
    likes: 34,
    comments: 6,
  },
];

const hadithBooks: HadithBookSummary[] = [
  { slug: "bukhari", name: "Shahih Bukhari", narrator: "Imam Bukhari", totalItems: 7563 },
  { slug: "muslim", name: "Shahih Muslim", narrator: "Imam Muslim", totalItems: 3033 },
  { slug: "abu-dawud", name: "Sunan Abu Dawud", narrator: "Imam Abu Dawud", totalItems: 5274 },
  { slug: "tirmidzi", name: "Sunan Tirmidzi", narrator: "Imam Tirmidzi", totalItems: 3956 },
];

function createFollowShape(users: CurrentUser[]): PaginatedResponse<FollowUser> {
  return {
    data: users.map((user) => ({
      id: user.id,
      name: user.name,
      username: user.username,
      imageUrl: user.imageUrl,
      isVerified: user.isVerified,
    })),
    meta: {
      page: 1,
      pageSize: users.length,
      total: users.length,
      hasMore: false,
    },
  };
}

function createLandingSnapshot(): LandingSnapshot {
  return {
    stats: [
      { label: "Komunitas aktif", value: "128+", caption: "Majelis, halaqah, dan grup pembelajaran yang siap berkembang." },
      { label: "Kutipan dibagikan", value: "3.4k", caption: "Cuplikan ayat dan ringkasan kajian dalam ritme sosial yang tenang." },
      { label: "Bookmark ilmu", value: "9.8k", caption: "Ayat dan hadist yang disimpan untuk murajaah personal." },
    ],
    dailyAyah: ayahOfDay,
    featuredGroups,
    featuredPost: feedPosts[0],
  };
}

function createSessions(users: CurrentUser[]) {
  return {
    "token-user-1": users[0].id,
    "token-user-2": users[1].id,
  };
}

function createCredentials(users: CurrentUser[]) {
  return {
    "ilmuna@gmail.com": { password: "10203040", userId: users[0].id },
    "demo@ilmuna.id": { password: "password123", userId: users[0].id },
    "fauzan@ilmuna.id": { password: "password123", userId: users[1].id },
  } satisfies Record<string, CredentialRecord>;
}

function createMockDb(): MockDb {
  const users = structuredClone(baseUsers);

  return {
    users,
    credentials: createCredentials(users),
    sessions: createSessions(users),
    landingSnapshot: createLandingSnapshot(),
    feedPosts: structuredClone(feedPosts),
    quranSurahs: structuredClone(quranSurahs),
    ayahOfDay: structuredClone(ayahOfDay),
    hadithBooks: structuredClone(hadithBooks),
    groups: structuredClone(featuredGroups),
    followers: {
      "salsabila.nur": createFollowShape([users[1], users[2]]),
      "ahmad.fauzan": createFollowShape([users[0]]),
    },
    following: {
      "salsabila.nur": createFollowShape([users[2]]),
      "ahmad.fauzan": createFollowShape([users[0], users[2]]),
    },
    notifications: {
      [users[0].id]: { unreadCount: 4 },
      [users[1].id]: { unreadCount: 7 },
      [users[2].id]: { unreadCount: 2 },
    },
  };
}

let mockDb = createMockDb();

export function getMockDb() {
  return mockDb;
}

export function resetMockDb() {
  mockDb = createMockDb();
}

export function getUserByToken(token: string | null | undefined) {
  if (!token) return null;
  const userId = mockDb.sessions[token];
  return mockDb.users.find((user) => user.id === userId) ?? null;
}

export function issueSessionForUser(user: CurrentUser): AuthSession {
  const accessToken = `token-${user.id}-${createRandomSegment()}`;
  mockDb.sessions[accessToken] = user.id;

  return {
    accessToken,
    refreshToken: `refresh-${accessToken}`,
    expiresAt: "2026-06-18T08:00:00.000Z",
    user,
  };
}

export function getDefaultUser() {
  return mockDb.users[0];
}
