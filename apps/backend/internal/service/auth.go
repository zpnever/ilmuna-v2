package service

import (
	"errors"
	"strings"
	"unicode"

	"github.com/go-playground/validator/v10"
	"github.com/ilmuna/backend/internal/domain"
	"github.com/ilmuna/backend/internal/store"
	"golang.org/x/crypto/bcrypt"
)

type AuthService struct {
	users    store.UserStore
	sessions store.SessionStore
	tokens   *TokenService
	validate *validator.Validate
}

func NewAuthService(users store.UserStore, sessions store.SessionStore, tokens *TokenService) *AuthService {
	return &AuthService{
		users:    users,
		sessions: sessions,
		tokens:   tokens,
		validate: validator.New(),
	}
}

func (s *AuthService) Login(input domain.LoginPayload) (domain.AuthSession, error) {
	if err := s.validate.Struct(input); err != nil {
		return domain.AuthSession{}, validationError(err)
	}

	user, err := s.users.GetByEmail(input.Email)
	if err != nil {
		if isAppError(err) {
			return domain.AuthSession{}, domain.NewAppError(401, "INVALID_CREDENTIALS", "Email atau password tidak cocok.")
		}

		return domain.AuthSession{}, err
	}

	if bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(input.Password)) != nil {
		return domain.AuthSession{}, domain.NewAppError(401, "INVALID_CREDENTIALS", "Email atau password tidak cocok.")
	}

	return s.issueSession(*user)
}

func (s *AuthService) Register(input domain.RegisterPayload) (domain.AuthSession, error) {
	if err := s.validate.Struct(input); err != nil {
		return domain.AuthSession{}, validationError(err)
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(input.Password), bcrypt.DefaultCost)
	if err != nil {
		return domain.AuthSession{}, err
	}

	user, err := s.users.Create(input, string(hash))
	if err != nil {
		return domain.AuthSession{}, err
	}

	return s.issueSession(*user)
}

func (s *AuthService) CurrentUser(userID string) (domain.CurrentUser, error) {
	user, err := s.users.GetByID(userID)
	if err != nil {
		return domain.CurrentUser{}, err
	}

	return user.CurrentUser, nil
}

func (s *AuthService) issueSession(user domain.UserRecord) (domain.AuthSession, error) {
	accessToken, accessExpiresAt, err := s.tokens.IssueAccessToken(user.ID)
	if err != nil {
		return domain.AuthSession{}, err
	}

	refreshToken, refreshExpiresAt := s.tokens.IssueRefreshToken()
	if err := s.sessions.Save(user.ID, refreshToken, refreshExpiresAt); err != nil {
		return domain.AuthSession{}, err
	}

	return domain.AuthSession{
		AccessToken:  accessToken,
		RefreshToken: refreshToken,
		ExpiresAt:    accessExpiresAt.Format(timeLayout),
		User:         user.CurrentUser,
	}, nil
}

func validationError(err error) error {
	var validationErrors validator.ValidationErrors
	if !errors.As(err, &validationErrors) {
		return err
	}

	issues := make(map[string][]string)
	for _, validationErr := range validationErrors {
		field := lowerFirst(validationErr.Field())
		issues[field] = append(issues[field], messageForValidation(validationErr))
	}

	return &domain.AppError{
		Status:  422,
		Code:    "VALIDATION_ERROR",
		Message: "Data yang dikirim belum valid.",
		Issues:  issues,
	}
}

func messageForValidation(err validator.FieldError) string {
	switch err.Tag() {
	case "required":
		return "Field ini wajib diisi."
	case "email":
		return "Masukkan email yang valid."
	case "min":
		return "Nilai terlalu pendek."
	case "max":
		return "Nilai terlalu panjang."
	default:
		return "Nilai tidak valid."
	}
}

func lowerFirst(value string) string {
	if value == "" {
		return value
	}

	runes := []rune(value)
	runes[0] = unicode.ToLower(runes[0])
	return string(runes)
}

func isAppError(err error) bool {
	var appErr *domain.AppError
	return errors.As(err, &appErr)
}

const timeLayout = "2006-01-02T15:04:05.000Z"

var _ = strings.TrimSpace
