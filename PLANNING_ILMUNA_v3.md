# 📖 Ilmuna — Platform Pengajian & Komunitas Islam Digital
> *"Ilmu kita bersama."* — Belajar, berbagi, dan bertumbuh dalam ilmu agama.

---

## 📌 Ringkasan Proyek

**Ilmuna** adalah platform pengajian digital yang menggabungkan dua dimensi:

1. **Dimensi Grup Pengajian** — Ruang privat per komunitas pengajian (ustadz + murid): materi, tugas hafalan, dan forum internal.
2. **Dimensi Sosial Publik** — Feed personal layaknya media sosial Islami: posting konten, sisipkan kutipan Al-Quran, followers, like/dislike, komentar, share.
3. **Dimensi Referensi Islam** — Akses Al-Quran lengkap (114 surah) dan Hadist, lengkap dengan fitur bookmark.

**Arsitektur**: Fullstack terpisah — **React SPA** sebagai frontend, **Golang (Gin)** sebagai backend API.

---

## 🎯 Goals & Non-Goals

### Goals
- Platform grup pengajian terisolasi per komunitas
- Feed sosial publik (post teks + gambar + kutipan Al-Quran)
- Like, dislike, komentar, share pada post publik
- Sistem followers antar pengguna
- Profil lengkap dengan bio data
- Al-Quran lengkap (114 surah, teks Arab + terjemahan Indonesia)
- Hadist lengkap (dari berbagai kitab)
- **Bookmark ayat Al-Quran & Hadist** (disimpan per akun)
- Slash command `/quran` di editor untuk menyisipkan kutipan
- Desain minimalis modern (dominan hitam-putih), brand **Ilmuna**
- Landing page dengan efek parallax scroll
- Mobile-first, ringan, responsif (target: HP RAM 3GB)
- Auth: email/password dan Google OAuth

### Non-Goals (V1)
- Slash command `/hadist` di editor → V2
- Streaming video langsung
- Payment/donasi
- Aplikasi mobile native
- Notifikasi push browser

---

## 🛠️ Tech Stack

### Frontend

| Layer | Teknologi | Versi |
|---|---|---|
| Framework | React | ^19 |
| Build Tool | Vite | ^6 |
| Language | TypeScript | ^5 |
| Routing | TanStack Router | ^1 (latest) |
| Server State | TanStack Query | ^5 (latest) |
| UI State | Zustand | ^5 |
| Form | TanStack Form | ^1 (latest) |
| Styling | Tailwind CSS | ^4 |
| Animasi | Motion (ex Framer Motion) | ^12 |
| Rich Text Editor | Tiptap | ^2 |
| Ikon | Lucide React | latest |
| HTTP Client | Ky / Axios | latest |
| Tabel (admin) | TanStack Table | ^8 |
| Virtual List | TanStack Virtual | ^3 |
| Date | date-fns | ^4 |

### Backend

| Layer | Teknologi | Versi |
|---|---|---|
| Language | Go | ^1.23 |
| Framework | Gin | ^1.10 |
| ORM | GORM | ^1.25 *(lihat catatan)* |
| Database | PostgreSQL | ^16 |
| Auth Token | JWT (golang-jwt) | ^5 |
| Google OAuth | golang.org/x/oauth2 | latest |
| Password Hash | bcrypt (crypto/bcrypt) | stdlib |
| File Upload | Multipart (stdlib) + Local VPS Storage | — |
| Email | Resend Go SDK | latest |
| Cache | go-cache (in-memory) / Redis opsional | — |
| Validasi | go-playground/validator | ^10 |
| Env | godotenv | ^1.5 |
| Migration | golang-migrate | ^4 |
| Live Reload (dev) | Air | latest |

> **Catatan ORM**: Dua pilihan valid —
> - **GORM**: lebih cepat development, cocok untuk proyek ini yang punya banyak relasi
> - **sqlc**: generate type-safe code dari raw SQL, performa lebih baik tapi butuh tulis SQL manual
>
> **Rekomendasi**: pakai **GORM** untuk V1 (kecepatan development), pertimbangkan migrasi ke sqlc untuk endpoint kritis di V2.

### Infrastructure

| Layer | Teknologi |
|---|---|
| Database | PostgreSQL 16 (Supabase / Neon / self-hosted) |
| Frontend Hosting | Vercel / Cloudflare Pages |
| Backend Hosting | Railway / Fly.io / VPS (Docker) |
| File Storage | Local VPS (`/var/www/ilmuna/uploads`) + Nginx static serve |
| Email | Resend |
| Al-Quran Data | alquran.cloud API (di-proxy + cache di backend Go) |
| Hadist Data | api.hadith.gading.dev atau static JSON self-hosted |

---

## 🏗️ Arsitektur Sistem

```
┌─────────────────────────────────────────────────────┐
│                    CLIENT                           │
│         React + Vite + TanStack Router              │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │ TanStack │  │ TanStack │  │   Tiptap Editor  │  │
│  │  Query   │  │  Router  │  │  (/quran command)│  │
│  └────┬─────┘  └──────────┘  └──────────────────┘  │
└───────┼─────────────────────────────────────────────┘
        │ HTTP REST (JSON) + JWT in Cookie/Header
┌───────▼─────────────────────────────────────────────┐
│                   BACKEND                           │
│              Go + Gin Framework                     │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │   Auth   │  │   API    │  │  Quran/Hadist    │  │
│  │ Handlers │  │ Handlers │  │  Proxy + Cache   │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       └─────────────┴──────────────────┘            │
│                   GORM / sqlc                       │
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│                  PostgreSQL 16                      │
└─────────────────────────────────────────────────────┘
                        ↕
        alquran.cloud API  /  Hadist API / JSON
```

---

## 🗂️ Struktur Halaman & Routing (TanStack Router)

```
/                              → Landing Page (parallax)
/login                         → Login
/register                      → Register
/verify-email                  → Verifikasi email

── FEED & SOSIAL ──────────────────────────────────────
/feed                          → Feed (post following)
/explore                       → Explore post publik & grup
/post/$postId                  → Detail post + komentar

── PROFIL ─────────────────────────────────────────────
/$username                     → Profil publik
/$username/followers           → Daftar followers
/$username/following           → Daftar following
/settings/profile              → Edit profil & bio
/settings/account              → Pengaturan akun

── GRUP PENGAJIAN ─────────────────────────────────────
/groups                        → Explore grup
/groups/new                    → Buat grup
/groups/$groupSlug             → Halaman utama grup
/groups/$groupSlug/forum       → Forum diskusi
/groups/$groupSlug/forum/$postId → Detail post forum
/groups/$groupSlug/materi      → Materi pengajian
/groups/$groupSlug/tugas       → Tugas & hafalan
/groups/$groupSlug/anggota     → Daftar anggota

── AL-QURAN ───────────────────────────────────────────
/quran                         → Daftar 114 surah
/quran/$surahId                → Detail surah (per ayat)
/quran/bookmark                → Bookmark ayat saya

── HADIST ─────────────────────────────────────────────
/hadist                        → Daftar kitab hadist
/hadist/$kitab                 → Daftar hadist per kitab
/hadist/$kitab/$nomor          → Detail satu hadist
/hadist/bookmark               → Bookmark hadist saya

── ADMIN ──────────────────────────────────────────────
/admin                         → Dashboard admin
/admin/users                   → Kelola user
/admin/groups                  → Kelola grup
```

---

## 🗄️ Database Schema (SQL / GORM Struct)

### Konvensi
- Primary key: `UUID` (PostgreSQL `gen_random_uuid()`)
- Timestamps: `created_at`, `updated_at` (semua tabel)
- Soft delete: `deleted_at` (nullable) pada tabel konten utama

```sql
-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id               UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name             VARCHAR(100),
  username         VARCHAR(50)  UNIQUE NOT NULL,
  email            VARCHAR(255) UNIQUE NOT NULL,
  email_verified   BOOLEAN      DEFAULT FALSE,
  image_url        TEXT,
  cover_url        TEXT,
  password_hash    TEXT,                        -- NULL jika OAuth
  bio              VARCHAR(160),
  location         VARCHAR(100),
  website          VARCHAR(255),
  role             VARCHAR(20)  DEFAULT 'member', -- member | admin
  is_verified      BOOLEAN      DEFAULT FALSE,
  created_at       TIMESTAMPTZ  DEFAULT NOW(),
  updated_at       TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- OAUTH ACCOUNTS (Google, dst)
-- ============================================================
CREATE TABLE oauth_accounts (
  id                  UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider            VARCHAR(50) NOT NULL,  -- "google"
  provider_account_id TEXT        NOT NULL,
  access_token        TEXT,
  refresh_token       TEXT,
  expires_at          TIMESTAMPTZ,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (provider, provider_account_id)
);

-- ============================================================
-- SESSIONS (refresh token rotation)
-- ============================================================
CREATE TABLE sessions (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  refresh_token TEXT        UNIQUE NOT NULL,
  expires_at    TIMESTAMPTZ NOT NULL,
  created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FOLLOWS
-- ============================================================
CREATE TABLE follows (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id  UUID        NOT NULL REFERENCES users(id),
  following_id UUID        NOT NULL REFERENCES users(id),
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ============================================================
-- USER POSTS (Feed Sosial Publik)
-- ============================================================
CREATE TYPE post_visibility AS ENUM ('public', 'followers', 'private');

CREATE TABLE user_posts (
  id          UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id   UUID             NOT NULL REFERENCES users(id),
  content     JSONB            NOT NULL,   -- Tiptap JSON document
  images      TEXT[]           DEFAULT '{}', -- array URL path lokal (max 4), e.g. `/uploads/posts/xxx.webp`
  visibility  post_visibility  DEFAULT 'public',
  created_at  TIMESTAMPTZ      DEFAULT NOW(),
  updated_at  TIMESTAMPTZ      DEFAULT NOW(),
  deleted_at  TIMESTAMPTZ
);
CREATE INDEX idx_user_posts_author ON user_posts(author_id);
CREATE INDEX idx_user_posts_created ON user_posts(created_at DESC);

-- ============================================================
-- POST LIKES / DISLIKES
-- ============================================================
CREATE TYPE like_type AS ENUM ('like', 'dislike');

CREATE TABLE post_likes (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES user_posts(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES users(id),
  type       like_type   NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (post_id, user_id)
);

-- ============================================================
-- POST COMMENTS
-- ============================================================
CREATE TABLE post_comments (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES user_posts(id) ON DELETE CASCADE,
  author_id  UUID        NOT NULL REFERENCES users(id),
  parent_id  UUID        REFERENCES post_comments(id),  -- NULL = top-level
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_post_comments_post ON post_comments(post_id);

-- ============================================================
-- GROUPS (Pengajian)
-- ============================================================
CREATE TABLE groups (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  name        VARCHAR(100) NOT NULL,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  image_url   TEXT,
  is_public   BOOLEAN     DEFAULT TRUE,
  invite_code VARCHAR(20) UNIQUE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- GROUP MEMBERS
-- ============================================================
CREATE TYPE group_role AS ENUM ('ustadz', 'moderator', 'student');

CREATE TABLE group_members (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID        NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id    UUID        NOT NULL REFERENCES users(id),
  group_role group_role  DEFAULT 'student',
  joined_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (group_id, user_id)
);

-- ============================================================
-- FORUM POSTS (di dalam Grup)
-- ============================================================
CREATE TABLE forum_posts (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID        NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  author_id  UUID        NOT NULL REFERENCES users(id),
  title      VARCHAR(255) NOT NULL,
  content    TEXT        NOT NULL,
  is_pinned  BOOLEAN     DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- FORUM COMMENTS
-- ============================================================
CREATE TABLE forum_comments (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id    UUID        NOT NULL REFERENCES forum_posts(id) ON DELETE CASCADE,
  author_id  UUID        NOT NULL REFERENCES users(id),
  parent_id  UUID        REFERENCES forum_comments(id),
  content    TEXT        NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ============================================================
-- MATERIALS (Materi Pengajian)
-- ============================================================
CREATE TABLE materials (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id     UUID        NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  author_id    UUID        NOT NULL REFERENCES users(id),
  title        VARCHAR(255) NOT NULL,
  description  TEXT,
  content      TEXT,
  file_url     TEXT,
  file_type    VARCHAR(20),  -- "pdf" | "link" | "text"
  external_url TEXT,
  created_at   TIMESTAMPTZ  DEFAULT NOW(),
  updated_at   TIMESTAMPTZ  DEFAULT NOW()
);

-- ============================================================
-- TASKS (Tugas Hafalan)
-- ============================================================
CREATE TYPE task_type AS ENUM ('hafalan', 'catatan', 'bacaan', 'lainnya');

CREATE TABLE tasks (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id    UUID        NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  type        task_type   NOT NULL,
  surah_ref   VARCHAR(100),   -- e.g. "Al-Baqarah: 1-5"
  due_date    TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TASK SUBMISSIONS
-- ============================================================
CREATE TYPE submission_status AS ENUM ('submitted', 'reviewed', 'accepted', 'revision');

CREATE TABLE task_submissions (
  id         UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id    UUID               NOT NULL REFERENCES tasks(id),
  user_id    UUID               NOT NULL REFERENCES users(id),
  content    TEXT,
  file_url   TEXT,
  status     submission_status  DEFAULT 'submitted',
  note       TEXT,              -- feedback ustadz
  created_at TIMESTAMPTZ        DEFAULT NOW(),
  updated_at TIMESTAMPTZ        DEFAULT NOW(),
  UNIQUE (task_id, user_id)
);

-- ============================================================
-- BOOKMARKS — AL-QURAN
-- ============================================================
CREATE TABLE quran_bookmarks (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  surah_number INT         NOT NULL,   -- 1–114
  surah_name   VARCHAR(50) NOT NULL,   -- nama surah (cache, biar tidak perlu fetch API lagi)
  ayah_number  INT         NOT NULL,   -- nomor ayat
  arabic_text  TEXT        NOT NULL,   -- teks Arab (disimpan lokal agar offline-ready)
  translation  TEXT        NOT NULL,   -- terjemahan ID
  note         TEXT,                   -- catatan pribadi user untuk ayat ini
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, surah_number, ayah_number)
);
CREATE INDEX idx_quran_bookmarks_user ON quran_bookmarks(user_id);

-- ============================================================
-- BOOKMARKS — HADIST
-- ============================================================
CREATE TABLE hadist_bookmarks (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book_slug   VARCHAR(50) NOT NULL,  -- e.g. "bukhari", "muslim"
  book_name   VARCHAR(100) NOT NULL, -- nama kitab (cache)
  hadist_number INT       NOT NULL,
  arab_text   TEXT        NOT NULL,  -- teks Arab hadist (cache)
  translation TEXT        NOT NULL,  -- terjemahan
  narrator    TEXT,                  -- perawi hadist
  note        TEXT,                  -- catatan pribadi user
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, book_slug, hadist_number)
);
CREATE INDEX idx_hadist_bookmarks_user ON hadist_bookmarks(user_id);

-- ============================================================
-- NOTIFICATIONS
-- ============================================================
CREATE TABLE notifications (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  actor_id   UUID        REFERENCES users(id),  -- siapa yang memicu
  type       VARCHAR(50) NOT NULL,
  -- Tipe: new_follower | post_liked | post_commented | comment_replied
  --       new_task | new_material | task_reviewed
  message    TEXT        NOT NULL,
  link       TEXT,
  is_read    BOOLEAN     DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
```

---

## 📁 Struktur Folder

### Frontend — `ilmuna-web/`

```
ilmuna-web/
├── public/
│   └── fonts/                    # Scheherazade New, Amiri (Arab)
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── routes/                   # TanStack Router file-based routes
│   │   ├── __root.tsx
│   │   ├── index.tsx             # Landing page
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── feed.tsx
│   │   ├── explore.tsx
│   │   ├── post/
│   │   │   └── $postId.tsx
│   │   ├── $username/
│   │   │   ├── index.tsx         # Profil publik
│   │   │   ├── followers.tsx
│   │   │   └── following.tsx
│   │   ├── settings/
│   │   │   ├── profile.tsx
│   │   │   └── account.tsx
│   │   ├── groups/
│   │   │   ├── index.tsx
│   │   │   ├── new.tsx
│   │   │   └── $groupSlug/
│   │   │       ├── index.tsx
│   │   │       ├── forum/
│   │   │       ├── materi/
│   │   │       ├── tugas/
│   │   │       └── anggota/
│   │   ├── quran/
│   │   │   ├── index.tsx         # Daftar surah
│   │   │   ├── bookmark.tsx      # Bookmark ayat
│   │   │   └── $surahId.tsx      # Detail surah
│   │   ├── hadist/
│   │   │   ├── index.tsx         # Daftar kitab
│   │   │   ├── bookmark.tsx      # Bookmark hadist
│   │   │   └── $kitab/
│   │   │       ├── index.tsx
│   │   │       └── $nomor.tsx
│   │   └── admin/
│   ├── components/
│   │   ├── ui/                   # Button, Input, Modal, Badge, dll
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx       # Desktop
│   │   │   ├── BottomNav.tsx     # Mobile
│   │   │   └── RightPanel.tsx    # Saran follow (desktop)
│   │   ├── feed/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostComposer.tsx
│   │   │   ├── LikeButton.tsx
│   │   │   ├── CommentSection.tsx
│   │   │   └── ShareButton.tsx
│   │   ├── editor/
│   │   │   ├── RichEditor.tsx        # Tiptap wrapper
│   │   │   ├── QuranQuoteNode.tsx    # Custom Tiptap node
│   │   │   └── QuranPickerModal.tsx  # Popup /quran
│   │   ├── profile/
│   │   │   ├── ProfileHeader.tsx
│   │   │   └── FollowButton.tsx
│   │   ├── quran/
│   │   │   ├── SurahList.tsx
│   │   │   ├── AyahCard.tsx
│   │   │   └── BookmarkButton.tsx    # Tombol bookmark ayat
│   │   ├── hadist/
│   │   │   ├── KitabList.tsx
│   │   │   ├── HadistCard.tsx
│   │   │   └── BookmarkButton.tsx    # Tombol bookmark hadist
│   │   └── group/
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useFollow.ts
│   │   ├── usePostLike.ts
│   │   ├── useQuranBookmark.ts
│   │   ├── useHadistBookmark.ts
│   │   └── useInfiniteScroll.ts
│   ├── lib/
│   │   ├── api.ts                # Ky HTTP client instance + interceptor JWT
│   │   ├── queryClient.ts        # TanStack Query client config
│   │   └── utils.ts
│   ├── stores/
│   │   ├── authStore.ts          # Zustand — user session
│   │   └── uiStore.ts            # Zustand — modal, sidebar open state
│   └── types/
│       └── index.ts
├── index.html
├── vite.config.ts
├── tailwind.config.ts
└── package.json
```

### Backend — `ilmuna-api/`

```
ilmuna-api/
├── cmd/
│   └── main.go                   # Entry point
├── internal/
│   ├── config/
│   │   └── config.go             # Load env, DB config
│   ├── database/
│   │   ├── db.go                 # GORM init + connection pool
│   │   └── migrations/           # SQL migration files (golang-migrate)
│   ├── models/                   # GORM struct models
│   │   ├── user.go
│   │   ├── post.go
│   │   ├── group.go
│   │   ├── quran_bookmark.go
│   │   └── hadist_bookmark.go
│   ├── handlers/                 # Gin handler functions
│   │   ├── auth.go               # Register, Login, Refresh, Google OAuth
│   │   ├── users.go              # Profil, follow, update bio
│   │   ├── posts.go              # CRUD post, like, comment
│   │   ├── feed.go               # Feed & explore
│   │   ├── groups.go             # CRUD group, member management
│   │   ├── materials.go
│   │   ├── tasks.go
│   │   ├── quran.go              # Proxy Al-Quran API + bookmark
│   │   ├── hadist.go             # Proxy Hadist API + bookmark
│   │   ├── notifications.go
│   │   └── upload.go             # Local file upload handler
│   ├── middleware/
│   │   ├── auth.go               # JWT validation middleware
│   │   ├── cors.go
│   │   └── ratelimit.go
│   ├── services/                 # Business logic
│   │   ├── auth_service.go
│   │   ├── post_service.go
│   │   ├── quran_service.go      # Fetch + cache Al-Quran
│   │   ├── hadist_service.go     # Fetch + cache Hadist
│   │   └── upload_service.go     # Resize, convert WebP, simpan ke disk
│   ├── repository/               # DB query layer
│   │   ├── user_repo.go
│   │   ├── post_repo.go
│   │   ├── group_repo.go
│   │   ├── bookmark_repo.go
│   │   └── notification_repo.go
│   └── router/
│       └── router.go             # Gin router setup + semua routes
├── pkg/
│   ├── jwt/                      # JWT helper (generate, parse, refresh)
│   ├── cache/                    # In-memory cache untuk Al-Quran/Hadist
│   ├── email/                    # Resend email helper
│   └── validator/                # Custom validator helpers
├── .env.example
├── go.mod
├── go.sum
├── Dockerfile
└── air.toml                      # Live reload config
```

---

## 🔌 API Endpoints (Gin)

### Auth
```
POST   /api/v1/auth/register          Daftar dengan email/password
POST   /api/v1/auth/login             Login, return access+refresh token
POST   /api/v1/auth/refresh           Refresh access token
POST   /api/v1/auth/logout            Hapus refresh token
GET    /api/v1/auth/google            Redirect ke Google OAuth
GET    /api/v1/auth/google/callback   Callback Google OAuth
POST   /api/v1/auth/verify-email      Verifikasi email (via token)
```

### Users & Profil
```
GET    /api/v1/users/:username         Profil publik
PATCH  /api/v1/users/me               Update profil & bio (auth)
GET    /api/v1/users/:username/posts   Post milik user
GET    /api/v1/users/:username/followers
GET    /api/v1/users/:username/following
POST   /api/v1/users/:username/follow  Follow user (auth)
DELETE /api/v1/users/:username/follow  Unfollow user (auth)
```

### Feed & Posts
```
GET    /api/v1/feed                   Feed dari following (auth, paginated)
GET    /api/v1/explore                Post publik populer (paginated)
POST   /api/v1/posts                  Buat post baru (auth)
GET    /api/v1/posts/:postId          Detail post
PATCH  /api/v1/posts/:postId          Edit post (auth, owner)
DELETE /api/v1/posts/:postId          Hapus post (auth, owner/admin)
POST   /api/v1/posts/:postId/like     Like atau dislike post (auth)
DELETE /api/v1/posts/:postId/like     Hapus reaksi (auth)
GET    /api/v1/posts/:postId/comments Daftar komentar
POST   /api/v1/posts/:postId/comments Tambah komentar (auth)
DELETE /api/v1/posts/:postId/comments/:commentId Hapus komentar
```

### Groups
```
GET    /api/v1/groups                 Explore grup publik
POST   /api/v1/groups                 Buat grup baru (auth)
GET    /api/v1/groups/:slug           Detail grup
PATCH  /api/v1/groups/:slug           Edit grup (auth, ustadz)
POST   /api/v1/groups/:slug/join      Bergabung (auth)
POST   /api/v1/groups/:slug/join/:code Bergabung via kode undangan
GET    /api/v1/groups/:slug/members   Daftar anggota
PATCH  /api/v1/groups/:slug/members/:userId Ubah role anggota (ustadz)
DELETE /api/v1/groups/:slug/members/:userId Kick anggota (ustadz)

GET    /api/v1/groups/:slug/forum             Daftar post forum
POST   /api/v1/groups/:slug/forum             Buat post forum (anggota)
GET    /api/v1/groups/:slug/forum/:postId     Detail post
POST   /api/v1/groups/:slug/forum/:postId/comments

GET    /api/v1/groups/:slug/materi            Daftar materi
POST   /api/v1/groups/:slug/materi            Upload materi (ustadz)
GET    /api/v1/groups/:slug/materi/:id

GET    /api/v1/groups/:slug/tugas             Daftar tugas
POST   /api/v1/groups/:slug/tugas             Buat tugas (ustadz)
GET    /api/v1/groups/:slug/tugas/:taskId
POST   /api/v1/groups/:slug/tugas/:taskId/submit Kumpulkan tugas (student)
PATCH  /api/v1/groups/:slug/tugas/:taskId/review/:userId Review submission (ustadz)
```

### Al-Quran
```
GET    /api/v1/quran/surahs            Daftar 114 surah (cached 24h)
GET    /api/v1/quran/surahs/:number    Detail surah + ayat Arab + terjemahan ID (cached 24h)
GET    /api/v1/quran/ayah/:surah/:ayah Satu ayat spesifik (untuk editor picker)
GET    /api/v1/quran/search?q=         Cari nama surah

── Bookmark (auth required) ─────────────────────────
GET    /api/v1/quran/bookmarks         Semua bookmark ayat saya
POST   /api/v1/quran/bookmarks         Tambah bookmark ayat
DELETE /api/v1/quran/bookmarks/:id     Hapus bookmark
PATCH  /api/v1/quran/bookmarks/:id     Update catatan pada bookmark
```

### Hadist
```
GET    /api/v1/hadist/books            Daftar kitab (cached)
GET    /api/v1/hadist/books/:slug      Daftar hadist per kitab (paginated, cached)
GET    /api/v1/hadist/books/:slug/:num Satu hadist

── Bookmark (auth required) ─────────────────────────
GET    /api/v1/hadist/bookmarks        Semua bookmark hadist saya
POST   /api/v1/hadist/bookmarks        Tambah bookmark hadist
DELETE /api/v1/hadist/bookmarks/:id    Hapus bookmark
PATCH  /api/v1/hadist/bookmarks/:id    Update catatan pada bookmark
```

### Upload & Notifikasi
```
POST   /api/v1/upload/image            Upload gambar ke VPS (auth), return URL path
GET    /api/v1/notifications           Notifikasi saya (auth)
PATCH  /api/v1/notifications/read-all  Tandai semua dibaca (auth)
```

---

## 🕌 Fitur Al-Quran & Hadist Lengkap

### Halaman Al-Quran (`/quran`)

```
┌─────────────────────────────────────────────┐
│  🔍 Cari surah...              [Bookmark ▾] │
├─────────────────────────────────────────────┤
│  [1] Al-Fatihah     7 ayat   Makkiyah  ▶   │
│  [2] Al-Baqarah   286 ayat   Madaniyah ▶   │
│  [3] Ali Imran    200 ayat   Madaniyah ▶   │
│  ...                                        │
└─────────────────────────────────────────────┘
```

**Detail Surah** (`/quran/:surahId`):
- Header: nama Arab besar, nama latin, jumlah ayat, jenis (Makkiyah/Madaniyah)
- Bismillah (kecuali surah 9)
- Per ayat: nomor ayat → teks Arab (font besar, kanan) → terjemahan Indonesia → tombol bookmark 🔖 + tombol salin
- Navigasi prev/next surah
- Sticky header surah saat scroll

### Halaman Bookmark Al-Quran (`/quran/bookmark`)

```
┌─────────────────────────────────────────────┐
│  📚 Bookmark Ayat Saya          (23 ayat)   │
│  [Urutkan: Terbaru ▾]                       │
├─────────────────────────────────────────────┤
│  ╔════════════════════════════════════╗      │
│  ║ QS. Al-Baqarah (2) : 255         ║      │
│  ║  اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ ║      │
│  ║  "Allah, tidak ada Tuhan..."      ║      │
│  ║  📝 Catatan: Ayat Kursi          ║      │
│  ║  [Edit Catatan]  [Hapus Bookmark] ║      │
│  ╚════════════════════════════════════╝      │
└─────────────────────────────────────────────┘
```

### Halaman Hadist (`/hadist`)

Kitab yang tersedia (dari API):
- Shahih Bukhari, Shahih Muslim, Sunan Abu Dawud
- Sunan Tirmidzi, Sunan Nasa'i, Sunan Ibnu Majah
- Muwatha Imam Malik, Musnad Ahmad

**Detail Hadist**: teks Arab + terjemahan + perawi + nomor hadist + tombol bookmark

### Halaman Bookmark Hadist (`/hadist/bookmark`)

Sama konsepnya seperti bookmark Al-Quran, dengan field tambahan perawi hadist dan catatan pribadi.

---

## 🔐 Sistem Autentikasi (Go + JWT)

### Flow JWT
```
Login → generate access_token (15 menit) + refresh_token (30 hari)
     → simpan refresh_token di DB (tabel sessions)
     → kirim ke client:
        - access_token: httpOnly cookie ATAU Authorization header
        - refresh_token: httpOnly cookie

Request API → middleware validasi access_token
           → jika expired → client POST /auth/refresh
           → generate access_token baru, rotate refresh_token
```

### Google OAuth Flow
```
Client GET /api/v1/auth/google
  → backend redirect ke Google consent screen
  → Google callback ke /api/v1/auth/google/callback
  → backend upsert user (buat baru atau link ke akun existing)
  → redirect ke frontend dengan token
```

---

## 🗃️ File Storage — Local VPS

Semua gambar (foto profil, cover, gambar post, file materi) disimpan langsung di VPS dan di-serve via **Nginx** sebagai static file server. Tidak ada dependency ke layanan pihak ketiga.

### Struktur Direktori di VPS

```
/var/www/ilmuna/uploads/
├── avatars/
│   └── {userId}/
│       └── avatar.webp          # foto profil (selalu overwrite)
├── covers/
│   └── {userId}/
│       └── cover.webp           # foto sampul profil
├── posts/
│   └── {postId}/
│       ├── img_1.webp
│       ├── img_2.webp
│       └── ...                  # max 4 gambar per post
└── materials/
    └── {groupId}/
        └── {filename}           # PDF, dokumen materi
```

### Flow Upload di Backend (Go)

```
Client POST /api/v1/upload/image (multipart/form-data)
  │
  ├── 1. Validasi: tipe file (jpeg/png/webp/gif), ukuran max 5MB
  ├── 2. Decode image menggunakan stdlib image + imaging lib
  ├── 3. Resize: max 1200px lebar (proportional), max 800px untuk avatar
  ├── 4. Convert ke WebP (disintegration/imaging atau chai2010/webp)
  ├── 5. Simpan ke /var/www/ilmuna/uploads/{type}/{id}/
  ├── 6. Simpan path ke DB: "/uploads/posts/{postId}/img_1.webp"
  └── 7. Return URL lengkap: "https://ilmuna.id/uploads/posts/{postId}/img_1.webp"
```

### Konfigurasi Nginx

```nginx
server {
    listen 443 ssl;
    server_name ilmuna.id;

    # Static file uploads — di-serve langsung oleh Nginx, tidak lewat Go
    location /uploads/ {
        alias /var/www/ilmuna/uploads/;
        expires 30d;
        add_header Cache-Control "public, immutable";
        add_header X-Content-Type-Options nosniff;

        # Batasi tipe file yang bisa diakses
        location ~* \.(webp|jpg|jpeg|png|gif|pdf)$ {
            try_files $uri =404;
        }
    }

    # API — forward ke Go backend
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Frontend SPA
    location / {
        root /var/www/ilmuna/web;
        try_files $uri $uri/ /index.html;
    }
}
```

### Go Dependencies untuk Image Processing

```go
// Pilihan library:
// Option A — disintegration/imaging (pure Go, simple API)
import "github.com/disintegration/imaging"

// Resize + simpan sebagai WebP
img := imaging.Resize(src, 1200, 0, imaging.Lanczos)
imaging.Save(img, outputPath) // auto-detect format dari ekstensi

// Option B — jika perlu WebP spesifik: chai2010/webp
import "github.com/chai2010/webp"
webp.SaveFile(outputPath, img, &webp.Options{Lossless: false, Quality: 85})
```

### Pertimbangan & Backup

| Aspek | Catatan |
|---|---|
| Backup | Setup cronjob rsync harian ke storage sekunder / object storage (Backblaze B2, Wasabi — murah) |
| Disk usage | Monitor via `df -h`; estimasi awal 1GB/bulan tergantung volume post |
| CDN (opsional V2) | Jika traffic besar, bisa pasang Cloudflare free tier di depan Nginx untuk cache edge |
| Old files | Saat user ganti avatar/cover, file lama dihapus dari disk (cleanup di upload_service.go) |
| Security | Path traversal dicegah di Nginx + validasi nama file di Go sebelum simpan |

---

## 📡 Cache Strategy (Al-Quran & Hadist)

Karena data Al-Quran dan Hadist bersifat **statis / tidak berubah**, strategi cache agresif diterapkan:

```go
// Contoh implementasi di quran_service.go
type QuranCache struct {
    surahs    []Surah              // cache semua 114 surah
    ayahs     map[int][]Ayah       // cache per surah: surahNum → []Ayah
    mu        sync.RWMutex
    loadedAt  time.Time
}

// TTL: 24 jam untuk daftar surah, 1 jam untuk detail ayat
// Saat server start: pre-load daftar surah ke memory
// Detail surah: lazy-load saat pertama diakses, lalu cache
```

- **Daftar surah**: di-cache in-memory saat server startup (sekali saja)
- **Detail surah + ayat**: di-cache per surah, TTL 1 jam
- **Fallback**: jika API eksternal down, return cached version terakhir
- **Alternatif produksi**: Redis untuk multi-instance deployment

---

## 🎨 Desain System — Ilmuna

### Identitas Visual
- **Nama**: Ilmuna
- **Tagline**: *"Ilmu kita bersama"*
- **Logo**: Tipografi "ilmuna" dengan aksen kaligrafi pada huruf "i"

### Palet Warna
```
Background utama   : #FFFFFF
Background sekunder: #F7F7F7
Teks utama         : #111111
Teks sekunder      : #6B6B6B
Border             : #E4E4E4
Aksen primer       : #111111
Aksen emas         : #C9A84C  (kutipan Quran, ornamen, bookmark aktif)
Danger             : #DC2626  (dislike, error, hapus)
Success            : #16A34A  (accepted, terverifikasi)
```

### Tipografi
- **Heading & UI**: Inter (Google Fonts)
- **Body post**: Inter 16px, line-height 1.7
- **Arab (Quran/Hadist)**: Scheherazade New atau Amiri, `dir="rtl"`, font-size 22–26px
- **Mono**: JetBrains Mono (kode, referensi)

### Layout
- **Desktop**: 3-kolom (sidebar kiri 240px + main content + right panel 300px)
- **Tablet**: 2-kolom (sidebar icon-only + main)
- **Mobile**: 1-kolom + bottom navigation bar

---

## 🌐 Landing Page (Parallax)

```
[1] HERO
    - Parallax: pola geometri Islam SVG hitam-putih bergerak saat scroll
    - Heading: "Ilmuna" besar + tagline
    - CTA: "Mulai Gratis" & "Pelajari Lebih Lanjut"

[2] FITUR UTAMA
    - 📚 Grup Pengajian   — materi, tugas, forum privat
    - ✍️  Feed Sosial     — bagikan ilmu ke komunitas
    - 📖 Al-Quran & Hadist — baca, bookmark, kutip

[3] CUPLIKAN AYAT (live dari API)
    - 1 ayat random per load
    - Teks Arab besar + terjemahan
    - Background gelap

[4] CARA KERJA
    - Buat Akun → Ikuti Pengajian → Bagikan Ilmu
    - Step indicator animasi

[5] STATISTIK
    - Komunitas, kutipan dibagikan, ayat di-bookmark (dummy V1)

[6] CTA AKHIR + FOOTER
```

---

## 📱 Mobile Optimization (Target: HP RAM 3GB)

| Area | Strategi |
|---|---|
| Navigasi | Bottom nav mobile, sidebar desktop |
| Feed | TanStack Virtual + infinite scroll 10 item |
| Gambar | Convert ke WebP di backend (imaging lib) + lazy load |
| Font Arab | Preload Scheherazade New, subset hanya halaman Quran |
| Al-Quran list | TanStack Virtual untuk 114 surah + ribuan ayat |
| Hadist list | TanStack Virtual per kitab |
| Animasi | Motion `LazyMotion` + CSS-only parallax |
| Bundle | Code splitting per route (TanStack Router lazy) |
| Gambar post | Max 4 gambar, max 5MB per gambar, di-resize + convert WebP di server |

---

## 🗺️ Fitur per Role

### 👤 Member
- Buat akun, edit profil & bio
- Buat post publik (teks, gambar, kutipan Al-Quran)
- Like/dislike, komentar, share post
- Follow/unfollow user
- Baca Al-Quran lengkap + bookmark ayat + catatan
- Baca Hadist lengkap + bookmark hadist + catatan
- Bergabung grup pengajian
- Kumpulkan tugas, lihat materi

### 🕌 Ustadz (Group Admin)
- Semua fitur Member
- Buat & kelola grup, atur kode undangan
- Upload materi, buat tugas, review submission
- Moderasi forum grup

### ⚙️ Platform Admin
- Kelola semua user & grup
- Moderasi konten
- Statistik platform

---

## 🚀 Roadmap Pengembangan

### Phase 1 — Foundation (3–4 minggu)
- [ ] Setup repo: `ilmuna-web` (Vite + React + TanStack) & `ilmuna-api` (Go + Gin)
- [ ] PostgreSQL schema + golang-migrate setup
- [ ] Auth: register, login (JWT), Google OAuth, refresh token
- [ ] User profil & bio (CRUD)
- [ ] Sistem followers
- [ ] Halaman profil publik
- [ ] Landing page parallax

### Phase 2 — Feed Sosial (3–4 minggu)
- [ ] Post composer (teks + gambar upload ke VPS)
- [ ] PostCard: like/dislike/komentar/share
- [ ] Feed chronological + explore populer
- [ ] Halaman detail post
- [ ] Notifikasi in-app

### Phase 3 — Al-Quran & Hadist (2–3 minggu)
- [ ] Backend: proxy + cache Al-Quran API (114 surah lengkap)
- [ ] Backend: proxy + cache Hadist API (semua kitab)
- [ ] Frontend: halaman Al-Quran (surah list + detail ayat)
- [ ] Frontend: halaman Hadist (kitab list + detail)
- [ ] Bookmark ayat Al-Quran + catatan
- [ ] Bookmark hadist + catatan
- [ ] Halaman `/quran/bookmark` & `/hadist/bookmark`

### Phase 4 — Editor & Kutipan Quran (2 minggu)
- [ ] Tiptap editor integrasi di PostComposer
- [ ] Custom node `QuranQuoteNode`
- [ ] Slash command `/quran` + `QuranPickerModal`
- [ ] Render QuranQuoteBlock di PostCard

### Phase 5 — Grup Pengajian (3–4 minggu)
- [ ] CRUD Group + kode undangan
- [ ] Forum grup (post + komentar)
- [ ] Sistem Materi (teks, link, PDF)
- [ ] Sistem Tugas & Submission hafalan
- [ ] Review tugas oleh ustadz

### Phase 6 — Polish & Launch (2 minggu)
- [ ] Email notifikasi (Resend)
- [ ] SEO (Open Graph per post/profil)
- [ ] Optimasi performa mobile
- [ ] Docker + deployment setup
- [ ] Error monitoring (Sentry)
- [ ] Dark mode

### Phase 7 — V2 Ideas
- [ ] Slash command `/hadist` di editor
- [ ] Mode mushaf Al-Quran (per halaman)
- [ ] Audio tilawah
- [ ] Jadwal sholat (geolocation)
- [ ] Repost / quote post
- [ ] Leaderboard hafalan per grup
- [ ] Migrasi query kritis dari GORM ke sqlc

---

## ❓ Pertanyaan Terbuka

1. **Dislike publik**: apakah jumlah dislike ditampilkan ke semua orang, atau hanya like yang kelihatan?
2. **Username**: bisa diubah? Rekomendasi: boleh, dengan cooldown 30 hari
3. **Hadist data source**: pakai `api.hadith.gading.dev` (external) atau static JSON di repo Go (lebih cepat)?
4. **Grup public/private**: semua grup bisa di-explore, atau hanya via undangan?
5. **File materi**: upload langsung ke VPS atau hanya link eksternal (Google Drive, YouTube)?

---

## 📦 Dependencies

### Frontend (`package.json`)
```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "@tanstack/react-router": "^1",
    "@tanstack/react-query": "^5",
    "@tanstack/react-form": "^1",
    "@tanstack/react-table": "^8",
    "@tanstack/react-virtual": "^3",
    "zustand": "^5",
    "motion": "^12",
    "@tiptap/react": "^2",
    "@tiptap/starter-kit": "^2",
    "@tiptap/extension-image": "^2",
    "@tiptap/extension-placeholder": "^2",
    "lucide-react": "latest",
    "ky": "^1",
    "date-fns": "^4",
    "tailwindcss": "^4",
    "typescript": "^5"
  },
  "devDependencies": {
    "vite": "^6",
    "@vitejs/plugin-react": "^4",
    "@tanstack/router-vite-plugin": "^1"
  }
}
```

### Backend (`go.mod`)
```
require (
  github.com/gin-gonic/gin          v1.10+
  gorm.io/gorm                      v1.25+
  gorm.io/driver/postgres           v1.5+
  github.com/golang-jwt/jwt/v5      v5+
  golang.org/x/oauth2               latest
  github.com/golang-migrate/migrate/v4 v4+
  github.com/go-playground/validator/v10 v10+
  github.com/joho/godotenv          v1.5+
  github.com/disintegration/imaging  v1+  // resize + WebP conversion
  github.com/resend/resend-go/v2    v2+
  golang.org/x/crypto               latest  // bcrypt
)
```

---

*Ilmuna — living document.*
*Versi 3 — tech stack diubah ke React + Vite + TanStack / Go + Gin + GORM. Ditambahkan bookmark Al-Quran & Hadist lengkap.*
*Versi 3.1 — file storage diganti dari Cloudinary ke local VPS + Nginx static serve. Ditambahkan section detail storage, image processing (WebP), struktur direktori, dan konfigurasi Nginx.*
