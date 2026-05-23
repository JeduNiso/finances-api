# Stage 1: get Node.js 22 from official image (avoid NodeSource script)
FROM node:22-bookworm-slim AS node_stage

# Stage 2: PHP app
FROM php:8.4-cli-bookworm

# Copy Node.js + npm from official node image
COPY --from=node_stage /usr/local/bin/node /usr/local/bin/node
COPY --from=node_stage /usr/local/bin/npm  /usr/local/bin/npm
COPY --from=node_stage /usr/local/bin/npx  /usr/local/bin/npx
COPY --from=node_stage /usr/local/lib/node_modules /usr/local/lib/node_modules

# System deps
RUN apt-get update && apt-get install -y \
    git unzip curl ca-certificates \
    libicu-dev libonig-dev \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions (mysqlnd)
RUN docker-php-ext-install pdo_mysql bcmath mbstring intl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# PHP & Node deps + build assets
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist
RUN npm ci && npm run build
