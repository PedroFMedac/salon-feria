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
  
**Respuesta (JSON):**
```json

  {
    "token": "token_jwt_generado"
  }
````

###Gestión de Usuarios (users.js)
Todos los endpoints de esta sección requieren un token JWT válido en el header de autorización (Authorization: Bearer <token>).

-**POST /users/: Crea un nuevo usuario.

**Body (JSON):**
```json
{
  "nombre": "usuario",
  "email": "correo@example.com",
  "contraseña": "password",
  "rol": "admin"
}
````

-**GET /users/: Obtiene la lista de todos los usuarios.

-**GET /users/{id}
: Obtiene los datos de un usuario específico por su ID.

-**PUT /users/
: Actualiza los datos de un usuario.

-**DELETE /users/
: Elimina un usuario por su ID.

##Middlewares
###authMiddleware.js: Valida el token JWT antes de acceder a rutas protegidas. Si el token es inválido o no se proporciona, retorna un error 403 o 401.

###errorMiddleware.js: Maneja cualquier error no capturado en el sistema, devolviendo un mensaje de error genérico con código 500.
