# Burger Queen - API con Node.js

![Banner Merimaithai](https://cutt.ly/qWyjJ5I)

## Índice

* [1. Resumen del proyecto](#1-resumen-del-proyecto)
* [2. Desarrollo del proyecto](#2-desarrollo-del-proyecto)
  * [2.1 API](#2.1-api)
  * [2.1 CLI](#2.1-api)
* [3. Tests](#3-tests)
* [4. Despliegue](#4-despliegue)



## 1. Resumen del proyecto

Un pequeño restaurante de hamburguesas, que está creciendo, necesita un sistema a través del cual puedan tomar pedidos usando una _tablet_, y enviarlos a la cocina para que se preparen ordenada y eficientemente.Este proyecto tiene dos áreas: interfaz web (cliente) y API (servidor). 

Nuestra clienta nos ha solicitado desarrollar la API que se debe integrar con la interfaz, que será desarrollado por otro equipo.

Para este proyecto, el objetivo es construir un servidor web que debe _servir_ `JSON` sobre `HTTP`, y desplegarlo en un servidor en la nube.


## 2. Desarrollo del proyecto

Las desarrolladoras que participaron en la creación de la API fueron Mery Vera, Mairelis Montilla y Thais Illescas.

Para realizar este servidor web, utilizamos el entorno de ejecución de Javascript, [Node.js](https://nodejs.org/), y su framework [Express](https://expressjs.com/), los contenedores de Docker y [MongoDB](https://www.mongodb.com/) como base de datos.

### 2.1. API

La clienta nos brindó una [documentación](https://laboratoria.github.io/burger-queen-api/) para armar la API a partir de los requerimientos indicados en ella (_endpoints a implementar, parámetros que se esperar y respuestas a brindar_).

Según lo establecido por la documentación, la _API_ debe exponer los siguientes endpoints:

#### `/` - `/auth`

* `GET /`
* `POST /auth`

![home-and-auth](https://cutt.ly/TWilL9S)


#### `/users`

* `GET /users`
* `GET /users/:uid`
* `POST /users`
* `PUT /users/:uid`
* `DELETE /users/:uid`

![users](https://cutt.ly/vWil14T)


#### `/products`

* `GET /products`
* `GET /products/:productid`
* `POST /products`
* `PUT /products/:productid`
* `DELETE /products/:productid`

![products](https://cutt.ly/7Wil8jJ)


#### `/orders`

* `GET /orders`
* `GET /orders/:orderId`
* `POST /orders`
* `PUT /orders/:orderId`
* `DELETE /orders/:orderId`

![orders](https://cutt.ly/XWil7Td)


### 2.2. CLI

La clienta nos solciitó que la aplicación cuente un comando **`npm start`** que se debe encargar de ejecutar nuestra aplicación node y que además pueda recibir información de configuración, como el puerto en el que escuchar, a qué base datos conectarse, etc.

#### 2.2.1 Argumentos de línea de comando

Podemos especificar el puerto en el que debe arrancar la aplicación pasando un argumento a la hora de invocar nuestro programa:

```sh
# Arranca la aplicación el puerto 8080 usando npm
npm start 8888
```

#### 2.2.2. Variables de entorno

Nuestra aplicación usa las siguientes variables de entorno:

* `PORT`: Si no se ha especificado un puerto como argumento de lína de comando, podemos usar la variable de entorno `PORT` para especificar el puerto. Valor  por defecto `8080`.
* `DB_URL`: El _string_ de conexión de _MongoDB_. Cuando ejecutemos la  aplicación en nuestra computadora (en entorno de desarrollo), podemos usar una base de datos local, pero en producción deberemos utilizar las instancias configuradas con `docker-compose` (mas sobre esto en la siguiente sección de **Deployment**)
* `JWT_SECRET`: Nuestra aplicación implementa autenticación usando JWT (JSON Web Tokens). Para poder firmar (cifrar) y verificar (descifrar) los tokens, nuestra aplicación necesita un secreto. 
* `ADMIN_EMAIL`: Opcionalmente podemos especificar un email y password para el usuario admin (root). Si estos detalles están presentes la aplicación se asegurará que exista el usuario y que tenga permisos de administrador. Valor por defecto `admin@localhost`.
* `ADMIN_PASSWORD`: Si hemos especificado un `ADMIN_EMAIL`, debemos pasar también una contraseña para el usuario admin. Valor por defecto: `changeme`.



## 3. Tests 

Al finalizar el proyecto, los tests - tanto end-to-end como las pruebas unitarias - superaron el mínimo del 90% de _statements_, _functions_, _lines_ y _branches_. 

![tests](https://cutt.ly/TWizenx)



## 4. Despliegue

Nuestra clienta nos ha manifestado que su equipo de _devops_ está siempre con
muchas tareas, por por lo que nos pide como requerimiento que la aplicación esté
configurada con `docker-compose` para que pueda ser desplegada sin dificultades
en cualquier entorno.
