# /server/Dockerfile

# 1. Use the official PHP FPM image (Required for Nginx)
FROM php:8.4-fpm

# 2. Set environment variables for user mapping
ARG UID=1000
ARG GID=1000

# 3. Install system dependencies and robust libraries
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    unzip \
    libpq-dev \
    libonig-dev \
    libxml2-dev \
    libzip-dev \
    && docker-php-ext-install pdo pdo_pgsql pgsql mbstring exif pcntl bcmath zip \
    && curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

# 4. Create the 'www' group and user to prevent file permission issues on Windows
RUN groupadd -g ${GID} www && \
    useradd -m -u ${UID} -g www -s /bin/bash www

# 5. Set the working directory
WORKDIR /var/www/html

# 6. Copy only composer files first (caching trick!)
COPY --chown=www:www composer.json composer.lock ./

# 7. Install Composer dependencies
RUN composer install --optimize-autoloader --no-scripts

# 8. Copy the rest of the application code
COPY --chown=www:www . .

# 9. Switch to the non-root user for security
USER www

# 10. Expose the FPM port
EXPOSE 9000

# 11. Start the FPM server
CMD ["php-fpm"]