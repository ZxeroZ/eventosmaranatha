import { MetadataRoute } from 'next'
import { createClient } from '@/lib/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://maranatha-eventos.vercel.app';

    // Obtener productos activos para el sitemap
    const { data: productos } = await supabase
        .from('productos')
        .select('id, updated_at')
        .eq('activo', true) as any;

    const productosUrls = (productos || []).map((producto: any) => ({
        url: `${baseUrl}/productos/${producto.id}`,
        lastModified: new Date(producto.updated_at || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/contacto`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/servicios`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.9,
        },
        ...productosUrls,
    ]
}
