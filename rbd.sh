#!/bin/bash
docker-compose up --build -d db
cd backend
php artisan migrate:reset
php artisan migrate
php artisan db:seed
