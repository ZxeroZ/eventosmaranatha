import { createClient } from "@/lib/supabase/server";
import NavbarPages from "@/components/NavbarPages";
import Footer from "@/components/Footer";
import { MessageCircle, Send } from "lucide-react";

interface Evento {
    id: string;
    nombre: string;
    imagen_url: string | null;
}

interface ConfigItem {
    clave: string;
    valor: string | null;
    categoria: string | null;
}

export const dynamic = 'force-dynamic';

export default async function ContactoPage() {
    const supabase = await createClient();

    // Obtener eventos para Navbar
    const { data: eventosRaw } = await supabase
        .from('eventos')
        .select('id, nombre, imagen_url')
        .eq('activo', true)
        .order('orden', { ascending: true });

    const eventos = (eventosRaw || []) as Evento[];

    // Obtener configuración
    const { data: configRaw } = await supabase
        .from('configuracion')
        .select('*')
        .eq('mostrar', true);

    const config = (configRaw || []) as ConfigItem[];
    const getVal = (clave: string) => config.find(c => c.clave === clave)?.valor || '';

    const whatsapp = getVal('whatsapp');
    const whatsappLink = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, '')}` : '#';

    // Redes para navbar
    const redesSociales = config.filter(c => c.categoria === 'redes_sociales');
    const redesSocialesProp = redesSociales.map(r => ({
        clave: r.clave,
        valor: r.valor || '#'
    }));

    return (
        <div className="min-h-screen bg-white">
            <NavbarPages
                redesSociales={redesSocialesProp}
                eventos={eventos}
                activePage="contacto"
            />

            {/* Contenedor Principal */}
            <div className="w-full px-4 pt-10 pb-20">

                <div className="max-w-2xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-10">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                            Contáctanos
                        </h1>
                        <p className="text-gray-500">
                            ¿Tienes alguna duda o quieres cotizar? Estamos a un clic de distancia.
                        </p>
                    </div>

                    {/* Botón WhatsApp Gigante (Destacado) */}
                    <div className="mb-10">
                        <a
                            href={whatsappLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#20bd5a] text-white py-4 px-6 rounded-xl font-bold text-lg shadow-lg shadow-green-100 transition-all transform hover:-translate-y-1"
                        >
                            <MessageCircle className="w-6 h-6" />
                            <span>Chatear por WhatsApp</span>
                        </a>
                        <div className="relative mt-8 text-center">
                            <span className="bg-white px-2 text-sm text-gray-400 relative z-10">O envíanos un correo directo</span>
                            <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 -z-0"></div>
                        </div>
                    </div>

                    {/* Card de Formulario */}
                    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50">
                        <form className="space-y-6" action={whatsappLink} target="_blank">

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Nombre Completo</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                                    placeholder="Tu nombre"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Tipo de Evento</label>
                                <select className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all bg-white">
                                    <option>Boda</option>
                                    <option>Cumpleaños</option>
                                    <option>Corporativo</option>
                                    <option>Otro</option>
                                </select>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-semibold text-gray-700">Mensaje</label>
                                <textarea
                                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all min-h-[120px] resize-none"
                                    placeholder="Cuéntanos los detalles..."
                                ></textarea>
                            </div>

                            <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
                                <span>Enviar Solicitud</span>
                                <Send className="w-4 h-4" />
                            </button>
                        </form>
                    </div>

                </div>
            </div>

            <Footer redesSociales={redesSocialesProp} eventos={eventos} />
        </div>
    );
}
