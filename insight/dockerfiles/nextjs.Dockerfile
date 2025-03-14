FROM node:18-alpine

WORKDIR /app

# 安装 pnpm 并复制 package.json
RUN npm install -g pnpm && \
    pnpm --version && \
    mkdir -p /app && \
    chown -R node:node /app

# Copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Install dependencies
RUN pnpm install

# Copy the rest of the application
COPY --chown=node:node . .
COPY --chown=node:node .env.prod .env

# Build the application
RUN pnpm build

# Expose the port
EXPOSE 3000

# Start the application
CMD ["pnpm", "start"]