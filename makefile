docker-compose up --build -d
docker exec -it laravel_app bash
php artisan migrate:reset
php artisan migrate
php artisan db:seed