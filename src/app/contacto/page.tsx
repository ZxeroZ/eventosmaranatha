import { createClient } from "@/lib/supabase/server";
import NavbarPages from "@/components/NavbarPages";
import Footer from "@/components/Footer";
import { Send, MapPin, Phone, Mail, Clock, Instagram, Facebook, Globe, Youtube, Twitter } from "lucide-react";

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

// Helper para iconos incluyendo Youtube y X
const getSocialIcon = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes('instagram')) return <Instagram className="w-5 h-5" />;
    if (k.includes('facebook')) return <Facebook className="w-5 h-5" />;
    if (k.includes('youtube')) return <Youtube className="w-5 h-5" />;
    if (k.includes('twitter') || k.includes('x')) return <Twitter className="w-5 h-5" />;
    return <Globe className="w-5 h-5" />;
};

export const dynamic = 'force-dynamic';

export default async function ContactoPage() {
    const supabase = await createClient();

    // Obtener configuración general
    const { data: config } = await supabase
        .from('configuracion')
        .select('clave, valor, categoria')
        .eq('mostrar', true) as any;

    const redesSociales = (config?.filter((c: any) => c.categoria === 'redes_sociales') || []) as ConfigItem[];
    const telefono = config?.find((c: any) => c.clave === 'telefono')?.valor;
    const direccion = config?.find((c: any) => c.clave === 'direccion')?.valor;
    const email = config?.find((c: any) => c.clave === 'email')?.valor;
    const whatsapp = config?.find((c: any) => c.clave === 'whatsapp')?.valor || '';

    const whatsappClean = whatsapp.replace(/\D/g, '');
    const whatsappLink = whatsapp ? `https://wa.me/${whatsappClean}` : '#';

    // Obtener eventos para Navbar
    const { data: eventosRaw } = await supabase
        .from('eventos')
        .select('id, nombre, imagen_url')
        .eq('activo', true)
        .order('nombre', { ascending: true });

    const eventos = (eventosRaw || []) as Evento[];

    const redesSocialesProp = redesSociales.map((r: any) => ({
        clave: r.clave,
        valor: r.valor || '#'
    }));

    // Calcular cuántos items de información tenemos para ajustar el Grid
    // Siempre tenemos Horario (+1). Chequeamos los otros 3.
    const hasDireccion = !!direccion;
    const hasTelefono = !!telefono;
    const hasEmail = !!email;
    const infoCount = (hasDireccion ? 1 : 0) + (hasTelefono ? 1 : 0) + (hasEmail ? 1 : 0) + 1; // +1 Horario

    // Clase dinámica para el grid. 
    // Si son 4: lg:grid-cols-4
    // Si son 3: lg:grid-cols-3
    // Si son 2: lg:grid-cols-2 (aunque raro)
    let gridColsClass = "lg:grid-cols-4";
    if (infoCount === 3) gridColsClass = "lg:grid-cols-3";
    if (infoCount === 2) gridColsClass = "lg:grid-cols-2";

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
            <NavbarPages
                redesSociales={redesSocialesProp}
                eventos={eventos}
                activePage="contacto"
            />

            {/* Hero Section */}
            <section className="relative pt-24 pb-10 md:pt-32 md:pb-16 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-pink-50/50" />
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 leading-tight">
                            Ponte en{' '}
                            <span className="relative">
                                <span className="text-primary">Contacto</span>
                                <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 12" fill="none">
                                    <path d="M2 10C50 4 150 4 198 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-primary/30" />
                                </svg>
                            </span>
                        </h1>
                        <p className="text-gray-600 mt-3 text-sm md:text-base">
                            Estamos aquí para responder tus preguntas.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contenido Principal */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 space-y-12">

                {/* 1. Fila de Datos de Contacto (Grid Dinámico) */}
                <div className={`grid grid-cols-1 md:grid-cols-2 ${gridColsClass} gap-5 md:gap-8`}>
                    {/* Card Dirección */}
                    {direccion && (
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group h-full flex flex-col items-center justify-center">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                <MapPin className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 text-lg">Visítanos</h3>
                            <p className="text-gray-500 text-sm leading-relaxed max-w-[200px]">{direccion}</p>
                        </div>
                    )}

                    {/* Card Teléfono */}
                    {telefono && (
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group h-full flex flex-col items-center justify-center">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Phone className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 text-lg">Llámanos</h3>
                            <p className="text-gray-500 text-sm">{telefono}</p>
                        </div>
                    )}

                    {/* Card Email */}
                    {email && (
                        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group h-full flex flex-col items-center justify-center">
                            <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                                <Mail className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2 text-lg">Escríbenos</h3>
                            <p className="text-gray-500 text-sm break-all">{email}</p>
                        </div>
                    )}

                    {/* Card Horario */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow text-center group h-full flex flex-col items-center justify-center">
                        <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
                            <Clock className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-900 mb-2 text-lg">Horario</h3>
                        <p className="text-gray-500 text-sm">Lun - Dom: 6am - 11pm</p>
                    </div>
                </div>

                {/* 2. Sección de Redes Sociales */}
                <div className="text-center pt-4">
                    <h3 className="text-sm font-bold text-gray-900 uppercase tracking-widest mb-6 relative inline-block">
                        Síguenos en
                        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary"></span>
                    </h3>

                    <div className="flex justify-center gap-4 flex-wrap">
                        {redesSociales.map((red) => (
                            <a
                                key={red.clave}
                                href={red.valor || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-600 hover:border-primary hover:text-white hover:bg-primary hover:shadow-lg transition-all duration-300 group"
                            >
                                <span className="text-primary group-hover:text-white transition-colors">{getSocialIcon(red.clave)}</span>
                                <span className="font-medium capitalize text-sm">{red.clave}</span>
                            </a>
                        ))}
                    </div>
                </div>

                {/* 3. Formulario y Mapa */}
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-stretch pt-4">

                    {/* Formulario */}
                    <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-xl shadow-gray-200/50">
                        <h3 className="text-2xl font-bold mb-2 text-gray-900">Envíanos un mensaje</h3>
                        <p className="text-gray-500 mb-8 text-sm">Estamos listos para hacer realidad tu evento.</p>

                        <form action={whatsappLink} target="_blank" className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Nombre Completo</label>
                                <input
                                    type="text"
                                    name="nombre"
                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all placeholder-gray-400"
                                    placeholder="Tu nombre"
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Tipo de Evento</label>
                                <select className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all cursor-pointer text-gray-700">
                                    <option>Seleccionar...</option>
                                    <option>Boda</option>
                                    <option>Cumpleaños</option>
                                    <option>Corporativo</option>
                                    <option>Otro</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">Mensaje</label>
                                <textarea
                                    name="mensaje"
                                    className="w-full px-5 py-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all min-h-[140px] resize-none placeholder-gray-400"
                                    placeholder="Cuéntanos..."
                                    required
                                ></textarea>
                            </div>

                            {/* Botón VERDE OBLIGATORIO */}
                            <button
                                type="submit"
                                className="w-full py-4 bg-primary hover:bg-primary-dark text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-4"
                            >
                                <span>Enviar Whatsapp</span>
                                <Send className="w-5 h-5" />
                            </button>
                        </form>
                    </div>

                    {/* Mapa */}
                    <div className="relative h-full min-h-[450px] lg:min-h-auto rounded-3xl overflow-hidden shadow-lg border border-gray-100 grayscale hover:grayscale-0 transition-all duration-700">
                        {direccion ? (
                            <iframe
                                width="100%"
                                height="100%"
                                frameBorder="0"
                                style={{ border: 0 }}
                                src={`https://maps.google.com/maps?q=${encodeURIComponent(direccion)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                                allowFullScreen
                                className="absolute inset-0 w-full h-full bg-gray-100"
                            ></iframe>
                        ) : (
                            <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                                Mapa no disponible
                            </div>
                        )}
                        <div className="absolute inset-0 pointer-events-none border-[8px] border-white/50 rounded-3xl"></div>
                    </div>
                </div>
            </div>

            <Footer
                redesSociales={redesSocialesProp}
                eventos={eventos || []}
                direccion={direccion}
                telefono={telefono}
            />
        </div>
    );
}
