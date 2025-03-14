FROM node:18-alpine

WORKDIR /app

# 设置 npm 镜像源
RUN npm config set registry https://registry.npmmirror.com

# 安装 pnpm
RUN npm install -g pnpm && \
    pnpm --version && \
    mkdir -p /app && \
    chown -R node:node /app

# 设置 pnpm 镜像源
RUN pnpm config set registry https://registry.npmmirror.com

# Copy package.json and package-lock.json
COPY --chown=node:node insight/package*.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY --chown=node:node insight/. .
COPY --chown=node:node insight/.env.prod .env

# Build the application
RUN pnpm build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]