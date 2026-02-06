'use client'; // Error boundaries must be Client Components

import { useEffect } from 'react';
import Link from 'next/link';
import { RotateCcw, Home } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Runtime Error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
            <div className="animate-fade-in-up max-w-lg w-full bg-white p-8 md:p-12 rounded-3xl shadow-xl shadow-primary/5 border border-gray-100">

                {/* Icon */}
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>

                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    Algo salió mal
                </h2>

                <p className="text-gray-500 mb-8 leading-relaxed">
                    Ha ocurrido un error inesperado. Nuestro equipo ha sido notificado, pero puedes intentar recargar la página.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={() => reset()}
                        className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium transition-all shadow-lg hover:shadow-primary/30 active:scale-95"
                    >
                        <RotateCcw className="w-4 h-4" />
                        Intentar de nuevo
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-full font-medium transition-all hover:shadow-md active:scale-95"
                    >
                        <Home className="w-4 h-4" />
                        Ir al Inicio
                    </Link>
                </div>

                {process.env.NODE_ENV === 'development' && (
                    <div className="mt-8 p-4 bg-gray-100 rounded-xl text-left overflow-auto max-h-40 text-xs font-mono text-gray-600">
                        <p className="font-bold mb-1">Detalles del Error (Solo Dev):</p>
                        {error.message}
                    </div>
                )}
            </div>
        </div>
    );
}
