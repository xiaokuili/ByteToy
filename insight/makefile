# Docker configuration
NEXTJS_IMAGE = bytetoy-nextjs
FASTAPI_IMAGE = bytetoy-fastapi
NEXTJS_CONTAINER = bytetoy-nextjs-container
FASTAPI_CONTAINER = bytetoy-fastapi-container
NEXTJS_PORT = 3000
FASTAPI_PORT = 8000

# Docker commands
.PHONY: docker-build-frontend docker-build-backend docker-start-frontend docker-start-backend docker-stop-frontend docker-stop-backend docker-start docker-stop

docker-build-frontend:
	mkdir -p dockerfiles
	@echo "Building Docker images..."
	docker build -t $(NEXTJS_IMAGE) -f dockerfiles/nextjs.Dockerfile .

docker-build-backend:
	mkdir -p dockerfiles
	@echo "Building Docker images..."
	docker build -t $(FASTAPI_IMAGE) -f dockerfiles/fastapi.Dockerfile .

# Frontend specific commands
docker-start-frontend:
	@echo "Starting frontend Docker container..."
	docker run -d --name $(NEXTJS_CONTAINER) -p $(NEXTJS_PORT):3000 $(NEXTJS_IMAGE)

docker-stop-frontend:
	@echo "Stopping frontend Docker container..."
	docker stop $(NEXTJS_CONTAINER) || true
	docker rm $(NEXTJS_CONTAINER) || true

# Backend specific commands
docker-start-backend:
	@echo "Starting backend Docker container..."
	docker run -d --name $(FASTAPI_CONTAINER) -p $(FASTAPI_PORT):8000 $(FASTAPI_IMAGE)

docker-stop-backend:
	@echo "Stopping backend Docker container..."
	docker stop $(FASTAPI_CONTAINER) || true
	docker rm $(FASTAPI_CONTAINER) || true

# Combined docker commands
docker-start: docker-start-frontend docker-start-backend

docker-stop: docker-stop-frontend docker-stop-backend

# Direct application commands
.PHONY: run-frontend run-backend run stop-frontend stop-backend stop

run-frontend:
	@echo "Starting frontend application directly..."
	cd . && npm run dev &

run-backend:
	@echo "Starting backend application directly..."
	cd core && uvicorn main:app --reload --port $(FASTAPI_PORT) &

run: run-frontend run-backend

stop-frontend:
	@echo "Stopping frontend application..."
	pkill -f "npm run dev" || true

stop-backend:
	@echo "Stopping backend application..."
	pkill -f "uvicorn main:app" || true

stop: stop-frontend stop-backend

# Combined commands
.PHONY: start

start: docker-start

stop: docker-stop