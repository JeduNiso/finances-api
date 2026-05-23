FROM php:8.4-cli-bookworm

# System deps
RUN apt-get update && apt-get install -y \
    git unzip curl ca-certificates gnupg \
    libpng-dev libfreetype6-dev libjpeg62-turbo-dev \
    libicu-dev libonig-dev \
    && curl -fsSL https://deb.nodesource.com/setup_22.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

# PHP extensions (mysqlnd)
RUN docker-php-ext-install pdo pdo_mysql bcmath mbstring intl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# PHP & Node deps + build assets
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist
RUN npm ci && npm run build
