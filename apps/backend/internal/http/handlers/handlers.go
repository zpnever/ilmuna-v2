package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ilmuna/backend/internal/domain"
	"github.com/ilmuna/backend/internal/http/respond"
	"github.com/ilmuna/backend/internal/middleware"
	"github.com/ilmuna/backend/internal/service"
)

type Handler struct {
	auth    *service.AuthService
	content *service.ContentService
	quran   *service.QuranService
	hadith  *service.HadithService
}

func New(auth *service.AuthService, content *service.ContentService, quran *service.QuranService, hadith *service.HadithService) *Handler {
	return &Handler{
		auth:    auth,
		content: content,
		quran:   quran,
		hadith:  hadith,
	}
}

func (h *Handler) Healthz(c *gin.Context) {
	respond.JSON(c, http.StatusOK, gin.H{"status": "ok"})
}

func (h *Handler) APIHealth(c *gin.Context) {
	respond.JSON(c, http.StatusOK, gin.H{
		"status":  "ok",
		"service": "ilmuna-backend",
	})
}

func (h *Handler) Login(c *gin.Context) {
	var payload domain.LoginPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		respond.Error(c, &domain.AppError{
			Status:  http.StatusUnprocessableEntity,
			Code:    "VALIDATION_ERROR",
			Message: "Data yang dikirim belum valid.",
		})
		return
	}

	session, err := h.auth.Login(payload)
	if err != nil {
		respond.Error(c, err)
		return
	}

	respond.JSON(c, http.StatusOK, session)
}

func (h *Handler) Register(c *gin.Context) {
	var payload domain.RegisterPayload
	if err := c.ShouldBindJSON(&payload); err != nil {
		respond.Error(c, &domain.AppError{
			Status:  http.StatusUnprocessableEntity,
			Code:    "VALIDATION_ERROR",
			Message: "Data yang dikirim belum valid.",
		})
		return
	}

	session, err := h.auth.Register(payload)
	if err != nil {
		respond.Error(c, err)
		return
	}

	respond.JSON(c, http.StatusCreated, session)
}

func (h *Handler) Logout(c *gin.Context) {
	respond.NoContent(c)
}

func (h *Handler) CurrentUser(c *gin.Context) {
	user, ok := middleware.CurrentUser(c)
	if !ok {
		respond.Error(c, domain.NewAppError(http.StatusUnauthorized, "UNAUTHORIZED", "Silakan login untuk melanjutkan."))
		return
	}

	respond.JSON(c, http.StatusOK, user)
}

func (h *Handler) Landing(c *gin.Context) {
	snapshot, err := h.content.LandingSnapshot()
	if err != nil {
		respond.Error(c, err)
		return
	}

	respond.JSON(c, http.StatusOK, snapshot)
}

func (h *Handler) Feed(c *gin.Context) {
	posts, err := h.content.FeedPreview()
	if err != nil {
		respond.Error(c, err)
		return
	}

	respond.JSON(c, http.StatusOK, posts)
}

func (h *Handler) QuranSummaries(c *gin.Context) {
	respond.JSON(c, http.StatusOK, h.quran.SurahSummaries())
}

func (h *Handler) AyahOfTheDay(c *gin.Context) {
	respond.JSON(c, http.StatusOK, h.quran.AyahOfTheDay())
}

func (h *Handler) HadithBooks(c *gin.Context) {
	respond.JSON(c, http.StatusOK, h.hadith.Books())
}

func (h *Handler) Groups(c *gin.Context) {
	groups, err := h.content.Groups()
	if err != nil {
		respond.Error(c, err)
		return
	}

	respond.JSON(c, http.StatusOK, groups)
}

func (h *Handler) Notifications(c *gin.Context) {
	user, _ := middleware.CurrentUser(c)
	summary, err := h.content.NotificationSummary(user.ID)
	if err != nil {
		respond.Error(c, err)
		return
	}

	respond.JSON(c, http.StatusOK, summary)
}

func (h *Handler) UserProfile(c *gin.Context) {
	user, err := h.content.Profile(c.Param("username"))
	if err != nil {
		respond.Error(c, err)
		return
	}

	respond.JSON(c, http.StatusOK, user)
}

func (h *Handler) UserFollowers(c *gin.Context) {
	response, err := h.content.Followers(c.Param("username"))
	if err != nil {
		respond.Error(c, err)
		return
	}

	respond.JSON(c, http.StatusOK, response)
}

func (h *Handler) UserFollowing(c *gin.Context) {
	response, err := h.content.Following(c.Param("username"))
	if err != nil {
		respond.Error(c, err)
		return
	}

	respond.JSON(c, http.StatusOK, response)
}
