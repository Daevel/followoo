#!/usr/bin/env bash
set -euo pipefail

# Render's Start Command for both followoo-api and followoo-api-preview
# calls this script (see backend/README.md's "Applying migrations in
# deploy" section for why). It applies any pending Alembic migrations
# against this service's real database before starting the API.
#
# Safe to run on every boot, not just real deploys (restarts, scaling
# events included): alembic upgrade head is a no-op when the database is
# already at `head`.
#
# set -e means a failed migration stops this script here - uvicorn never
# starts, the instance never becomes healthy, and Render keeps routing
# traffic to the previous (working) version instead of cutting over to
# a broken one.
#
# Assumes the working directory is backend/ (Render's Root Directory
# setting for both services, consistent with the Start Command this
# replaces not using any `cd backend &&` prefix).

alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port "$PORT"
