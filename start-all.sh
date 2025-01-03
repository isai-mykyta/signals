#!/usr/bin/env bash

echo "Starting DB..."
yarn db:up

echo "Waiting for Postgres to become healthy..."

IS_HEALTHY="0"
RETRY_COUNT=0
MAX_RETRIES=10

while [ "$IS_HEALTHY" -ne 1 ] && [ "$RETRY_COUNT" -lt "$MAX_RETRIES" ]; do
  STATUS=$(docker inspect --format='{{.State.Health.Status}}' signals_postgres 2>/dev/null)
  if [ "$STATUS" == "healthy" ]; then
    IS_HEALTHY=1
    echo "Postgres is healthy!"
  else
    echo "DB not ready yet... ($RETRY_COUNT/$MAX_RETRIES)"
    ((RETRY_COUNT++))
    sleep 5
  fi
done

if [ "$IS_HEALTHY" -ne 1 ]; then
  echo "Postgres did not become healthy in time"
  exit 1
fi

echo "Running migrations..."
yarn db:migrate

if [ "$1" == "prod" ]; then
  echo "Starting API-service in production mode..."
  yarn api:start:prod
else
  echo "Starting API-service in dev/watch mode..."
  yarn api:start:dev
fi