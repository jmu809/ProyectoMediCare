/* export const environment = {
  production: true,
  //apiUrl: 'http://localhost:80/api', // Ajusta esta URL según tu configuración de producción
  apiUrl: 'http://localhost:8000/api', // Ajusta esta URL según tu configuración de producción
}; */
export const environment = {
  production: false,
  apiUrl: 'http://localhost/api',
  // Usamos el puerto 80 porque nginx está mapeado ahí
};
