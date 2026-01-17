'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';

interface Evento {
    id: string;
    nombre: string;
}

interface NavbarProps {
    eventos: Evento[];
    variant?: 'transparent' | 'solid';
}

export default function Navbar({ eventos, variant = 'solid' }: NavbarProps) {
    const [isServicesOpen, setIsServicesOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsServicesOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const isTransparent = variant === 'transparent';

    return (
        <nav className={`flex items-center justify-between px-4 py-3 ${isTransparent ? 'absolute top-0 left-0 right-0 z-10' : 'py-4 lg:py-6'}`}>
            {/* Botón hamburguesa - Móvil y Tablet (solo visual, sin funcionalidad) */}
            <button
                className={`lg:hidden p-2 rounded-lg transition-colors ${isTransparent
                    ? 'bg-white/20 backdrop-blur-sm'
                    : 'hover:bg-gray-100'
                    }`}
            >
                <svg className={`w-6 h-6 ${isTransparent ? 'text-white' : 'text-gray-700'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {/* Logo */}
            <Link href="/" className={`flex flex-col items-center lg:items-start ${isTransparent ? '' : 'lg:flex-row lg:gap-2'}`}>
                <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 lg:w-8 lg:h-8 rounded-lg flex items-center justify-center ${isTransparent ? 'bg-white/25 backdrop-blur-sm' : 'bg-primary'
                        }`}>
                        <span className="text-white font-bold text-sm lg:text-lg">M</span>
                    </div>
                    <span className={`text-base lg:text-lg font-semibold ${isTransparent ? 'text-white' : 'text-gray-900'}`}>
                        Maranatha
                    </span>
                </div>
                {isTransparent && (
                    <span className="text-[10px] text-white/70 tracking-wider">Eventos & Decoraciones</span>
                )}
            </Link>

            {/* Enlaces Desktop */}
            <div className="hidden lg:flex items-center gap-6">
                {/* Servicios con dropdown en hover */}
                <div
                    className="relative"
                    ref={dropdownRef}
                    onMouseEnter={() => setIsServicesOpen(true)}
                    onMouseLeave={() => setIsServicesOpen(false)}
                >
                    <button className="link-underline text-secondary-dark hover:text-primary font-medium text-sm transition-colors flex items-center gap-1">
                        Servicios
                        <svg
                            className={`w-4 h-4 transition-transform ${isServicesOpen ? 'rotate-180' : ''}`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {/* Dropdown de servicios */}
                    {isServicesOpen && (
                        <div className="absolute top-full left-0 pt-2 w-56 z-50">
                            <div className="bg-white rounded-xl shadow-xl border border-gray-100 py-2">
                                {eventos.length > 0 ? (
                                    eventos.map((evento) => (
                                        <Link
                                            key={evento.id}
                                            href={`/eventos/${evento.id}`}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-primary/10 hover:text-primary transition-colors"
                                        >
                                            {evento.nombre}
                                        </Link>
                                    ))
                                ) : (
                                    <p className="px-4 py-2 text-sm text-gray-400">No hay servicios</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                <Link href="#contacto" className="link-underline text-secondary-dark hover:text-primary font-medium text-sm transition-colors">
                    Contacto
                </Link>
            </div>

            {/* Espaciador móvil para centrar logo */}
            <div className="w-10 lg:hidden"></div>
        </nav>
    );
}
