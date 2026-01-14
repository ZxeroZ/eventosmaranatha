# Eventos Maranatha

Sistema de gestión de eventos semi-estático con panel de administración.

## Tecnologías

- **Framework**: Next.js 14+ (App Router)
- **Base de Datos**: Supabase
- **Imágenes**: Cloudinary
- **Estilos**: Tailwind CSS

## Configuración Inicial

1.  **Variables de Entorno**
    Crea un archivo `.env.local` en la raíz del proyecto y agrega tus claves:

    ```env
    NEXT_PUBLIC_SUPABASE_URL=tuy_url_de_supabase
    NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=tu_cloud_name
    NEXT_PUBLIC_CLOUDINARY_API_KEY=tu_api_key
    CLOUDINARY_API_SECRET=tu_api_secret
    ```

2.  **Base de Datos**
    Ejecuta el script SQL proporcionado en `../supabase_setup.sql` en el SQL Editor de Supabase.

3.  **Cloudinary**
    En tu dashboard de Cloudinary:
    - Ve a Settings -> Upload
    - Agrega un "Upload preset" nuevo
    - Ponle de nombre: `ml_default`
    - Mode: Unsigned (importante para que funcione sin backend complejo)

4.  **Ejecutar Proyecto**
    ```bash
    npm run dev
    ```

## Probar Conexiones

Visita [http://localhost:3000/test-connection](http://localhost:3000/test-connection) para verificar que Supabase y Cloudinary estén conectados correctamente.

https://github.com/ZxeroZ/eventosmaranatha.git