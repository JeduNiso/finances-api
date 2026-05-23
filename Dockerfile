FROM php:8.4-cli-alpine

# System deps
RUN apk add --no-cache \
    git unzip curl bash \
    libpng-dev freetype-dev libjpeg-turbo-dev \
    icu-dev oniguruma-dev \
    nodejs npm

# PHP extensions
RUN docker-php-ext-install pdo pdo_mysql bcmath mbstring intl

# Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY . .

# PHP & Node deps + build assets
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist
RUN npm ci && npm run build
