package service

import "testing"

func TestTokenServiceIssuesAndParsesAccessToken(t *testing.T) {
	tokens := NewTokenService("access-secret", "refresh-secret", 60, 30)

	token, _, err := tokens.IssueAccessToken("user-1")
	if err != nil {
		t.Fatalf("expected token to be issued, got error: %v", err)
	}

	claims, err := tokens.ParseAccessToken(token)
	if err != nil {
		t.Fatalf("expected token to parse, got error: %v", err)
	}

	if claims.UserID != "user-1" {
		t.Fatalf("expected user-1 claim, got %s", claims.UserID)
	}
}
