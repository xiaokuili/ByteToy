# Docker configuration
COMPOSE_FILE = ./dockerfiles/docker-compose.yaml

# Ports
POSTGRES_PORT = 5432
NEXTJS_PORT = 3000
FASTAPI_PORT = 8000

# Docker Compose commands
.PHONY: build start stop down logs

build:
	@echo "Building all Docker images..."
	docker-compose -f $(COMPOSE_FILE) build

start:
	@echo "Starting all containers..."
	docker-compose -f $(COMPOSE_FILE) up -d

stop:
	@echo "Stopping all containers..."
	docker-compose -f $(COMPOSE_FILE) stop

down:
	@echo "Stopping and removing all containers..."
	docker-compose -f $(COMPOSE_FILE) down

logs:
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


