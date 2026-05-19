package store

import (
	"time"

	"github.com/ilmuna/backend/internal/domain"
)

type UserStore interface {
	GetByID(id string) (*domain.UserRecord, error)
	GetByEmail(email string) (*domain.UserRecord, error)
	GetByUsername(username string) (*domain.UserRecord, error)
	Create(input domain.RegisterPayload, passwordHash string) (*domain.UserRecord, error)
	DefaultUser() (*domain.UserRecord, error)
}

type FollowStore interface {
	GetFollowers(username string) (domain.PaginatedResponse[domain.FollowUser], error)
	GetFollowing(username string) (domain.PaginatedResponse[domain.FollowUser], error)
}

type SessionStore interface {
	Save(userID string, refreshToken string, expiresAt time.Time) error
}

type ContentStore interface {
	LandingSnapshot() (domain.LandingSnapshot, error)
	FeedPreview() ([]domain.FeedPostPreview, error)
	Groups() ([]domain.GroupSummary, error)
	NotificationSummary(userID string) (domain.NotificationSummary, error)
}
