# Followoo API

Python API for Followoo server-side features.

## Local Development

Create `backend/.env` with:

```txt
FOLLOWOO_DATABASE_URL="postgresql://..."
FOLLOWOO_CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173"
```

In production, configure `FOLLOWOO_CORS_ORIGINS` on the backend host with the
public frontend origins:

```txt
FOLLOWOO_CORS_ORIGINS="https://followoo.app,https://www.followoo.app"
```

Start the API from `backend/`:

```bash
python3 -m uvicorn app.main:app --reload --port 8000
```

Health check:

```txt
GET http://localhost:8000/health
```

Updates endpoint:

```txt
GET http://localhost:8000/updates
```
