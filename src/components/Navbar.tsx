'use client';

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 md:h-20 items-center">
                    {/* Mobile: Hamburger izquierda */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>

                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-lg">M</span>
                        </div>
                        <span className="text-lg font-semibold text-gray-900 hidden sm:block">
                            Maranatha
                        </span>
                    </Link>

                    {/* Desktop Navigation - Centro */}
                    <div className="hidden md:flex items-center gap-8">
                        <Link
                            href="#como-funciona"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            Cómo Funciona
                        </Link>
                        <Link
                            href="#servicios"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            Servicios
                        </Link>
                        <Link
                            href="#contacto"
                            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
                        >
                            Contacto
                        </Link>
                    </div>

                    {/* Botones derecha */}
                    <div className="hidden md:flex items-center gap-3">
                        <Link
                            href="#contacto"
                            className="text-gray-700 hover:text-gray-900 font-medium px-4 py-2 transition-colors"
                        >
                            Contactar
                        </Link>
                        <Link
                            href="https://wa.me/51999999999"
                            target="_blank"
                            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-full font-medium transition-colors"
                        >
                            Cotizar
                        </Link>
                    </div>

                    {/* Espaciador mobile */}
                    <div className="w-10 md:hidden"></div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100">
                        <div className="flex flex-col gap-3">
                            <Link
                                href="#como-funciona"
                                className="text-gray-600 hover:text-gray-900 font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Cómo Funciona
                            </Link>
                            <Link
                                href="#servicios"
                                className="text-gray-600 hover:text-gray-900 font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Servicios
                            </Link>
                            <Link
                                href="#contacto"
                                className="text-gray-600 hover:text-gray-900 font-medium py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Contacto
                            </Link>
                            <hr className="my-2" />
                            <Link
                                href="https://wa.me/51999999999"
                                target="_blank"
                                className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-3 rounded-full font-medium transition-colors text-center"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Cotizar Ahora
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
}
