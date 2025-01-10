#!/usr/bin/env bash

echo "Starting Postgres..."
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

echo "Starting Redis..."
docker-compose -f docker-compose.yml up -d

echo "Waiting for Redis to become healthy..."

IS_REDIS_HEALTHY="0"
REDIS_RETRY_COUNT=0
MAX_REDIS_RETRIES=10

while [ "$IS_REDIS_HEALTHY" -ne 1 ] && [ "$REDIS_RETRY_COUNT" -lt "$MAX_REDIS_RETRIES" ]; do
  REDIS_STATUS=$(docker inspect --format='{{.State.Health.Status}}' my-redis 2>/dev/null)
  if [ "$REDIS_STATUS" == "healthy" ]; then
    IS_REDIS_HEALTHY=1
    echo "Redis is healthy!"
  else
    echo "Redis not ready yet... ($REDIS_RETRY_COUNT/$MAX_REDIS_RETRIES)"
    ((REDIS_RETRY_COUNT++))
    sleep 5
  fi
done

if [ "$IS_REDIS_HEALTHY" -ne 1 ]; then
  echo "Redis did not become healthy in time"
  exit 1
fi

if [ "$1" == "prod" ]; then
  echo "Starting services in production mode..."
  yarn concurrently "yarn api:start:prod" "yarn engine:start:prod"
else
  echo "Starting services in dev/watch mode..."
  yarn concurrently "yarn api:start:dev" "yarn engine:start:dev"
fi
