import Link from 'next/link';

interface Evento {
    id: string;
    nombre: string;
}

interface RedSocial {
    clave: string;
    valor: string;
}

interface FooterProps {
    redesSociales?: RedSocial[];
    eventos?: Evento[];
    direccion?: string;
    telefono?: string;
}

// Iconos de redes sociales
const iconosRedesSociales: { [key: string]: React.ReactNode } = {
    facebook: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
    ),
    instagram: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
    ),
    tiktok: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
        </svg>
    ),
    twitter: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    ),
    whatsapp: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    ),
    pinterest: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z" />
        </svg>
    ),
    youtube: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
};

export default function Footer({ redesSociales = [], eventos = [], direccion, telefono }: FooterProps) {
    return (
        <footer className="relative">
            {/* Onda decorativa superior */}
            <div className="bg-white">
                <svg className="w-full h-16 sm:h-24 text-primary" viewBox="0 0 1440 100" preserveAspectRatio="none">
                    <path fill="currentColor" d="M0,50 C360,100 720,0 1080,50 C1260,75 1380,60 1440,50 L1440,100 L0,100 Z"></path>
                </svg>
            </div>

            {/* Contenido del footer */}
            <div className="bg-primary">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                    <div className="grid grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-8">

                        {/* Logo y descripción */}
                        <div className="lg:col-span-5 col-span-2">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                                    <span className="text-primary font-bold text-2xl">M</span>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Maranatha</h3>
                                    <p className="text-white/70 text-sm">Eventos & Decoración</p>
                                </div>
                            </div>
                            <p className="text-white/80 text-sm leading-relaxed max-w-sm mb-6">
                                Creamos experiencias únicas para tus momentos especiales. Cada evento es una historia que merece ser contada con estilo.
                            </p>

                            {/* Redes Sociales */}
                            {redesSociales.length > 0 && (
                                <div className="flex gap-3">
                                    {redesSociales.map((red) => {
                                        const icono = iconosRedesSociales[red.clave.toLowerCase()];
                                        if (!icono || !red.valor) return null;
                                        return (
                                            <a
                                                key={red.clave}
                                                href={red.valor}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-10 h-10 bg-white/10 hover:bg-white text-white hover:text-primary rounded-xl flex items-center justify-center transition-all duration-300"
                                            >
                                                {icono}
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Nuestros Eventos (Dinámico) */}
                        <div className="lg:col-span-2">
                            <h4 className="text-white font-semibold mb-5 inline-block">
                                Eventos
                                <span className="block w-8 h-0.5 bg-white/50 mt-1"></span>
                            </h4>
                            <ul className="space-y-3">
                                {eventos.length > 0 ? (
                                    <>
                                        {eventos.slice(0, 3).map((evento) => (
                                            <li key={evento.id}>
                                                <Link href={`/servicios?evento=${evento.id}`} className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center gap-2 group">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors"></span>
                                                    {evento.nombre}
                                                </Link>
                                            </li>
                                        ))}
                                        {eventos.length > 3 && (
                                            <li>
                                                <Link href="/servicios" className="text-white/50 hover:text-white transition-colors text-xs italic inline-flex items-center gap-2 group ml-3.5">
                                                    Ver todos...
                                                </Link>
                                            </li>
                                        )}
                                    </>
                                ) : (
                                    <li className="text-white/50 text-sm">Cargando...</li>
                                )}
                            </ul>
                        </div>

                        {/* Enlaces */}
                        <div className="lg:col-span-2">
                            <h4 className="text-white font-semibold mb-5 inline-block">
                                Explorar
                                <span className="block w-8 h-0.5 bg-white/50 mt-1"></span>
                            </h4>
                            <ul className="space-y-3">
                                <li>
                                    <Link href="/servicios" className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors"></span>
                                        Servicios
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contacto" className="text-white/70 hover:text-white transition-colors text-sm inline-flex items-center gap-2 group">
                                        <span className="w-1.5 h-1.5 rounded-full bg-white/40 group-hover:bg-white transition-colors"></span>
                                        Contacto
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Contacto (Dinámico) */}
                        <div className="lg:col-span-3 col-span-2">
                            <h4 className="text-white font-semibold mb-5 inline-block">
                                Contáctanos
                                <span className="block w-8 h-0.5 bg-white/50 mt-1"></span>
                            </h4>
                            <ul className="space-y-4">
                                {direccion && (
                                    <li className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                        </div>
                                        <span className="text-white/80 text-sm">{direccion}</span>
                                    </li>
                                )}
                                {telefono && (
                                    <li className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                            </svg>
                                        </div>
                                        <span className="text-white/80 text-sm">{telefono}</span>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Barra inferior */}
                <div className="border-t border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                        <p className="text-center text-white/50 text-xs">
                            © {new Date().getFullYear()} Eventos Maranatha · Todos los derechos reservados
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
