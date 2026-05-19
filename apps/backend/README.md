# Ilmuna Backend

Backend API Ilmuna dibangun dengan Go + Gin.

## Menjalankan

1. Salin `.env.example` menjadi `.env`
2. Pastikan frontend memakai:

```bash
VITE_API_BASE_URL=http://localhost:8080/api/v1
VITE_API_MOCKING=disabled
```

3. Jalankan:

```bash
go run ./cmd/api
```

## Migrasi Database

```bash
go run ./cmd/migrate
```

## Verifikasi

```bash
go test ./...
go build ./cmd/api
```

## Catatan

- Endpoint memakai prefix `/api/v1`
- Quran dan hadist dibaca dari `apps/backend/data`
- Fase awal memakai seed/in-memory store untuk beberapa domain supaya cepat terhubung ke frontend
- Akun demo bawaan: `ilmuna@gmail.com` / `10203040`
