package memory

import (
	"fmt"
	"sync"
	"time"

	"github.com/google/uuid"
	"github.com/ilmuna/backend/internal/domain"
)

type Store struct {
	mu            sync.RWMutex
	usersByID     map[string]domain.UserRecord
	userIDsByMail map[string]string
	userIDsByName map[string]string
	followers     map[string]domain.PaginatedResponse[domain.FollowUser]
	following     map[string]domain.PaginatedResponse[domain.FollowUser]
	sessions      map[string]domain.SessionRecord
	content       seededContent
}

type SeedInput struct {
	Users           []domain.UserRecord
	Followers       map[string]domain.PaginatedResponse[domain.FollowUser]
	Following       map[string]domain.PaginatedResponse[domain.FollowUser]
	LandingSnapshot domain.LandingSnapshot
	FeedPosts       []domain.FeedPostPreview
	Groups          []domain.GroupSummary
	Notifications   map[string]domain.NotificationSummary
}

type seededContent struct {
	landingSnapshot domain.LandingSnapshot
	feedPosts       []domain.FeedPostPreview
	groups          []domain.GroupSummary
	notifications   map[string]domain.NotificationSummary
}

func New(seed SeedInput) *Store {
	usersByID := make(map[string]domain.UserRecord, len(seed.Users))
	userIDsByMail := make(map[string]string, len(seed.Users))
	userIDsByName := make(map[string]string, len(seed.Users))

	for _, user := range seed.Users {
		usersByID[user.ID] = user
		userIDsByMail[user.Email] = user.ID
		userIDsByName[user.Username] = user.ID
	}

	return &Store{
		usersByID:     usersByID,
		userIDsByMail: userIDsByMail,
		userIDsByName: userIDsByName,
		followers:     seed.Followers,
		following:     seed.Following,
		sessions:      make(map[string]domain.SessionRecord),
		content: seededContent{
			landingSnapshot: seed.LandingSnapshot,
			feedPosts:       seed.FeedPosts,
			groups:          seed.Groups,
			notifications:   seed.Notifications,
		},
	}
}

func (s *Store) GetByID(id string) (*domain.UserRecord, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	user, ok := s.usersByID[id]
	if !ok {
		return nil, domain.NewAppError(404, "USER_NOT_FOUND", "Pengguna tidak ditemukan.")
	}

	copy := user
	return &copy, nil
}

func (s *Store) GetByEmail(email string) (*domain.UserRecord, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	id, ok := s.userIDsByMail[email]
	if !ok {
		return nil, domain.NewAppError(404, "USER_NOT_FOUND", "Pengguna tidak ditemukan.")
	}

	user := s.usersByID[id]
	copy := user
	return &copy, nil
}

func (s *Store) GetByUsername(username string) (*domain.UserRecord, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	id, ok := s.userIDsByName[username]
	if !ok {
		return nil, domain.NewAppError(404, "USER_NOT_FOUND", "Profil tidak ditemukan.")
	}

	user := s.usersByID[id]
	copy := user
	return &copy, nil
}

func (s *Store) Create(input domain.RegisterPayload, passwordHash string) (*domain.UserRecord, error) {
	s.mu.Lock()
	defer s.mu.Unlock()

	if _, exists := s.userIDsByMail[input.Email]; exists {
		return nil, domain.NewAppError(409, "EMAIL_EXISTS", "Email ini sudah terdaftar.")
	}

	if _, exists := s.userIDsByName[input.Username]; exists {
		return nil, domain.NewAppError(409, "USERNAME_EXISTS", "Username ini sudah dipakai.")
	}

	bio := "Akun demo baru di Ilmuna."
	location := "Indonesia"
	id := uuid.NewString()
	user := domain.UserRecord{
		CurrentUser: domain.CurrentUser{
			ID:             id,
			Name:           input.Name,
			Username:       input.Username,
			Email:          input.Email,
			Role:           domain.UserRoleMember,
			Bio:            &bio,
			ImageURL:       nil,
			Location:       &location,
			Website:        nil,
			IsVerified:     false,
			EmailVerified:  false,
			FollowerCount:  0,
			FollowingCount: 0,
			GroupCount:     0,
		},
		PasswordHash: passwordHash,
	}

	s.usersByID[id] = user
	s.userIDsByMail[input.Email] = id
	s.userIDsByName[input.Username] = id
	s.followers[input.Username] = emptyFollowPage()
	s.following[input.Username] = emptyFollowPage()
	s.content.notifications[id] = domain.NotificationSummary{UnreadCount: 1}

	copy := user
	return &copy, nil
}

func (s *Store) DefaultUser() (*domain.UserRecord, error) {
	return s.GetByEmail("ilmuna@gmail.com")
}

func (s *Store) GetFollowers(username string) (domain.PaginatedResponse[domain.FollowUser], error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if response, ok := s.followers[username]; ok {
		return response, nil
	}

	return emptyFollowPage(), nil
}

func (s *Store) GetFollowing(username string) (domain.PaginatedResponse[domain.FollowUser], error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if response, ok := s.following[username]; ok {
		return response, nil
	}

	return emptyFollowPage(), nil
}

func (s *Store) Save(userID string, refreshToken string, expiresAt time.Time) error {
	s.mu.Lock()
	defer s.mu.Unlock()

	s.sessions[refreshToken] = domain.SessionRecord{
		ID:           uuid.NewString(),
		UserID:       userID,
		RefreshToken: refreshToken,
		ExpiresAt:    expiresAt,
		CreatedAt:    time.Now().UTC(),
	}

	return nil
}

func (s *Store) LandingSnapshot() (domain.LandingSnapshot, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return s.content.landingSnapshot, nil
}

func (s *Store) FeedPreview() ([]domain.FeedPostPreview, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return append([]domain.FeedPostPreview(nil), s.content.feedPosts...), nil
}

func (s *Store) Groups() ([]domain.GroupSummary, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	return append([]domain.GroupSummary(nil), s.content.groups...), nil
}

func (s *Store) NotificationSummary(userID string) (domain.NotificationSummary, error) {
	s.mu.RLock()
	defer s.mu.RUnlock()

	if summary, ok := s.content.notifications[userID]; ok {
		return summary, nil
	}

	defaultUser, ok := s.userIDsByMail["ilmuna@gmail.com"]
	if !ok {
		return domain.NotificationSummary{}, fmt.Errorf("default user not seeded")
	}

	return s.content.notifications[defaultUser], nil
}

func emptyFollowPage() domain.PaginatedResponse[domain.FollowUser] {
	return domain.PaginatedResponse[domain.FollowUser]{
		Data: []domain.FollowUser{},
		Meta: domain.PaginationMeta{
			Page:     1,
			PageSize: 0,
			Total:    0,
			HasMore:  false,
		},
	}
}
