package service

import (
	"fmt"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

type TokenService struct {
	accessSecret     []byte
	refreshSecret    []byte
	accessTTLMinutes int
	refreshTTLDays   int
}

type TokenClaims struct {
	UserID string `json:"uid"`
	jwt.RegisteredClaims
}

func NewTokenService(accessSecret string, refreshSecret string, accessTTLMinutes int, refreshTTLDays int) *TokenService {
	return &TokenService{
		accessSecret:     []byte(accessSecret),
		refreshSecret:    []byte(refreshSecret),
		accessTTLMinutes: accessTTLMinutes,
		refreshTTLDays:   refreshTTLDays,
	}
}

func (s *TokenService) IssueAccessToken(userID string) (string, time.Time, error) {
	expiresAt := time.Now().UTC().Add(time.Duration(s.accessTTLMinutes) * time.Minute)
	claims := TokenClaims{
		UserID: userID,
		RegisteredClaims: jwt.RegisteredClaims{
			Subject:   userID,
			ExpiresAt: jwt.NewNumericDate(expiresAt),
			IssuedAt:  jwt.NewNumericDate(time.Now().UTC()),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	signed, err := token.SignedString(s.accessSecret)
	if err != nil {
		return "", time.Time{}, err
	}

	return signed, expiresAt, nil
}

func (s *TokenService) IssueRefreshToken() (string, time.Time) {
	expiresAt := time.Now().UTC().Add(time.Duration(s.refreshTTLDays) * 24 * time.Hour)
	return fmt.Sprintf("refresh-%s", uuid.NewString()), expiresAt
}

func (s *TokenService) ParseAccessToken(raw string) (*TokenClaims, error) {
	token, err := jwt.ParseWithClaims(raw, &TokenClaims{}, func(token *jwt.Token) (any, error) {
		return s.accessSecret, nil
	})
	if err != nil {
		return nil, err
	}

	claims, ok := token.Claims.(*TokenClaims)
	if !ok || !token.Valid {
		return nil, fmt.Errorf("invalid access token")
	}

	return claims, nil
}
