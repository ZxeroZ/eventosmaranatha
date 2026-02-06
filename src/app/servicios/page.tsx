import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import Image from "next/image";
import NavbarPages from "@/components/NavbarPages";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Breadcrumbs from "@/components/Breadcrumbs";

interface Evento {
    id: string;
    nombre: string;
    descripcion: string | null;
    imagen_url: string | null;
}

interface PageProps {
    searchParams: Promise<{ evento?: string }>;
}

export default async function ServiciosPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const eventoFiltro = params.evento;

    const supabase = await createClient();

    // Obtener todos los eventos activos
    const { data: eventos } = await supabase
        .from('eventos')
        .select('*')
        .eq('activo', true)
        .order('nombre', { ascending: true }) as { data: Evento[] | null };

    // Obtener configuración general
    const { data: config } = await supabase
        .from('configuracion')
        .select('clave, valor, categoria')
        .eq('mostrar', true) as any;

    const redesSociales = config?.filter((c: any) => c.categoria === 'redes_sociales') || [];
    const telefono = config?.find((c: any) => c.clave === 'telefono')?.valor;
    const direccion = config?.find((c: any) => c.clave === 'direccion')?.valor;

    // Si hay un filtro de evento, obtener productos de ese evento
    let productos: any[] | null = null;
    let eventoActual: Evento | null = null;

    if (eventoFiltro) {
        // Buscar el evento seleccionado
        eventoActual = eventos?.find(e => e.id === eventoFiltro) || null;

        // Obtener productos de ese evento con la relación de eventos para el ProductCard
        const { data: productosData } = await supabase
            .from('productos')
            .select('*, eventos(nombre)')
            .eq('evento_id', eventoFiltro)
            .eq('activo', true)
            .order('created_at', { ascending: false });

        productos = productosData;
    }

    // Contar productos por evento (para mostrar en las cards de categorías)
    const { data: productCounts } = await supabase
        .from('productos')
        .select('evento_id')
        .eq('activo', true) as any;

    const countByEvento = productCounts?.reduce((acc: Record<string, number>, item: any) => {
        acc[item.evento_id] = (acc[item.evento_id] || 0) + 1;
        return acc;
    }, {}) || {};

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navbar para páginas secundarias */}
            <NavbarPages
                redesSociales={redesSociales || []}
                eventos={eventos || []}
                activePage="servicios"
            />

            {/* Vista de productos filtrados por categoría */}
            {eventoFiltro && eventoActual ? (
                <>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-0">
                        <Breadcrumbs items={[
                            { label: 'Servicios', href: '/servicios' },
                            { label: eventoActual.nombre, current: true }
                        ]} />
                    </div>

                    {/* Hero Section V4: Color Sólido con Imagen Decorativa */}
                    <section className="relative bg-primary overflow-hidden pt-4 md:pt-8">
                        {/* Patrón decorativo de fondo */}
                        <div className="absolute inset-0 opacity-10">
                            <div className="absolute top-0 left-0 w-full h-full" style={{
                                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                            }} />
                        </div>

                        {/* Círculos decorativos */}
                        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-2xl" />

                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
                            <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                                {/* Contenido de Texto */}
                                <div className="flex-1 text-center lg:text-left">
                                    {/* Badge */}
                                    <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-xs font-semibold tracking-widest text-primary uppercase bg-white rounded-full shadow-lg">
                                        <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                                        Colección Exclusiva
                                    </div>

                                    {/* Título */}
                                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight animate-fade-in-up">
                                        {eventoActual.nombre}
                                    </h1>

                                    {/* Descripción */}
                                    <p className="text-lg md:text-xl text-white/90 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed animate-fade-in-up" style={{ animationDelay: '0.2s', opacity: 0 }}>
                                        {eventoActual.descripcion || "Diseños únicos y elegantes para hacer de tu celebración un momento especial e inolvidable."}
                                    </p>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 lg:flex lg:gap-6 justify-center lg:justify-start">
                                        <div className="flex items-center gap-2 lg:gap-3 bg-white/15 backdrop-blur-sm rounded-xl lg:rounded-2xl px-3 py-2 lg:px-5 lg:py-3">
                                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-lg lg:rounded-xl flex items-center justify-center">
                                                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-lg lg:text-2xl font-bold text-white">{productos?.length || 0}</p>
                                                <p className="text-[10px] lg:text-xs text-white/70 uppercase tracking-wide">Productos</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 lg:gap-3 bg-white/15 backdrop-blur-sm rounded-xl lg:rounded-2xl px-3 py-2 lg:px-5 lg:py-3">
                                            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-white/20 rounded-lg lg:rounded-xl flex items-center justify-center">
                                                <svg className="w-4 h-4 lg:w-5 lg:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <p className="text-lg lg:text-2xl font-bold text-white">100%</p>
                                                <p className="text-[10px] lg:text-xs text-white/70 uppercase tracking-wide">Personalizable</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Imagen Decorativa Pequeña */}
                                <div className="shrink-0 relative">
                                    <div className="relative w-48 h-48 md:w-72 md:h-72 lg:w-80 lg:h-80">
                                        {/* Marco decorativo */}
                                        <div className="absolute inset-0 bg-white/20 rounded-3xl transform rotate-6" />
                                        <div className="absolute inset-0 bg-white/10 rounded-3xl transform -rotate-3" />

                                        {/* Imagen */}
                                        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30">
                                            {eventoActual.imagen_url ? (
                                                <Image
                                                    src={eventoActual.imagen_url}
                                                    alt={eventoActual.nombre}
                                                    fill
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-white/20 flex items-center justify-center">
                                                    <span className="text-6xl">✨</span>
                                                </div>
                                            )}
                                        </div>


                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Curva inferior simple */}
                        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-none">
                            <svg className="relative block w-full h-8 md:h-12" viewBox="0 0 1200 60" preserveAspectRatio="none" fill="white">
                                <ellipse cx="600" cy="60" rx="700" ry="40" />
                            </svg>
                        </div>
                    </section>

                    {/* Sección de Productos */}
                    <section className="bg-white py-12 md:py-20">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            {/* Header de sección */}
                            <div className="text-center mb-12">
                                <span className="inline-block text-primary font-bold tracking-widest uppercase text-xs mb-2 bg-primary/10 px-4 py-2 rounded-full">
                                    Catálogo
                                </span>
                                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                                    Explora Nuestras Propuestas
                                </h2>
                                <p className="text-gray-500 max-w-2xl mx-auto">
                                    Cada diseño está pensado para hacer de tu {eventoActual.nombre.toLowerCase()} un momento único
                                </p>
                            </div>

                            {productos && productos.length > 0 ? (
                                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
                                    {productos.map((producto: any) => (
                                        <ProductCard key={producto.id} producto={producto} />
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-4xl">✨</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Próximamente</h3>
                                    <p className="text-gray-500 max-w-sm">
                                        Estamos preparando diseños increíbles para {eventoActual.nombre}. ¡Vuelve pronto!
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>
                </>
            ) : (
                /* Vista de categorías/servicios (Sin cambios) */
                <>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-0">
                        <Breadcrumbs items={[
                            { label: 'Servicios', current: true }
                        ]} />
                    </div>

                    {/* Hero Section */}
                    <section className="relative pt-4 pb-6 md:pt-8 md:pb-12 overflow-hidden">
                        {/* Background con gradiente y patrón */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-pink-50/50" />
                        <div className="absolute inset-0 opacity-30">
                            <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                            <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-yellow-200/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                        </div>

                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="text-center max-w-3xl mx-auto">
                                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-4 leading-tight">
                                    Nuestros{' '}
                                    <span className="relative">
                                        <span className="text-primary">Servicios</span>
                                        <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                            <path d="M2 10C50 4 150 4 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/30" />
                                        </svg>
                                    </span>
                                </h1>
                                <p className="text-xs sm:text-sm lg:text-xl text-gray-600 leading-relaxed">
                                    Descubre nuestra amplia gama de servicios para hacer de tu evento
                                    una experiencia <span className="text-primary font-semibold">inolvidable</span>
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Grid de servicios/categorías */}
                    <section className="pb-8 md:pb-16">
                        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
                            {eventos && eventos.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
                                    {eventos.map((evento, index) => {
                                        const productCount = countByEvento[evento.id] || 0;

                                        return (
                                            <Link
                                                key={evento.id}
                                                href={`/servicios?evento=${evento.id}`}
                                                className="group relative overflow-hidden rounded-xl md:rounded-2xl lg:rounded-3xl transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                                            >
                                                {/* Card */}
                                                <div className="relative h-40 sm:h-52 md:h-72 lg:h-80 bg-gray-100">
                                                    {/* Imagen de fondo */}
                                                    {evento.imagen_url ? (
                                                        <Image
                                                            src={evento.imagen_url}
                                                            alt={evento.nombre}
                                                            fill
                                                            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 50vw, 33vw"
                                                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-primary via-primary/80 to-pink-500" />
                                                    )}

                                                    {/* Overlay con gradiente */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />

                                                    {/* Contenido */}
                                                    <div className="absolute inset-0 flex flex-col justify-end p-2 sm:p-4 md:p-6">
                                                        {/* Número decorativo */}
                                                        <span className="absolute top-2 left-2 md:top-4 md:left-4 text-4xl md:text-7xl font-bold text-white/20">
                                                            {String(index + 1).padStart(2, '0')}
                                                        </span>

                                                        {/* Título */}
                                                        <h3 className="text-xs sm:text-sm md:text-xl lg:text-2xl font-bold text-white mb-0.5 md:mb-2 group-hover:text-primary transition-colors duration-300 line-clamp-2">
                                                            {evento.nombre}
                                                        </h3>

                                                        {/* Descripción - solo en desktop */}
                                                        {evento.descripcion && (
                                                            <p className="hidden md:block text-gray-300 text-xs md:text-sm line-clamp-2 mb-2 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                                                                {evento.descripcion}
                                                            </p>
                                                        )}

                                                        {/* Botón ver más */}
                                                        <div className="flex items-center gap-1 text-white/80 group-hover:text-white transition-colors">
                                                            <span className="text-[10px] md:text-sm font-medium">Explorar</span>
                                                            <svg
                                                                className="w-3 h-3 md:w-5 md:h-5 transform group-hover:translate-x-1 md:group-hover:translate-x-2 transition-transform duration-300"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                                            </svg>
                                                        </div>
                                                    </div>

                                                    {/* Efecto de brillo al hover */}
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                                                    </div>
                                                </div>
                                            </Link>
                                        );
                                    })}
                                </div>
                            ) : (
                                null
                            )}
                        </div>
                    </section>
                </>
            )}

            {/* Footer */}
            <Footer
                redesSociales={redesSociales}
                eventos={eventos || []}
                direccion={direccion}
                telefono={telefono}
            />
        </div>
    );
}
