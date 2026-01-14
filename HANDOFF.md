# Proyecto Eventos Maranatha - Documentación de Traspaso

## Estado del Proyecto
El proyecto está construido con **Next.js (App Router)**, **Supabase** (Base de datos y Auth) y **Cloudinary** (Imágenes).

### Funcionalidades Completadas
1.  **Autenticación Dashboard**:
    *   Login seguro en `/admin/login`.
    *   Protección de rutas `/admin/*` con Middleware.
    *   Manejo de sesión con Cookies.
2.  **Gestión de Eventos (Categorías)**:
    *   CRUD completo en `/admin/eventos`.
    *   Permite crear categorías (ej: Bodas, XV Años).
    *   **Subida de Imágenes**: Integrado con Cloudinary (Widget).
3.  **Página Principal de Clientes**:
    *   Ruta `/`.
    *   Muestra dinámicamente las categorías activas creadas en el panel.
    *   Diseño responsivo y moderno.
4.  **Base de Datos**:
    *   Tablas creadas: `eventos`, `productos`, `galeria_fotos`, `configuracion`.
    *   Políticas RLS (Row Level Security) activas.

## Tareas Pendientes para el Desarrollador (Tu Compa)
1.  **CRUD de Productos**:
    *   Crear la página `/admin/productos`.
    *   Debe ser similar a `eventos` pero guardando en la tabla `productos`.
    *   Recordar vincular cada producto a un `evento_id` (categoría).
2.  **Página de Detalle del Evento**:
    *   Crear `/app/eventos/[id]/page.tsx`.
    *   Mostrar los productos asociados a esa categoría.
3.  **Configuración General**:
    *   Crear `/admin/configuracion` para editar datos de contacto (teléfono, redes sociales) usando la tabla `configuracion`.

## Cómo Correr el Proyecto

### 1. Variables de Entorno
Necesitas un archivo `.env.local` en la raíz con las siguientes claves (pídeselas al dueño anterior o sácalas de Supabase/Cloudinary):

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=ml_default
```

### 2. Instalación y Ejecución
```bash
npm install
npm run dev
```

### 3. Base de Datos
Si necesitas recrear la BD, usa el archivo `supabase_setup.sql`.
(Nota: Se ejecutó una migración extra `migration_add_event_image.sql` para agregar imágenes a los eventos).

## Estructura de Carpetas Clave
*   `src/app/admin`: Todo el panel administrativo.
*   `src/lib/supabase`: Clientes de conexión (Client, Server y Middleware).
*   `src/types/database.ts`: Tipos de TypeScript generados automáticamente (si cambias la BD, actualiza esto).

¡Suerte con el desarrollo! 🚀
