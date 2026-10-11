# Administrador de Servicios

## Descripción

Proyecto desarrollado con Node.js y módulos ESM para administrar servicios de un sistema de turnos y reservas.

Permite consultar, agregar, actualizar y eliminar servicios. Los datos se almacenan en un archivo JSON.

## Requisitos

- Node.js 18 o superior.
- npm.
- Visual Studio Code, recomendado para el desarrollo.

## Instalación

1. Clonar el repositorio o descargar el proyecto.
2. Abrir la carpeta en Visual Studio Code.
3. Ejecutar el siguiente comando en la terminal:

   ```bash
   npm install
   ```

4. Crear un archivo `.env` en la raíz del proyecto:

   ```env
   PORT=8080
   NODE_ENV=development
   ```

## Ejecución

Para iniciar la aplicación:

```bash
npm start
```

Para ejecutarla en modo de desarrollo:

```bash
npm run dev
```

La aplicación valida las variables de entorno y carga los servicios desde `src/data/services.json`.

Esta entrega implementa la administración de servicios y todavía no incluye una API HTTP.

## Variables de entorno

| Variable | Descripción | Ejemplo |
|---|---|---|
| PORT | Puerto configurado para la aplicación | 8080 |
| NODE_ENV | Entorno de ejecución | development |

Las variables son obligatorias. Si falta alguna, la aplicación informa el error al iniciar.

El archivo `.env` no debe subirse a GitHub. Para compartir la configuración se utiliza `.env.example`.

## Recurso services

Cada servicio contiene los siguientes campos:

- `id`: identificador numérico generado automáticamente.
- `name`: nombre del servicio.
- `description`: descripción del servicio.
- `duration`: duración en minutos.
- `price`: precio del servicio.
- `category`: categoría del servicio.
- `available`: disponibilidad, representada mediante `true` o `false`.

Ejemplo:

```js
{
  id: 1,
  name: 'Consulta general',
  description: 'Consulta inicial',
  duration: 30,
  price: 15000,
  category: 'Consulta',
  available: true
}
```

## Uso de ServiceManager

Importar la clase y crear una instancia:

```js
import ServiceManager from './src/managers/ServiceManager.js';

const manager = new ServiceManager();
await manager.ready;
```

### Obtener todos los servicios

```js
const services = await manager.getServices();
console.log(services);
```

### Buscar por ID

```js
const service = await manager.getServiceById(1);
console.log(service);
```

Devuelve el servicio o `null` si no existe.

### Agregar un servicio

```js
const service = await manager.addService({
  name: 'Corte de cabello',
  description: 'Corte tradicional',
  duration: 30,
  price: 12000,
  category: 'Belleza',
  available: true
});

console.log(service);
```

El ID se genera internamente. No debe enviarse como parámetro.

### Actualizar un servicio

```js
const updated = await manager.updateService(1, {
  price: 16000,
  available: false
});

console.log(updated);
```

Solo es necesario enviar los campos que se quieren modificar. El ID original no cambia.

### Eliminar un servicio

```js
const deleted = await manager.deleteService(1);
console.log(deleted);
```

Devuelve el servicio eliminado o `null` si no existe.

## Estructura del proyecto

```text
administrador-servicios/
├── src/
│   ├── config/
│   │   └── env.config.js
│   ├── managers/
│   │   └── ServiceManager.js
│   ├── data/
│   │   └── services.json
│   └── app.js
├── .env
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## Publicación en GitHub

1. Crear un repositorio público en GitHub.
2. Inicializar Git en la carpeta del proyecto.
3. Agregar y confirmar los archivos.
4. Conectar el repositorio local con GitHub.
5. Subir la rama principal.

Comandos:

```bash
git init
git add .
git commit -m "Crear administrador de servicios"
git branch -M main
git remote add origin https://github.com/moises2872024/administrador-servicios.git
git push -u origin main
```