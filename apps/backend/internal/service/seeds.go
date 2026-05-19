package service

import (
	"github.com/ilmuna/backend/internal/domain"
	"golang.org/x/crypto/bcrypt"
)

func BuildSeedData() (SeedBundle, error) {
	nowISO := "2026-05-19T08:00:00.000Z"
	jakarta := "Jakarta"
	bandung := "Bandung"
	yogyakarta := "Yogyakarta"
	website := "https://ilmuna.id"
	bio1 := "Mencatat ilmu, membagikan ringkasan, dan belajar dari pengajian rutin setiap pekan."
	bio2 := "Mengelola komunitas kajian dan kurasi materi pembuka."
	bio3 := "Suka merangkum tafsir singkat dan catatan hafalan."

	users := []domain.UserRecord{
		{
			CurrentUser: domain.CurrentUser{
				ID:             "user-1",
				Name:           "Salsabila Nur Hidayah",
				Username:       "salsabila.nur",
				Email:          "ilmuna@gmail.com",
				Role:           domain.UserRoleMember,
				Bio:            &bio1,
				ImageURL:       nil,
				Location:       &jakarta,
				Website:        &website,
				IsVerified:     true,
				EmailVerified:  true,
				FollowerCount:  128,
				FollowingCount: 42,
				GroupCount:     4,
			},
			PasswordHash: mustHash("10203040"),
		},
		{
			CurrentUser: domain.CurrentUser{
				ID:             "user-2",
				Name:           "Ahmad Fauzan",
				Username:       "ahmad.fauzan",
				Email:          "fauzan@ilmuna.id",
				Role:           domain.UserRoleAdmin,
				Bio:            &bio2,
				ImageURL:       nil,
				Location:       &bandung,
				Website:        nil,
				IsVerified:     true,
				EmailVerified:  true,
				FollowerCount:  341,
				FollowingCount: 18,
				GroupCount:     6,
			},
			PasswordHash: mustHash("password123"),
		},
		{
			CurrentUser: domain.CurrentUser{
				ID:             "user-3",
				Name:           "Nadia Kamilah",
				Username:       "nadia.kamilah",
				Email:          "nadia@ilmuna.id",
				Role:           domain.UserRoleMember,
				Bio:            &bio3,
				ImageURL:       nil,
				Location:       &yogyakarta,
				Website:        nil,
				IsVerified:     false,
				EmailVerified:  true,
				FollowerCount:  87,
				FollowingCount: 26,
				GroupCount:     3,
			},
			PasswordHash: mustHash("password123"),
		},
	}

	ayah := domain.QuranAyahPreview{
		SurahNumber: 20,
		SurahName:   "Ta Ha",
		AyahNumber:  114,
		Arabic:      "Wa qul rabbi zidni ilma",
		Translation: "Dan katakanlah, 'Ya Tuhanku, tambahkanlah kepadaku ilmu pengetahuan.'",
	}

	groups := []domain.GroupSummary{
		{
			ID:          "group-1",
			Slug:        "tafsir-subuh",
			Name:        "Tafsir Subuh",
			Description: "Ruang pengajian subuh dengan fokus ayat-ayat tarbiyah dan adab belajar.",
			MemberCount: 324,
			StudyFocus:  "Tafsir ringkas",
			IsPublic:    true,
		},
		{
			ID:          "group-2",
			Slug:        "halaqah-hafalan",
			Name:        "Halaqah Hafalan",
			Description: "Setoran hafalan mingguan, catatan murajaah, dan evaluasi progres anggota.",
			MemberCount: 198,
			StudyFocus:  "Tahfidz",
			IsPublic:    true,
		},
		{
			ID:          "group-3",
			Slug:        "kajian-akhlaq",
			Name:        "Kajian Akhlaq",
			Description: "Forum komunitas untuk berbagi rangkuman kajian akhlaq praktis.",
			MemberCount: 146,
			StudyFocus:  "Akhlaq",
			IsPublic:    true,
		},
	}

	feedPosts := []domain.FeedPostPreview{
		{
			ID: "post-1",
			Author: domain.FeedAuthor{
				Name:       users[0].Name,
				Username:   users[0].Username,
				ImageURL:   users[0].ImageURL,
				IsVerified: users[0].IsVerified,
			},
			Excerpt:   "Catatan kajian subuh tadi pagi: menjaga niat dalam menuntut ilmu berarti juga menjaga cara kita menulis, membagikan, dan mengamalkan ilmu itu sendiri.",
			CreatedAt: nowISO,
			Likes:     57,
			Comments:  12,
			Quote:     &ayah,
		},
		{
			ID: "post-2",
			Author: domain.FeedAuthor{
				Name:       users[2].Name,
				Username:   users[2].Username,
				ImageURL:   users[2].ImageURL,
				IsVerified: users[2].IsVerified,
			},
			Excerpt:   "Ringkasan ringkas dari sesi murajaah: target kecil yang konsisten lebih mudah dijaga daripada target besar yang tidak terukur.",
			CreatedAt: nowISO,
			Likes:     34,
			Comments:  6,
		},
	}

	return SeedBundle{
		Users: users,
		Followers: map[string]domain.PaginatedResponse[domain.FollowUser]{
			"salsabila.nur": buildFollowPage(users[1], users[2]),
			"ahmad.fauzan":  buildFollowPage(users[0]),
		},
		Following: map[string]domain.PaginatedResponse[domain.FollowUser]{
			"salsabila.nur": buildFollowPage(users[2]),
			"ahmad.fauzan":  buildFollowPage(users[0], users[2]),
		},
		LandingSnapshot: domain.LandingSnapshot{
			Stats: []domain.LandingStat{
				{Label: "Komunitas aktif", Value: "128+", Caption: "Majelis, halaqah, dan grup pembelajaran yang siap berkembang."},
				{Label: "Kutipan dibagikan", Value: "3.4k", Caption: "Cuplikan ayat dan ringkasan kajian dalam ritme sosial yang tenang."},
				{Label: "Bookmark ilmu", Value: "9.8k", Caption: "Ayat dan hadist yang disimpan untuk murajaah personal."},
			},
			DailyAyah:      ayah,
			FeaturedGroups: groups,
			FeaturedPost:   feedPosts[0],
		},
		FeedPosts: feedPosts,
		Groups:    groups,
		Notifications: map[string]domain.NotificationSummary{
			users[0].ID: {UnreadCount: 4},
			users[1].ID: {UnreadCount: 7},
			users[2].ID: {UnreadCount: 2},
		},
	}, nil
}

type SeedBundle struct {
	Users           []domain.UserRecord
	Followers       map[string]domain.PaginatedResponse[domain.FollowUser]
	Following       map[string]domain.PaginatedResponse[domain.FollowUser]
	LandingSnapshot domain.LandingSnapshot
	FeedPosts       []domain.FeedPostPreview
	Groups          []domain.GroupSummary
	Notifications   map[string]domain.NotificationSummary
}

func buildFollowPage(users ...domain.UserRecord) domain.PaginatedResponse[domain.FollowUser] {
	items := make([]domain.FollowUser, 0, len(users))
	for _, user := range users {
		items = append(items, domain.FollowUser{
			ID:         user.ID,
			Name:       user.Name,
			Username:   user.Username,
			ImageURL:   user.ImageURL,
			IsVerified: user.IsVerified,
		})
	}

	return domain.PaginatedResponse[domain.FollowUser]{
		Data: items,
		Meta: domain.PaginationMeta{
			Page:     1,
			PageSize: len(items),
			Total:    len(items),
			HasMore:  false,
		},
	}
}

func mustHash(password string) string {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		panic(err)
	}

	return string(hash)
}
