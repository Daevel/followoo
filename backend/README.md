# Followoo API

Python API for Followoo server-side features.

## Local Development

Create `backend/.env` with:

```txt
FOLLOWOO_DATABASE_URL="postgresql://..."
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
