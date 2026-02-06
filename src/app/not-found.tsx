import Link from "next/link";
import { MoveLeft } from "lucide-react";
import NavbarPages from "@/components/NavbarPages";
import Footer from "@/components/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function NotFound() {
    const supabase = await createClient();

    // Fetch basic data for Navbar/Footer
    const { data: config } = await supabase
        .from('configuracion')
        .select('clave, valor, categoria')
        .eq('mostrar', true) as any;

    const { data: eventos } = await supabase
        .from('eventos')
        .select('*')
        .eq('activo', true)
        .order('nombre', { ascending: true }) as any;

    const redesSociales = config?.filter((c: any) => c.categoria === 'redes_sociales') || [];
    const telefono = config?.find((c: any) => c.clave === 'telefono')?.valor;
    const direccion = config?.find((c: any) => c.clave === 'direccion')?.valor;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <NavbarPages
                eventos={eventos || []}
                redesSociales={redesSociales || []}
            />

            <main className="flex-1 flex flex-col items-center justify-center p-4 text-center mt-20 mb-20 animate-fade-in-up">
                {/* Decorative Element */}
                <div className="relative mb-8">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl" />
                    <h1 className="relative text-9xl font-bold text-gray-900/10 select-none">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-6xl">🤔</span>
                    </div>
                </div>

                <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Página no encontrada
                </h2>

                <p className="text-gray-500 max-w-md mb-8 leading-relaxed">
                    Lo sentimos, no pudimos encontrar la página que buscas.
                    Puede que haya sido eliminada o que la dirección sea incorrecta.
                </p>

                <Link
                    href="/"
                    className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-primary/30 hover:-translate-y-1"
                >
                    <MoveLeft className="w-4 h-4" />
                    Volver al Inicio
                </Link>
            </main>

            <Footer
                redesSociales={redesSociales || []}
                eventos={eventos || []}
                direccion={direccion}
                telefono={telefono}
            />
        </div>
    );
}
