package http

import (
	"github.com/gin-gonic/gin"
	"github.com/ilmuna/backend/internal/http/handlers"
	"github.com/ilmuna/backend/internal/middleware"
	"github.com/ilmuna/backend/internal/service"
)

func NewRouter(corsOrigin string, handler *handlers.Handler, tokens *service.TokenService, authService *service.AuthService) *gin.Engine {
	gin.SetMode(gin.ReleaseMode)

	router := gin.New()
	router.Use(gin.Logger())
	router.Use(gin.Recovery())
	router.Use(middleware.RequestID())
	router.Use(middleware.CORS(corsOrigin))

	router.GET("/healthz", handler.Healthz)

	api := router.Group("/api/v1")
	{
		api.GET("/health", handler.APIHealth)
		api.GET("/public/landing", handler.Landing)
		api.GET("/feed", handler.Feed)
		api.GET("/quran/surahs", handler.QuranSummaries)
		api.GET("/quran/ayah-of-the-day", handler.AyahOfTheDay)
		api.GET("/hadist/books", handler.HadithBooks)
		api.GET("/groups", handler.Groups)
		api.GET("/users/:username", handler.UserProfile)
		api.GET("/users/:username/followers", handler.UserFollowers)
		api.GET("/users/:username/following", handler.UserFollowing)

		api.POST("/auth/login", handler.Login)
		api.POST("/auth/register", handler.Register)
		api.POST("/auth/logout", handler.Logout)

		protected := api.Group("/")
		protected.Use(middleware.RequireAuth(tokens, authService))
		{
			protected.GET("/auth/me", handler.CurrentUser)
		}

		optional := api.Group("/")
		optional.Use(middleware.OptionalAuth(tokens, authService))
		{
			optional.GET("/notifications", handler.Notifications)
		}
	}

	return router
}
