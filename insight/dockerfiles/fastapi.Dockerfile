FROM python:3.9-slim

WORKDIR /app

# Install poetry
RUN pip install poetry

# Copy pyproject.toml and poetry.lock
COPY core/pyproject.toml core/poetry.lock ./

# Install dependencies using poetry
RUN poetry config virtualenvs.create false \
    && poetry install --no-interaction --no-ansi

# Copy the rest of the application
COPY core/ .

# Expose the port
EXPOSE 8000

# Start the application
CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]