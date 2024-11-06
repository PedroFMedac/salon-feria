# Backend Palacio de Ferias

Este proyecto es un backend desarrollado con Node.js y Express, utilizando Firebase para la gestión de datos y autenticación. Proporciona endpoints para la autenticación de usuarios, gestión de empresas, usuarios, videos y ofertas laborales, con validación de seguridad mediante JWT.

## Tabla de Contenidos

- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Dependencias](#dependencias)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Configuración](#configuración)
- [Rutas y Endpoints](#rutas-y-endpoints)
  - [Autenticación](#autenticación)
  - [Usuarios](#usuarios)
  - [Empresas](#empresas)
  - [Videos](#videos)
  - [Ofertas](#ofertas)
- [Manejo de Errores](#manejo-de-errores)
- [Ejecutar el Servidor](#ejecutar-el-servidor)

## Requisitos Previos

- Node.js versión 14 o superior.
- Cuenta de Firebase y un proyecto configurado con Firestore.
- Clave secreta para JWT en las variables de entorno.

## Instalación

1. Clona este repositorio en tu máquina local:

   ```bash
   git clone https://github.com/PedroFMedac/salon-feria.git
   ```

2. Navega al directorio del proyecto:

   ```bash
   cd salon-feria
   ```

3. Instala las dependencias necesarias:

   ```bash
   npm install
   ```

## Dependencias

Este proyecto utiliza las siguientes dependencias principales:

- **express**: Framework para servidor y gestión de rutas.
- **firebase-admin**: Interacción con Firebase Firestore.
- **jsonwebtoken**: Creación y verificación de tokens JWT.
- **bcryptjs**: Hashing y verificación de contraseñas.
- **dotenv**: Gestión de variables de entorno.
- **cors**: Configuración de seguridad entre dominios.

## Estructura del Proyecto

```
├── config/
│   └── firebaseConfig.js         # Configuración de Firebase
├── controllers/
│   ├── authController.js         # Lógica de autenticación
│   ├── companyController.js      # Lógica de gestión de empresas
│   ├── offersController.js       # Lógica de gestión de ofertas
│   ├── userController.js         # Lógica de gestión de usuarios
│   └── videoController.js        # Lógica de gestión de videos
├── middlewares/
│   ├── authMiddleware.js         # Middleware para autenticación JWT
│   └── errorMiddleware.js        # Middleware para manejo de errores
├── routes/
│   ├── auth.js                   # Rutas de autenticación
│   ├── company.js                # Rutas de empresas
│   ├── offers.js                 # Rutas de ofertas
│   ├── users.js                  # Rutas de usuarios
│   └── video.js                  # Rutas de videos
├── .env                          # Archivo de variables de entorno
├── app.js                        # Configuración de la aplicación Express
└── README.md                     # Documentación del proyecto
```

## Configuración

1. Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

   ```
   FIREBASE_KEY_PATH=./ruta_a_tu_archivo_firebase.json
   SECRET_KEY=clave_secreta_para_jwt
   ```

2. Asegúrate de que el archivo de claves de Firebase esté en la ruta especificada en `FIREBASE_KEY_PATH`.

## Rutas y Endpoints

### Autenticación

- **POST /auth/login**: Permite a un usuario autenticarse. Retorna un token JWT si las credenciales son válidas.

  **Body (JSON):**
  ```json
  {
    "nameOrEmail": "usuario@example.com",
    "password": "password"
  }
  ```

  **Respuesta (JSON):**
  ```json
  {
    "token": "token_jwt_generado"
  }
  ```

### Usuarios

- **POST /users**: Crea un nuevo usuario.

  **Body (JSON):**
  ```json
  {
    "name": "Nombre",
    "email": "usuario@example.com",
    "password": "contraseña"
  }
  ```

### Empresas

- **GET /company**: Obtiene la lista de empresas.
- **POST /company**: Crea una nueva empresa.

  **Body (JSON):**
  ```json
  {
    "name": "Nombre de la Empresa",
    "description": "Descripción"
  }
  ```

### Videos

- **GET /videos**: Lista todos los videos.
- **POST /videos**: Agrega un nuevo video.

  **Body (JSON):**
  ```json
  {
    "url": "https://url-del-video.com",
    "title": "Título del video"
  }
  ```

### Ofertas

- **GET /offers**: Lista todas las ofertas de empleo.
- **POST /offers**: Crea una nueva oferta de empleo.

  **Body (JSON):**
  ```json
  {
    "title": "Puesto de trabajo",
    "description": "Descripción del trabajo",
    "companyID": "ID de la empresa"
  }
  ```

## Manejo de Errores

El proyecto cuenta con middlewares para la gestión de errores y validación de tokens JWT. Las respuestas de error incluyen un código de estado y un mensaje descriptivo.

## Ejecutar el Servidor

Para iniciar el servidor en modo de desarrollo:

```bash
npm start
```