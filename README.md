# Backend Palacio de Ferias

Este proyecto es un backend basado en Node.js y Express, utilizando Firebase para la gestión de datos y autenticación. Proporciona endpoints para la autenticación de usuarios y la gestión de datos, con validación mediante JWT.

## Dependencias

El proyecto utiliza las siguientes dependencias principales:

- **express**: Para el servidor y la gestión de rutas.
- **firebase-admin**: Para interactuar con Firebase (FireStore).
- **jsonwebtoken**: Para la creación y verificación de tokens JWT.
- **bcryptjs**: Para el hashing y la verificación de contraseñas.
- **dotenv**: Para la gestión de variables de entorno.
- **cors**: Para manejar las políticas de seguridad entre dominios.

## Estructura del Proyecto

/config firebaseConfig.js # Configuración de Firebase

/controllers userController.js # Controlador de operaciones relacionadas con usuarios

/middlewares authMiddleware.js # Middleware de autenticación (verificación de tokens JWT) errorMiddleware.js # Middleware de manejo de errores

/routes auth.js # Rutas de autenticación (login) users.js # Rutas para la gestión de usuarios

app.js # Punto de entrada de la aplicación


## Configuración

1. Clona el repositorio y asegúrate de tener instalado **Node.js**.
2. Instala las dependencias ejecutando `npm install`.
3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:
   FIREBASE_KEY_PATH=./palacio-de-ferias-firebase-adminsdk-k83w1-39fe943ebb.json
   SECRET_KEY=tu_secreto_para_jwt

4. Asegúrate de que el archivo de claves de Firebase esté ubicado en la ruta correcta y el archivo `.env` esté configurado.

## Endpoints

### Autenticación (auth.js)

- **POST /auth/login**: Permite a un usuario autenticarse con nombre y contraseña. Retorna un token JWT si las credenciales son válidas.

  **Body (JSON):**
  ```json
  {
    "nombre": "usuario",
    "contraseña": "password"
  }
Respuesta (JSON):

  {
    "token": "token_jwt_generado"
  }

###Gestión de Usuarios (users.js)
Todos los endpoints de esta sección requieren un token JWT válido en el header de autorización (Authorization: Bearer <token>).

-**POST /users/: Crea un nuevo usuario.

Body (JSON):

{
  "nombre": "usuario",
  "email": "correo@example.com",
  "contraseña": "password",
  "rol": "admin"
}

-**GET /users/: Obtiene la lista de todos los usuarios.

-**GET /users/{id}
: Obtiene los datos de un usuario específico por su ID.

-**PUT /users/
: Actualiza los datos de un usuario.

-**DELETE /users/
: Elimina un usuario por su ID.


Exactamente, toda la información que te he proporcionado previamente debe ir en el archivo README.md. Este archivo es el que verán los usuarios cuando visiten tu repositorio en GitHub y será la guía principal para entender cómo configurar y utilizar tu proyecto.

Instrucciones para organizar el contenido en README.md:
Título del proyecto: Comienza con un título descriptivo de tu proyecto.

Descripción del proyecto: Una breve descripción de lo que hace tu backend y cuál es su propósito.

Dependencias: Indica las principales dependencias que el proyecto utiliza (express, firebase-admin, jsonwebtoken, bcryptjs, etc.).

Estructura del proyecto: Proporciona una vista general de la estructura del proyecto para que los desarrolladores puedan orientarse fácilmente.

Configuración: Explica cómo configurar el proyecto localmente, incluyendo las variables de entorno y los archivos de configuración.

Endpoints: Incluye detalles sobre los endpoints principales de la API, como /auth/login, /users, etc., y cómo utilizarlos.

Middlewares: Explica los middlewares que se están utilizando en el proyecto, como la autenticación JWT y el manejo de errores.

Ejecutar el proyecto: Proporciona los comandos necesarios para ejecutar el servidor en un entorno local.

Contribuciones (Opcional): Si planeas que otros colaboren en el proyecto, explica cómo pueden hacerlo.

Licencia (Opcional): Si tu proyecto tiene una licencia específica, inclúyela en esta sección.

Ejemplo de cómo quedaría el archivo README.md con toda la información proporcionada:
markdown
Copiar código
# Backend Palacio de Ferias

Este proyecto es un backend basado en Node.js y Express, utilizando Firebase para la gestión de datos y autenticación. Proporciona endpoints para la autenticación de usuarios y la gestión de datos, con validación mediante JWT.

## Dependencias

El proyecto utiliza las siguientes dependencias principales:

- **express**: Para el servidor y la gestión de rutas.
- **firebase-admin**: Para interactuar con Firebase (FireStore).
- **jsonwebtoken**: Para la creación y verificación de tokens JWT.
- **bcryptjs**: Para el hashing y la verificación de contraseñas.
- **dotenv**: Para la gestión de variables de entorno.
- **cors**: Para manejar las políticas de seguridad entre dominios.

## Estructura del Proyecto

/config firebaseConfig.js # Configuración de Firebase

/controllers userController.js # Controlador de operaciones relacionadas con usuarios

/middlewares authMiddleware.js # Middleware de autenticación (verificación de tokens JWT) errorMiddleware.js # Middleware de manejo de errores

/routes auth.js # Rutas de autenticación (login) users.js # Rutas para la gestión de usuarios

app.js # Punto de entrada de la aplicación

markdown
Copiar código

## Configuración

1. Clona el repositorio y asegúrate de tener instalado **Node.js**.
2. Instala las dependencias ejecutando `npm install`.
3. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables de entorno:

FIREBASE_KEY_PATH=./palacio-de-ferias-firebase-adminsdk-k83w1-39fe943ebb.json SECRET_KEY=tu_secreto_para_jwt

bash
Copiar código

4. Asegúrate de que el archivo de claves de Firebase esté ubicado en la ruta correcta y el archivo `.env` esté configurado.

## Endpoints

### Autenticación (auth.js)

- **POST /auth/login**: Permite a un usuario autenticarse con nombre y contraseña. Retorna un token JWT si las credenciales son válidas.

  **Body (JSON):**
  ```json
  {
    "nombre": "usuario",
    "contraseña": "password"
  }
Respuesta (JSON):

json
Copiar código
{
  "token": "token_jwt_generado"
}
Gestión de Usuarios (users.js)
Todos los endpoints de esta sección requieren un token JWT válido en el header de autorización (Authorization: Bearer <token>).

POST /users/: Crea un nuevo usuario.

Body (JSON):

json
Copiar código
{
  "nombre": "usuario",
  "email": "correo@example.com",
  "contraseña": "password",
  "rol": "admin"
}
GET /users/: Obtiene la lista de todos los usuarios.

GET /users/
: Obtiene los datos de un usuario específico por su ID.

PUT /users/
: Actualiza los datos de un usuario.

Body (JSON):

json
Copiar código
{
  "email": "nuevo_correo@example.com"
}
DELETE /users/
: Elimina un usuario por su ID.

##Middlewares
-**authMiddleware.js: Valida el token JWT antes de acceder a rutas protegidas. Si el token es inválido o no se proporciona, retorna un error 403 o 401.

-**errorMiddleware.js: Maneja cualquier error no capturado en el sistema, devolviendo un mensaje de error genérico con código 500.
