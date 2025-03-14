# Docker configuration

POSTGRES_IMAGE = bytetoy-postgres
POSTGRES_CONTAINER = bytetoy-postgres-container
POSTGRES_PORT = 5432

NEXTJS_IMAGE = bytetoy-nextjs
FASTAPI_IMAGE = bytetoy-fastapi
NEXTJS_CONTAINER = bytetoy-nextjs-container
FASTAPI_CONTAINER = bytetoy-fastapi-container
NEXTJS_PORT = 3000
FASTAPI_PORT = 8000

# Docker commands
.PHONY: pg-build pg-start pg-stop fe-build be-build fe-start fe-stop be-start be-stop d-start d-stop

pg-build:
	mkdir -p dockerfiles
	@echo "Building Docker images..."
	docker build -t postgres:latest .

pg-start:
	@echo "Starting Postgres Docker container..."
	docker run -d --name $(POSTGRES_CONTAINER) -p $(POSTGRES_PORT):5432 -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=insight postgres:latest

pg-stop:
	@echo "Stopping Postgres Docker container..."
	docker stop $(POSTGRES_CONTAINER) || true
	docker rm $(POSTGRES_CONTAINER) || true

fe-build:
	mkdir -p dockerfiles
	@echo "Building Docker images..."
	docker build -t $(NEXTJS_IMAGE) -f dockerfiles/nextjs.Dockerfile .

be-build:
	mkdir -p dockerfiles
	@echo "Building Docker images..."
	docker build -t $(FASTAPI_IMAGE) -f dockerfiles/fastapi.Dockerfile .

# Frontend specific commands
fe-start:
	@echo "Starting frontend Docker container..."
	docker run -d --name $(NEXTJS_CONTAINER) -p $(NEXTJS_PORT):3000 $(NEXTJS_IMAGE)

fe-stop:
	@echo "Stopping frontend Docker container..."
	docker stop $(NEXTJS_CONTAINER) || true
	docker rm $(NEXTJS_CONTAINER) || true

# Backend specific commands
be-start:
	@echo "Starting backend Docker container..."
	docker run -d --name $(FASTAPI_CONTAINER) -p $(FASTAPI_PORT):8000 $(FASTAPI_IMAGE)

be-stop:
	@echo "Stopping backend Docker container..."
	docker stop $(FASTAPI_CONTAINER) || true
	docker rm $(FASTAPI_CONTAINER) || true

# Combined docker commands
d-start: fe-start be-start

d-stop: fe-stop be-stop

# Direct application commands
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