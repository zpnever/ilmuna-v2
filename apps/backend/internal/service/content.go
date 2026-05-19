package service

import (
	"github.com/ilmuna/backend/internal/domain"
	"github.com/ilmuna/backend/internal/store"
)

type ContentService struct {
	content store.ContentStore
	users   store.UserStore
	follows store.FollowStore
}

func NewContentService(content store.ContentStore, users store.UserStore, follows store.FollowStore) *ContentService {
	return &ContentService{
		content: content,
		users:   users,
		follows: follows,
	}
}

func (s *ContentService) LandingSnapshot() (domain.LandingSnapshot, error) {
	return s.content.LandingSnapshot()
}

func (s *ContentService) FeedPreview() ([]domain.FeedPostPreview, error) {
	return s.content.FeedPreview()
}

func (s *ContentService) Groups() ([]domain.GroupSummary, error) {
	return s.content.Groups()
}

func (s *ContentService) NotificationSummary(userID string) (domain.NotificationSummary, error) {
	if userID == "" {
		defaultUser, err := s.users.DefaultUser()
		if err != nil {
			return domain.NotificationSummary{}, err
		}

		userID = defaultUser.ID
	}

	return s.content.NotificationSummary(userID)
}

func (s *ContentService) Profile(username string) (domain.CurrentUser, error) {
	user, err := s.users.GetByUsername(username)
	if err != nil {
		return domain.CurrentUser{}, err
	}

	return user.CurrentUser, nil
}

func (s *ContentService) Followers(username string) (domain.PaginatedResponse[domain.FollowUser], error) {
	return s.follows.GetFollowers(username)
}

func (s *ContentService) Following(username string) (domain.PaginatedResponse[domain.FollowUser], error) {
	return s.follows.GetFollowing(username)
}
