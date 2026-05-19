package respond

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/ilmuna/backend/internal/domain"
)

func JSON(c *gin.Context, status int, payload any) {
	c.JSON(status, payload)
}

func NoContent(c *gin.Context) {
	c.Status(http.StatusNoContent)
}

func Error(c *gin.Context, err error) {
	var appErr *domain.AppError
	if errors.As(err, &appErr) {
		c.JSON(appErr.Status, domain.ApiErrorShape{
			Status:  appErr.Status,
			Code:    appErr.Code,
			Message: appErr.Message,
			Issues:  appErr.Issues,
		})
		return
	}

	c.JSON(http.StatusInternalServerError, domain.ApiErrorShape{
		Status:  http.StatusInternalServerError,
		Code:    "INTERNAL_SERVER_ERROR",
		Message: "Terjadi kendala pada server.",
	})
}
