#!/bin/bash

# Este script elimina contenedores, imágenes, volúmenes y redes de Docker.

echo "Deteniendo y eliminando todos los contenedores..."
docker stop $(docker ps -aq) 2>/dev/null
docker rm $(docker ps -aq) 2>/dev/null

echo "Eliminando todas las imágenes..."
docker rmi -f $(docker images -q) 2>/dev/null

echo "Eliminando todos los volúmenes..."
docker volume rm $(docker volume ls -q) 2>/dev/null

echo "Eliminando todas las redes (excepto las predeterminadas)..."
docker network rm $(docker network ls | grep -v "bridge\|host\|none" | awk '/ / { print $1 }') 2>/dev/null

echo "Prune: eliminando recursos innecesarios..."
docker system prune -af --volumes

echo "Limpieza completa de Docker realizada."
