import { createClient } from '@/lib/supabase/server';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery';
import ProductCard from '@/components/ProductCard';
import Breadcrumbs from '@/components/Breadcrumbs';
import { MessageCircle, ShieldCheck, Palette } from 'lucide-react';
import { Database } from '@/types/database';
import NavbarPages from "@/components/NavbarPages";
import Footer from "@/components/Footer";

export const dynamic = 'force-dynamic';

type ProductoWithEvento = Database['public']['Tables']['productos']['Row'] & {
    eventos: { nombre: string } | null;
};
type GaleriaFoto = Database['public']['Tables']['galeria_fotos']['Row'];

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const supabase = await createClient();
    const { id } = await params;

    const { data: producto } = await supabase
        .from('productos')
        .select('titulo, descripcion, foto_principal')
        .eq('id', id)
        .single() as any;

    if (!producto) {
        return {
            title: 'Producto no encontrado | Eventos Maranatha',
        }
    }

    return {
        title: `${producto.titulo} | Eventos Maranatha`,
        description: producto.descripcion || 'Decoración exclusiva y organización de eventos.',
        openGraph: {
            title: producto.titulo,
            description: producto.descripcion || 'Decoración exclusiva y organización de eventos.',
            images: producto.foto_principal ? [{ url: producto.foto_principal }] : [],
        },
    }
}

export default async function ProductPage({ params }: { params: { id: string } }) {
    const supabase = await createClient();
    const { id } = await params;

    const { data: productoData, error } = await supabase
        .from('productos')
        .select('*, eventos (nombre)')
        .eq('id', id)
        .single();

    // Obtener eventos para el Navbar
    const { data: eventos } = await supabase
        .from('eventos')
        .select('*')
        .eq('activo', true)
        .order('nombre', { ascending: true });

    // Obtener configuración general
    const { data: config } = await supabase
        .from('configuracion')
        .select('clave, valor, categoria')
        .eq('mostrar', true) as any;

    const redesSociales = config?.filter((c: any) => c.categoria === 'redes_sociales') || [];
    const telefono = config?.find((c: any) => c.clave === 'telefono')?.valor;
    const direccion = config?.find((c: any) => c.clave === 'direccion')?.valor;

    const producto = productoData as unknown as ProductoWithEvento;

    if (error || !producto) {
        notFound();
    }

    const { data: galeriaData } = await supabase
        .from('galeria_fotos')
        .select('*')
        .eq('producto_id', id)
        .order('created_at', { ascending: true });

    const galeriaAdicional = galeriaData as GaleriaFoto[] | null;

    const images = [];
    if (producto.foto_principal) {
        images.push({ id: 'main', url: producto.foto_principal, alt: producto.titulo });
    }
    if (galeriaAdicional && galeriaAdicional.length > 0) {
        images.push(...galeriaAdicional.map(g => ({
            id: g.id,
            url: g.url_foto,
            alt: `${producto.titulo} - Detalle`
        })));
    }

    // Productos relacionados de la misma categoría
    let query = supabase
        .from('productos')
        .select('*, eventos(nombre)')
        .neq('id', id)
        .eq('activo', true);

    if (producto.evento_id) {
        query = query.eq('evento_id', producto.evento_id);
    }

    const { data: relacionadosData } = await query.limit(4);
    const relacionados = relacionadosData as unknown as ProductoWithEvento[];

    const whatsappMessage = encodeURIComponent(`Hola, me interesa más información sobre: ${producto.titulo}`);
    const whatsappUrl = `https://wa.me/51999999999?text=${whatsappMessage}`;

    const breadcrumbItems = [
        { label: 'Servicios', href: '/servicios' },
        ...(producto.eventos ? [{ label: producto.eventos.nombre, href: `/servicios?evento=${producto.evento_id}` }] : []),
        { label: producto.titulo, current: true }
    ];

    return (
        <div className="min-h-screen bg-white">
            {/* Navbar en flujo normal (arriba del todo) */}
            <NavbarPages eventos={eventos || []} />

            <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 pt-16 pb-12 sm:pt-24 sm:pb-12">

                <div className="px-6 sm:px-0">
                    <Breadcrumbs items={breadcrumbItems} />
                </div>

                {/* Grid Principal - items-stretch para igualar alturas */}
                <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-16 items-stretch">
                    {/* COLUMNA IZQUIERDA: GALERÍA */}
                    <div className="w-full relative self-start">
                        <ProductGallery images={images} />
                    </div>

                    {/* COLUMNA DERECHA: INFO - Distribuida (Solo Desktop) */}
                    <div className="bg-white px-6 py-5 sm:px-0 sm:py-0 w-full lg:min-h-full flex flex-col">

                        <div className="flex flex-col gap-6 lg:gap-8 justify-start lg:justify-between h-full">
                            {/* Header Producto Compacto */}
                            <div className="flex justify-between items-start pt-1">
                                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 leading-none tracking-tight flex-1 pr-4">
                                    {producto.titulo}
                                </h1>

                                {producto.eventos?.nombre && (
                                    <span className="shrink-0 inline-flex items-center px-3 py-1 bg-primary text-white text-[10px] font-bold rounded-full shadow-md shadow-primary/20 uppercase tracking-wider transform rotate-1">
                                        {producto.eventos.nombre}
                                    </span>
                                )}
                            </div>

                            {/* Sección Descripción */}
                            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-5 border border-gray-100 shadow-sm mt-1">
                                <h3 className="text-sm font-bold text-gray-900 mb-2 uppercase tracking-wide opacity-80">
                                    Descripción
                                </h3>
                                <div className="text-gray-600 leading-relaxed text-sm sm:text-base">
                                    {producto.descripcion ? (
                                        <ul className="space-y-2">
                                            {producto.descripcion.split('\n').filter(line => line.trim()).map((line, i) => (
                                                <li key={i} className="flex items-start gap-2.5">
                                                    <span className="mt-2 w-1.5 h-1.5 bg-primary/60 rounded-full shrink-0"></span>
                                                    <span>{line.trim()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>Descripción detallada del evento y decoración.</p>
                                    )}
                                </div>
                            </div>

                            {/* Grid de Características */}
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center text-center gap-1 group hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Garantía Total</p>
                                        <p className="text-gray-400 text-xs">100% Asegurado</p>
                                    </div>
                                </div>

                                <div className="p-4 bg-white rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)] flex flex-col items-center text-center gap-1 group hover:border-primary/30 hover:-translate-y-0.5 transition-all duration-300">
                                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-1 group-hover:scale-110 transition-transform">
                                        <Palette className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 text-sm">Diseño Original</p>
                                        <p className="text-gray-400 text-xs">Creación Única</p>
                                    </div>
                                </div>
                            </div>

                            {/* Botón Cotizar */}
                            <div className="mt-4">
                                <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full bg-primary hover:bg-primary-dark text-white text-center px-8 py-4 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-3 transform active:scale-[0.98]"
                                >
                                    <MessageCircle className="w-6 h-6" />
                                    <span>Solicitar Cotización</span>
                                </a>
                                <p className="text-center text-xs text-gray-400 mt-2 font-medium">
                                    Respuesta inmediata vía WhatsApp
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {relacionados && relacionados.length > 0 && (
                    <div className="mt-0 lg:mt-12 border-t-0 lg:border-t border-gray-100 pt-4 lg:pt-8 pb-8">
                        <h3 className="text-xl lg:text-3xl font-bold text-gray-900 mb-4 lg:mb-8 px-6 sm:px-0">Productos Similares</h3>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 px-6 sm:px-0">
                            {relacionados.map((item) => (
                                <ProductCard key={item.id} producto={item} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            <Footer
                redesSociales={redesSociales || []}
                eventos={eventos || []}
                direccion={direccion}
                telefono={telefono}
            />
        </div>
    );
}
