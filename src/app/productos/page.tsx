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

    // Obtener eventos Y sus productos activos
    const { data: eventosRaw } = await supabase
        .from('eventos')
        .select('*, productos(*)')
        .eq('activo', true)
        .eq('productos.activo', true)
        .order('orden', { ascending: true });

    const eventos = eventosRaw as unknown as Evento[];

    // Aplanar todos los productos en una sola lista aplanada
    // Y ordenarlos por fecha de creación (más recientes primero)
    let todosLosProductos: any[] = [];
    eventos?.forEach(e => {
        if (e.productos) {
            // Inyectamos el nombre del evento al producto para que ProductCard lo muestre en el badge
            const prodsConNombre = e.productos.map(p => ({
                ...p,
                eventos: { nombre: e.nombre }
            }));
            todosLosProductos = [...todosLosProductos, ...prodsConNombre];
        }
    });

    // Ordenar globalmente por fecha (opcional, pero recomendable para "Novedades")
    todosLosProductos.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // Obtener redes sociales para el footer
    const { data: redesSociales } = await supabase
        .from('configuracion')
        .select('clave, valor')
        .eq('categoria', 'redes_sociales')
        .eq('mostrar', true) as any;

    return (
        <div className="min-h-screen bg-white">
            <NavbarPages
                redesSociales={redesSociales || []}
                eventos={eventos || []}
                activePage="productos"
            />

            {/* Contenido Principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

                {/* Header Compacto */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Catálogo de Productos
                    </h1>
                    <p className="text-gray-500 max-w-2xl mx-auto text-sm sm:text-base">
                        Explora detalle a detalle todas nuestras decoraciones y servicios exclusivos.
                    </p>
                </div>

                {/* Grid Único de Productos */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 sm:gap-x-6 sm:gap-y-10">
                    {todosLosProductos.map((producto: any) => (
                        <ProductCard key={producto.id} producto={producto} />
                    ))}
                </div>

                {todosLosProductos.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                        <p className="text-gray-500">No hay productos disponibles por el momento.</p>
                    </div>
                )}
            </div>

            <Footer redesSociales={redesSociales || []} eventos={eventos || []} />
        </div>
    );
}
