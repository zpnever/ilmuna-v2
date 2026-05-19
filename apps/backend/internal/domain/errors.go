package domain

type AppError struct {
	Status  int
	Code    string
	Message string
	Issues  map[string][]string
}

func (e *AppError) Error() string {
	return e.Message
}

func NewAppError(status int, code string, message string) *AppError {
	return &AppError{
		Status:  status,
		Code:    code,
		Message: message,
	}
}
