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

echo "Starting RabbitMQ..."
docker-compose -f docker-compose.yml up -d

echo "Waiting for RabbitMQ to become healthy..."

IS_RABBIT_HEALTHY="0"
RABBIT_RETRY_COUNT=0
MAX_RABBIT_RETRIES=10

while [ "$IS_RABBIT_HEALTHY" -ne 1 ] && [ "$RABBIT_RETRY_COUNT" -lt "$MAX_RABBIT_RETRIES" ]; do
  RABBIT_STATUS=$(docker inspect --format='{{.State.Health.Status}}' signals_rabbitmq 2>/dev/null)
  if [ "$RABBIT_STATUS" == "healthy" ]; then
    IS_RABBIT_HEALTHY=1
    echo "RabbitMQ is healthy!"
  else
    echo "RabbitMQ not ready yet... ($RABBIT_RETRY_COUNT/$MAX_RABBIT_RETRIES)"
    ((RABBIT_RETRY_COUNT++))
    sleep 5
  fi
done

if [ "$IS_RABBIT_HEALTHY" -ne 1 ]; then
  echo "RabbitMQ did not become healthy in time"
  exit 1
fi

if [ "$1" == "prod" ]; then
  echo "Starting services in production mode..."
  yarn concurrently "yarn api:start:prod" "yarn engine:start:prod"
else
  echo "Starting services in dev/watch mode..."
  yarn concurrently "yarn api:start:dev" "yarn engine:start:dev"
fi
