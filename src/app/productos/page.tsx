import { createClient } from "@/lib/supabase/server";
import NavbarPages from "@/components/NavbarPages";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";

interface Evento {
    id: string;
    nombre: string;
    imagen_url: string | null;
    productos?: any[];
}

export const dynamic = 'force-dynamic';

export default async function ProductosPage() {
    const supabase = await createClient();

    // Obtener PRODUCTOS activos directamente (igual que en Home)
    const { data: productosRaw } = await supabase
        .from('productos')
        .select('*, eventos(nombre)')
        .eq('activo', true);

    let todosLosProductos = (productosRaw || []) as any[];

    // Obtener eventos solo para el navbar (no para extraer productos de ahí)
    const { data: eventosRaw } = await supabase
        .from('eventos')
        .select('*')
        .eq('activo', true)
        .order('nombre', { ascending: true });

    const eventos = eventosRaw as unknown as Evento[];

    // Ordenar: Destacados primero, luego por fecha más reciente
    todosLosProductos.sort((a, b) => {
        // Primero por destacado (true va antes que false)
        if (a.destacado && !b.destacado) return -1;
        if (!a.destacado && b.destacado) return 1;
        // Luego por fecha descendente
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    // Obtener configuración general
    const { data: config } = await supabase
        .from('configuracion')
        .select('clave, valor, categoria')
        .eq('mostrar', true) as any;

    const redesSociales = config?.filter((c: any) => c.categoria === 'redes_sociales') || [];
    const telefono = config?.find((c: any) => c.clave === 'telefono')?.valor;
    const direccion = config?.find((c: any) => c.clave === 'direccion')?.valor;

    return (
        <div className="min-h-screen bg-gray-50">
            <NavbarPages
                redesSociales={redesSociales || []}
                eventos={eventos || []}
                activePage="productos"
            />

            {/* Hero Section */}
            <section className="relative pt-24 pb-6 md:pt-32 md:pb-12 overflow-hidden">
                {/* Background con gradiente y patrón */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-pink-50/50" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                            Catálogo de{' '}
                            <span className="relative">
                                <span className="text-primary">Productos</span>
                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 10C50 4 150 4 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/30" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-gray-600/80 text-sm sm:text-lg leading-relaxed mt-4">
                            Explora nuestra colección completa de decoraciones exclusivas y detalles únicos para tu evento.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contenido Principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 md:pb-24">
                {/* Grid de Productos */}
                {todosLosProductos.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        {todosLosProductos.map((producto: any) => (
                            <ProductCard key={producto.id} producto={producto} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center bg-gray-50/50 rounded-3xl border border-gray-100 mx-auto max-w-lg">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-6">
                            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Catálogo en actualización</h3>
                        <p className="text-gray-500 text-sm max-w-xs mx-auto leading-relaxed">
                            Estamos fotografiando nuestras nuevas decoraciones. Pronto estarán disponibles aquí.
                        </p>
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
