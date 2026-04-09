<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

# Smartory-App Backend

1. Instalar las dependencias ```yarn o yarn install```

2. Clonar el archivo .env.template y renombrar la copia a .env

3. Configurar variables de entorno

4. Poblar la base de datos ejecutando una peticion GET a 'seed'
  
      `localhost:3000/api/seed` 

5. Correr el proyecto con
```
yarn start:dev
```

## Implementaciones realizadas

 * Catalogo de productos con imagenes, productores, categorias
 * Sistema de autenticacion con JWT

## Trabajando en

 * Inventario de productos por usuario
 * Match de instrucciones con productos registrados
 * Sistema de logs
 * Y mas... 

## Stack

* NestJS
* Postgres