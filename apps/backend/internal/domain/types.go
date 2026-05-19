package domain

import "time"

type UserRole string

const (
	UserRoleMember UserRole = "member"
	UserRoleAdmin  UserRole = "admin"
)

type ApiErrorShape struct {
	Status  int                 `json:"status"`
	Code    string              `json:"code"`
	Message string              `json:"message"`
	Issues  map[string][]string `json:"issues,omitempty"`
}

type CurrentUser struct {
	ID             string   `json:"id"`
	Name           string   `json:"name"`
	Username       string   `json:"username"`
	Email          string   `json:"email"`
	Role           UserRole `json:"role"`
	Bio            *string  `json:"bio"`
	ImageURL       *string  `json:"imageUrl"`
	Location       *string  `json:"location"`
	Website        *string  `json:"website"`
	IsVerified     bool     `json:"isVerified"`
	EmailVerified  bool     `json:"emailVerified"`
	FollowerCount  int      `json:"followerCount"`
	FollowingCount int      `json:"followingCount"`
	GroupCount     int      `json:"groupCount"`
}

type UserRecord struct {
	CurrentUser
	PasswordHash string
}

type AuthSession struct {
	AccessToken  string      `json:"accessToken"`
	RefreshToken string      `json:"refreshToken"`
	ExpiresAt    string      `json:"expiresAt"`
	User         CurrentUser `json:"user"`
}

type LandingStat struct {
	Label   string `json:"label"`
	Value   string `json:"value"`
	Caption string `json:"caption"`
}

type QuranSurahSummary struct {
	Number     int    `json:"number"`
	Slug       string `json:"slug"`
	LatinName  string `json:"latinName"`
	ArabicName string `json:"arabicName"`
	TotalAyahs int    `json:"totalAyahs"`
	Revelation string `json:"revelation"`
}

type QuranAyahPreview struct {
	SurahNumber int    `json:"surahNumber"`
	SurahName   string `json:"surahName"`
	AyahNumber  int    `json:"ayahNumber"`
	Arabic      string `json:"arabic"`
	Translation string `json:"translation"`
}

type GroupSummary struct {
	ID          string `json:"id"`
	Slug        string `json:"slug"`
	Name        string `json:"name"`
	Description string `json:"description"`
	MemberCount int    `json:"memberCount"`
	StudyFocus  string `json:"studyFocus"`
	IsPublic    bool   `json:"isPublic"`
}

type FeedAuthor struct {
	Name       string  `json:"name"`
	Username   string  `json:"username"`
	ImageURL   *string `json:"imageUrl"`
	IsVerified bool    `json:"isVerified"`
}

type FeedPostPreview struct {
	ID        string            `json:"id"`
	Author    FeedAuthor        `json:"author"`
	Excerpt   string            `json:"excerpt"`
	CreatedAt string            `json:"createdAt"`
	Likes     int               `json:"likes"`
	Comments  int               `json:"comments"`
	Quote     *QuranAyahPreview `json:"quote,omitempty"`
}

type HadithBookSummary struct {
	Slug       string `json:"slug"`
	Name       string `json:"name"`
	Narrator   string `json:"narrator"`
	TotalItems int    `json:"totalItems"`
}

type LandingSnapshot struct {
	Stats          []LandingStat    `json:"stats"`
	DailyAyah      QuranAyahPreview `json:"dailyAyah"`
	FeaturedGroups []GroupSummary   `json:"featuredGroups"`
	FeaturedPost   FeedPostPreview  `json:"featuredPost"`
}

type NotificationSummary struct {
	UnreadCount int `json:"unreadCount"`
}

type FollowUser struct {
	ID         string  `json:"id"`
	Name       string  `json:"name"`
	Username   string  `json:"username"`
	ImageURL   *string `json:"imageUrl"`
	IsVerified bool    `json:"isVerified"`
}

type PaginationMeta struct {
	Page     int  `json:"page"`
	PageSize int  `json:"pageSize"`
	Total    int  `json:"total"`
	HasMore  bool `json:"hasMore"`
}

type PaginatedResponse[T any] struct {
	Data []T            `json:"data"`
	Meta PaginationMeta `json:"meta"`
}

type LoginPayload struct {
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type RegisterPayload struct {
	Name     string `json:"name" validate:"required,min=3,max=100"`
	Username string `json:"username" validate:"required,min=3,max=50"`
	Email    string `json:"email" validate:"required,email"`
	Password string `json:"password" validate:"required,min=8"`
}

type SessionRecord struct {
	ID           string
	UserID       string
	RefreshToken string
	ExpiresAt    time.Time
	CreatedAt    time.Time
}
