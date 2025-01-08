# Makefile para ejecutar todos los comandos de Docker y Laravel automáticamente

.PHONY: all

all:
	docker-compose up --build -d
	docker exec -it laravel_app bash -c "php artisan migrate:reset"
	docker exec -it laravel_app bash -c "php artisan migrate"
	docker exec -it laravel_app bash -c "php artisan db:seed"
