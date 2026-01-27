"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

interface RedSocial {
    clave: string;
    valor: string;
}

interface Evento {
    id: string;
    nombre: string;
    imagen_url: string | null;
}

interface NavbarPagesProps {
    redesSociales?: RedSocial[];
    eventos?: Evento[];
    activePage?: string;
}

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
    youtube: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
    ),
    whatsapp: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
    ),
};

export default function NavbarPages({ redesSociales = [], eventos = [], activePage }: NavbarPagesProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [serviciosOpen, setServiciosOpen] = useState(false);

    // Bloquear scroll cuando el menú móvil está abierto
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [mobileMenuOpen]);

    return (
        <>
            <nav className="bg-white shadow-sm border-b border-gray-100 relative z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16 md:h-20">
                        {/* Hamburger Button Mobile */}
                        <button
                            className="md:hidden p-2 -ml-2 text-gray-600 hover:text-primary transition-colors"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label="Menú"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-2 md:gap-3 group">
                            <div className="w-8 h-8 md:w-10 md:h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-all">
                                <span className="text-primary font-bold text-lg md:text-xl group-hover:text-white transition-colors">M</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-900 text-sm md:text-base">Maranatha</span>
                                <span className="text-[9px] md:text-[10px] text-gray-500 uppercase tracking-wide">Eventos & Decoración</span>
                            </div>
                        </Link>

                        {/* Espaciador móvil */}
                        <div className="w-10 md:hidden"></div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-8">
                            <Link href="/" className={`text-sm font-medium hover:text-primary transition-colors ${activePage === 'home' ? 'text-primary' : 'text-gray-600'}`}>
                                Inicio
                            </Link>

                            <div className="group relative">
                                <Link href="/servicios" className={`text-sm font-medium flex items-center gap-1 hover:text-primary transition-colors ${activePage === 'servicios' ? 'text-primary' : 'text-gray-600'}`}>
                                    Servicios
                                    <svg className="w-4 h-4 group-hover:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </Link>

                                <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all w-64">
                                    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-2">
                                        {eventos.length > 0 ? eventos.map((evento) => (
                                            <Link key={evento.id} href={`/servicios?evento=${evento.id}`} className="block px-4 py-3 rounded-xl hover:bg-gray-50 text-sm font-medium text-gray-700">
                                                {evento.nombre}
                                            </Link>
                                        )) : (
                                            <div className="px-4 py-3 text-sm text-gray-400 text-center">No hay servicios</div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <Link href="/contacto" className={`text-sm font-medium hover:text-primary transition-colors ${activePage === 'contacto' ? 'text-primary' : 'text-gray-600'}`}>
                                Contacto
                            </Link>
                        </div>

                        {/* Desktop Social Icons */}
                        <div className="hidden md:flex items-center gap-2">
                            {redesSociales.map((red) => {
                                const icono = iconosRedesSociales[red.clave.toLowerCase()];
                                if (!icono || !red.valor) return null;
                                return (
                                    <a key={red.clave} href={red.valor} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-gray-50 text-gray-400 flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                        {icono}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Overlay */}
            <div
                className={`md:hidden fixed inset-0 bg-black/50 z-40 transition-opacity ${mobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setMobileMenuOpen(false)}
            />

            {/* Mobile Panel */}
            <div className={`md:hidden fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-2xl transform transition-transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100">
                        <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">M</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="font-bold text-gray-900">Maranatha</span>
                                <span className="text-[10px] text-gray-500 uppercase tracking-wider">Eventos & Decoración</span>
                            </div>
                        </Link>
                        <button onClick={() => setMobileMenuOpen(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Menu Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                        {/* Inicio */}
                        <Link href="/" className="flex items-center gap-3 py-3 text-gray-900 hover:text-primary border-b border-gray-100" onClick={() => setMobileMenuOpen(false)}>
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                                <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                            </div>
                            <span className="font-medium">Inicio</span>
                        </Link>

                        {/* Servicios - Acordeón */}
                        <div className="py-3 border-b border-gray-100">
                            <button
                                onClick={() => setServiciosOpen(!serviciosOpen)}
                                className="w-full flex items-center justify-between text-gray-900 hover:text-primary"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                    </div>
                                    <span className="font-medium">Servicios</span>
                                </div>
                                <svg className={`w-5 h-5 text-gray-400 transition-transform ${serviciosOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Servicios Submenu */}
                            <div className={`overflow-hidden transition-all duration-300 ${serviciosOpen ? 'max-h-96 mt-3' : 'max-h-0'}`}>
                                <div className="space-y-1 ml-11 border-l-2 border-primary/20 pl-4">
                                    {eventos.map((evento) => (
                                        <Link
                                            key={evento.id}
                                            href={`/servicios?evento=${evento.id}`}
                                            className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary py-2 px-3 rounded-lg hover:bg-primary/5 transition-colors"
                                            onClick={() => setMobileMenuOpen(false)}
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span>
                                            {evento.nombre}
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Contacto */}
                        <Link href="/contacto" className="flex items-center gap-3 py-3 text-gray-900 hover:text-primary" onClick={() => setMobileMenuOpen(false)}>
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <span className="font-medium">Contacto</span>
                        </Link>

                        {/* Redes Sociales - Debajo de contacto con espacio */}
                        {redesSociales.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-100">
                                <p className="text-xs text-gray-400 uppercase tracking-wider text-center mb-4">Síguenos</p>
                                <div className="flex items-center justify-center gap-4">
                                    {redesSociales.map((red) => {
                                        const icono = iconosRedesSociales[red.clave.toLowerCase()];
                                        if (!icono || !red.valor) return null;
                                        return (
                                            <a key={red.clave} href={red.valor} target="_blank" rel="noopener noreferrer" className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                                                {icono}
                                            </a>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
