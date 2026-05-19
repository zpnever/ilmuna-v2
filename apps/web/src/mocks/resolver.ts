import type { CurrentUser, RegisterPayload } from "@/shared/api/contracts";
import { getDefaultUser, getMockDb, getUserByToken, issueSessionForUser } from "@/mocks/fixtures";
import { createRandomId } from "@/mocks/random";

function jsonResponse(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    status: init.status ?? 200,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });
}

function textResponse(body: string, init: ResponseInit = {}) {
  return new Response(body, {
    status: init.status ?? 200,
    headers: init.headers,
  });
}

function errorResponse(status: number, code: string, message: string, issues?: Record<string, string[]>) {
  return jsonResponse(
    {
      status,
      code,
      message,
      issues,
    },
    { status },
  );
}

async function parseJson<T>(request: Request) {
  return (await request.json()) as T;
}

function getToken(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.replace("Bearer ", "");
}

function authorizedUser(request: Request): CurrentUser | null {
  return getUserByToken(getToken(request));
}

export async function resolveMockRequest(request: Request) {
  const url = new URL(request.url);

  if (!url.pathname.startsWith("/api/v1")) {
    return null;
  }

  const path = url.pathname.replace(/^\/api\/v1\/?/, "");
  const db = getMockDb();
  const method = request.method.toUpperCase();

  if (method === "POST" && path === "auth/login") {
    const payload = await parseJson<{ email: string; password: string }>(request);
    const credential = db.credentials[payload.email];

    if (!credential || credential.password !== payload.password) {
      return errorResponse(401, "INVALID_CREDENTIALS", "Email atau password tidak cocok.");
    }

    const user = db.users.find((item) => item.id === credential.userId);

    if (!user) {
      return errorResponse(404, "USER_NOT_FOUND", "Pengguna tidak ditemukan.");
    }

    return jsonResponse(issueSessionForUser(user));
  }

  if (method === "POST" && path === "auth/register") {
    const payload = await parseJson<RegisterPayload>(request);

    if (db.credentials[payload.email]) {
      return errorResponse(409, "EMAIL_EXISTS", "Email ini sudah terdaftar.");
    }

    const user: CurrentUser = {
      id: `user-${createRandomId()}`,
      name: payload.name,
      username: payload.username,
      email: payload.email,
      role: "member",
      bio: "Akun demo baru di Ilmuna.",
      imageUrl: null,
      location: "Indonesia",
      website: null,
      isVerified: false,
      emailVerified: false,
      followerCount: 0,
      followingCount: 0,
      groupCount: 0,
    };

    db.users.unshift(user);
    db.credentials[payload.email] = {
      password: payload.password,
      userId: user.id,
    };
    db.followers[payload.username] = { data: [], meta: { page: 1, pageSize: 0, total: 0, hasMore: false } };
    db.following[payload.username] = { data: [], meta: { page: 1, pageSize: 0, total: 0, hasMore: false } };
    db.notifications[user.id] = { unreadCount: 1 };

    return jsonResponse(issueSessionForUser(user), { status: 201 });
  }

  if (method === "POST" && path === "auth/logout") {
    return textResponse("", { status: 204 });
  }

  if (method === "GET" && path === "auth/me") {
    const user = authorizedUser(request);

    if (!user) {
      return errorResponse(401, "UNAUTHORIZED", "Silakan login untuk melanjutkan.");
    }

    return jsonResponse(user);
  }

  if (method === "GET" && path === "public/landing") {
    return jsonResponse(db.landingSnapshot);
  }

  if (method === "GET" && path === "feed") {
    return jsonResponse(db.feedPosts);
  }

  if (method === "GET" && path === "quran/surahs") {
    return jsonResponse(db.quranSurahs);
  }

  if (method === "GET" && path === "quran/ayah-of-the-day") {
    return jsonResponse(db.ayahOfDay);
  }

  if (method === "GET" && path === "hadist/books") {
    return jsonResponse(db.hadithBooks);
  }

  if (method === "GET" && path === "groups") {
    return jsonResponse(db.groups);
  }

  if (method === "GET" && path === "notifications") {
    const user = authorizedUser(request) ?? getDefaultUser();
    return jsonResponse(db.notifications[user.id] ?? { unreadCount: 0 });
  }

  const userProfileMatch = path.match(/^users\/([^/]+)$/);
  if (method === "GET" && userProfileMatch) {
    const username = decodeURIComponent(userProfileMatch[1]);
    const user = db.users.find((item) => item.username === username);

    if (!user) {
      return errorResponse(404, "USER_NOT_FOUND", "Profil tidak ditemukan.");
    }

    return jsonResponse(user);
  }

  const followersMatch = path.match(/^users\/([^/]+)\/followers$/);
  if (method === "GET" && followersMatch) {
    const username = decodeURIComponent(followersMatch[1]);
    return jsonResponse(db.followers[username] ?? { data: [], meta: { page: 1, pageSize: 0, total: 0, hasMore: false } });
  }

  const followingMatch = path.match(/^users\/([^/]+)\/following$/);
  if (method === "GET" && followingMatch) {
    const username = decodeURIComponent(followingMatch[1]);
    return jsonResponse(db.following[username] ?? { data: [], meta: { page: 1, pageSize: 0, total: 0, hasMore: false } });
  }

  return null;
}
