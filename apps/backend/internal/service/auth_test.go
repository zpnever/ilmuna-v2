package service

import (
	"testing"

	"github.com/ilmuna/backend/internal/domain"
	"github.com/ilmuna/backend/internal/store/memory"
)

func TestAuthServiceLoginAndRegister(t *testing.T) {
	seed, err := BuildSeedData()
	if err != nil {
		t.Fatalf("expected seed data, got error: %v", err)
	}

	mem := memory.New(memory.SeedInput{
		Users:           seed.Users,
		Followers:       seed.Followers,
		Following:       seed.Following,
		LandingSnapshot: seed.LandingSnapshot,
		FeedPosts:       seed.FeedPosts,
		Groups:          seed.Groups,
		Notifications:   seed.Notifications,
	})

	auth := NewAuthService(mem, mem, NewTokenService("access", "refresh", 60, 30))

	session, err := auth.Login(domain.LoginPayload{
		Email:    "ilmuna@gmail.com",
		Password: "10203040",
	})
	if err != nil {
		t.Fatalf("expected login to succeed, got error: %v", err)
	}

	if session.User.Email != "ilmuna@gmail.com" {
		t.Fatalf("expected ilmuna@gmail.com, got %s", session.User.Email)
	}

	registered, err := auth.Register(domain.RegisterPayload{
		Name:     "User Baru",
		Username: "user.baru",
		Email:    "baru@ilmuna.id",
		Password: "password123",
	})
	if err != nil {
		t.Fatalf("expected register to succeed, got error: %v", err)
	}

	if registered.User.Username != "user.baru" {
		t.Fatalf("expected user.baru, got %s", registered.User.Username)
	}
}
