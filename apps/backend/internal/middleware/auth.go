package middleware

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/ilmuna/backend/internal/domain"
	"github.com/ilmuna/backend/internal/service"
)

const userContextKey = "currentUser"

func OptionalAuth(tokens *service.TokenService, authService *service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := bearerToken(c.GetHeader("Authorization"))
		if token == "" {
			c.Next()
			return
		}

		claims, err := tokens.ParseAccessToken(token)
		if err != nil {
			c.Next()
			return
		}

		user, err := authService.CurrentUser(claims.UserID)
		if err == nil {
			c.Set(userContextKey, user)
		}

		c.Next()
	}
}

func RequireAuth(tokens *service.TokenService, authService *service.AuthService) gin.HandlerFunc {
	return func(c *gin.Context) {
		token := bearerToken(c.GetHeader("Authorization"))
		if token == "" {
			c.AbortWithStatusJSON(http.StatusUnauthorized, domain.ApiErrorShape{
				Status:  http.StatusUnauthorized,
				Code:    "UNAUTHORIZED",
				Message: "Silakan login untuk melanjutkan.",
			})
			return
		}

		claims, err := tokens.ParseAccessToken(token)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, domain.ApiErrorShape{
				Status:  http.StatusUnauthorized,
				Code:    "UNAUTHORIZED",
				Message: "Silakan login untuk melanjutkan.",
			})
			return
		}

		user, err := authService.CurrentUser(claims.UserID)
		if err != nil {
			c.AbortWithStatusJSON(http.StatusUnauthorized, domain.ApiErrorShape{
				Status:  http.StatusUnauthorized,
				Code:    "UNAUTHORIZED",
				Message: "Silakan login untuk melanjutkan.",
			})
			return
		}

		c.Set(userContextKey, user)
		c.Next()
	}
}

func CurrentUser(c *gin.Context) (domain.CurrentUser, bool) {
	value, ok := c.Get(userContextKey)
	if !ok {
		return domain.CurrentUser{}, false
	}

	user, ok := value.(domain.CurrentUser)
	return user, ok
}

func bearerToken(value string) string {
	if !strings.HasPrefix(value, "Bearer ") {
		return ""
	}

	return strings.TrimPrefix(value, "Bearer ")
}
