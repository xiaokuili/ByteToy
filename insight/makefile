# Docker configuration
COMPOSE_FILE = ./dockerfiles/docker-compose.yaml

# Ports
POSTGRES_PORT = 5432
NEXTJS_PORT = 3000
FASTAPI_PORT = 8000

# Docker Compose commands
.PHONY: d-build d-start d-stop d-down d-logs

d-build:
	@echo "Building all Docker images..."
	docker-compose -f $(COMPOSE_FILE) build

d-start:
	@echo "Starting all containers..."
	docker-compose -f $(COMPOSE_FILE) up -d

d-stop:
	@echo "Stopping all containers..."
	docker-compose -f $(COMPOSE_FILE) stop

d-down:
	@echo "Stopping and removing all containers..."
	docker-compose -f $(COMPOSE_FILE) down

d-logs:
	@echo "Viewing logs from all containers..."
	docker-compose -f $(COMPOSE_FILE) logs -f

# Service-specific commands
.PHONY: pg-start pg-stop fe-start fe-stop be-start be-stop

pg-start:
	@echo "Starting PostgreSQL container..."
	docker-compose -f $(COMPOSE_FILE) up -d postgres

pg-stop:
	@echo "Stopping PostgreSQL container..."
	docker-compose -f $(COMPOSE_FILE) stop postgres

fe-start:
	@echo "Starting frontend container..."
	docker-compose -f $(COMPOSE_FILE) up -d nextjs

fe-stop:
	@echo "Stopping frontend container..."
	docker-compose -f $(COMPOSE_FILE) stop nextjs

be-start:
	@echo "Starting backend container..."
	docker-compose -f $(COMPOSE_FILE) up -d fastapi

be-stop:
	@echo "Stopping backend container..."
	docker-compose -f $(COMPOSE_FILE) stop fastapi

# Direct application commands (for local development)
.PHONY: run-fe run-be run stop-fe stop-be stop

run-fe:
	@echo "Starting frontend application directly..."
	cd . && npm run dev &

run-be:
	@echo "Starting backend application directly..."
	cd core && uvicorn main:app --reload --port $(FASTAPI_PORT) &

run: run-fe run-be

stop-fe:
	@echo "Stopping frontend application..."
	pkill -f "npm run dev" || true

stop-be:
	@echo "Stopping backend application..."
	pkill -f "uvicorn main:app" || true

stop: stop-fe stop-be

# Combined commands
.PHONY: start

start: d-start

stop: d-stop 