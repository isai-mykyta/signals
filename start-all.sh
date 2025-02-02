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

echo "Starting MongoDB..."

IS_MONGO_HEALTHY="0"
MONGO_RETRY_COUNT=0
MAX_MONGO_RETRIES=10

echo "Waiting for MongoDB to become healthy..."
yarn mongodb:up

while [ "$IS_MONGO_HEALTHY" -ne 1 ] && [ "$MONGO_RETRY_COUNT" -lt "$MAX_MONGO_RETRIES" ]; do
  MONGO_STATUS=$(docker inspect --format='{{.State.Health.Status}}' signals_mongodb 2>/dev/null)
  if [ "$MONGO_STATUS" == "healthy" ]; then
    IS_MONGO_HEALTHY=1
    echo "MongoDB is healthy!"
  else
    echo "MongoDB not ready yet... ($MONGO_RETRY_COUNT/$MAX_MONGO_RETRIES)"
    ((MONGO_RETRY_COUNT++))
    sleep 5
  fi
done

if [ "$IS_MONGO_HEALTHY" -ne 1 ]; then
  echo "MongoDB did not become healthy in time"
  exit 1
fi


echo "Starting RabbitMQ..."
# Start only the RabbitMQ service defined in your docker-compose.yml
docker-compose -f docker-compose.yml up -d rmq

echo "Waiting for RabbitMQ to become healthy..."

IS_RMQ_HEALTHY="0"
RMQ_RETRY_COUNT=0
MAX_RMQ_RETRIES=10

while [ "$IS_RMQ_HEALTHY" -ne 1 ] && [ "$RMQ_RETRY_COUNT" -lt "$MAX_RMQ_RETRIES" ]; do
  RMQ_STATUS=$(docker inspect --format='{{.State.Health.Status}}' rmq 2>/dev/null)
  if [ "$RMQ_STATUS" == "healthy" ]; then
    IS_RMQ_HEALTHY=1
    echo "RabbitMQ is healthy!"
  else
    echo "RabbitMQ not ready yet... ($RMQ_RETRY_COUNT/$MAX_RMQ_RETRIES)"
    ((RMQ_RETRY_COUNT++))
    sleep 5
  fi
done

if [ "$IS_RMQ_HEALTHY" -ne 1 ]; then
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
