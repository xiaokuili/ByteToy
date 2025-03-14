FROM python:3.10-slim

WORKDIR /app

# 设置 pip 镜像源
RUN pip install --upgrade pip \
    && pip config set global.index-url https://pypi.tuna.tsinghua.edu.cn/simple

# 安装 poetry 并设置镜像源
RUN pip install poetry \
    && poetry config virtualenvs.create false \
    && poetry config repositories.pypi https://pypi.tuna.tsinghua.edu.cn/simple

# 复制 pyproject.toml 和 poetry.lock
COPY core/pyproject.toml core/poetry.lock ./

# 安装依赖
RUN poetry install --no-interaction --no-ansi

# 复制应用代码
COPY core/ .

EXPOSE 8000

CMD ["poetry", "run", "uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]