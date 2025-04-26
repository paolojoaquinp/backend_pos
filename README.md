# Backend para aplicación POS Flutter

Backend para el sistema de Punto de Venta creado con Node.js y Express, diseñado para la aplicación móvil Flutter POS.

## Diagrama Entidad-Relación

![Diagrama E-R del proyecto](screenshots/image.png)


## Importante

**NOTA:** Este proyecto incluye excepcionalmente el archivo `.env` con fines de prueba y demostración. En un entorno de producción, este archivo nunca debería subirse a repositorios públicos. Solo se incluye para facilitar la prueba y ejecución del proyecto.

## Tecnologías utilizadas

- **Node.js**: Entorno de ejecución para JavaScript
- **Express**: Framework para la creación de APIs REST
- **PostgreSQL**: Base de datos relacional para almacenamiento persistente
- **Cors**: Middleware para habilitar CORS (Cross-Origin Resource Sharing)
- **Dotenv**: Para cargar variables de entorno desde un archivo .env

## Requisitos previos

- Node.js (v14 o superior)
- PostgreSQL instalado localmente o acceso a una instancia remota

## Cómo iniciar el proyecto

### 1. Clonar el repositorio

```bash
git clone https://github.com/paolojoaquinp/backend_pos.git
cd backend_pos
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Verificar la configuración de la base de datos

El archivo `.env` ya está incluido con la configuración necesaria. Asegúrate de que la conexión a PostgreSQL esté configurada correctamente:

```
# Conexión a través de URI (Tembo.io - instancia remota)
DATABASE_URL=postgresql://postgres:eJeRPzrEOO2Z0X5L@beauteously-shapely-dotterel.data-1.use1.tembo.io:5432/postgres?sslmode=require

# O configuración local (si prefieres usar PostgreSQL local)
# DB_USER=postgres
# DB_HOST=localhost
# DB_NAME=pos_db
# DB_PASSWORD=your_password
# DB_PORT=5432
```

### 4. Iniciar el servidor

Para desarrollo (con recarga automática):
```bash
npm run dev
```

Para producción:
```bash
npm start
```

**IMPORTANTE**: El servidor debe ejecutarse en el puerto 3000 para ser compatible con la aplicación Flutter POS. Verifica que este puerto esté disponible.

## Endpoints API disponibles

### Productos

- `GET /api/products` - Obtener todos los productos
- `GET /api/products/:id` - Obtener un producto por ID
- `GET /api/products/category/:categoryId` - Obtener productos por categoría
- `POST /api/products` - Crear un nuevo producto
- `PUT /api/products/:id` - Actualizar un producto
- `DELETE /api/products/:id` - Eliminar un producto

### Categorías

- `GET /api/categories` - Obtener todas las categorías
- `GET /api/categories/:id` - Obtener una categoría por ID
- `POST /api/categories` - Crear una nueva categoría
- `PUT /api/categories/:id` - Actualizar una categoría
- `DELETE /api/categories/:id` - Eliminar una categoría

### Endpoint de salud

- `GET /health` - Verificar el estado del servidor y la conexión a la base de datos

## Prueba de la API

Incluimos un script para probar rápidamente los endpoints:

```bash
chmod +x test_api.sh
./test_api.sh
```

También se incluye una colección de Postman (`postman_collection.json`) que puedes importar para probar la API.

## Integración con Flutter POS

Este backend es parte del proyecto Flutter POS, una aplicación móvil para punto de venta:
[https://github.com/paolojoaquinp/flutter_pos](https://github.com/paolojoaquinp/flutter_pos)

Para conectar la aplicación Flutter con este backend:
1. Asegúrate de que este servidor esté ejecutándose en el puerto 3000
2. Configura la URL base en la aplicación Flutter para que apunte a `http://TU_IP_LOCAL:3000`
3. Si estás probando en un emulador, puedes usar `http://10.0.2.2:3000` para Android o `http://localhost:3000` para iOS

## Estructura de la base de datos

El sistema implementa un esquema de base de datos con las siguientes tablas:
- `categorias`: Para almacenar las categorías de productos
- `productos`: Para almacenar la información de productos
- `usuarios` y `roles`: Para la gestión de usuarios (aún no implementado en la API)
- `ventas` y `detalle_ventas`: Para el registro de ventas (aún no implementado en la API)

La estructura completa de la base de datos se puede encontrar en el archivo `db/db.sql`. 