'use client';

import Link from 'next/link';
import Image from 'next/image';

interface Producto {
    id: string;
    titulo: string;
    descripcion?: string | null;
    foto_principal?: string | null;
    evento_id?: string;
    destacado?: boolean;
    eventos?: {
        nombre: string;
    } | null;
}

interface ProductCardProps {
    producto: Producto;
}

export default function ProductCard({ producto }: ProductCardProps) {
    return (
        <Link
            href={`/productos/${producto.id}`}
            className="group block"
        >
            <div className="bg-white rounded-3xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.08)] transition-all duration-300 hover:shadow-[0_0_25px_rgba(0,0,0,0.12)]">
                {/* Línea decorativa de color arriba */}
                <div className="h-1 bg-primary"></div>

                {/* Imagen con badge y puntos indicadores */}
                <div className="relative aspect-square overflow-hidden bg-white p-2 sm:p-3">
                    {/* Badges - Categoría y Destacado juntos a la izquierda */}
                    <div className="absolute top-3 left-3 sm:top-5 sm:left-5 z-10 flex flex-wrap gap-1 sm:gap-2">
                        {producto.eventos?.nombre && (
                            <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-white/90 backdrop-blur-sm text-gray-800 text-[10px] sm:text-xs font-semibold rounded-md sm:rounded-lg shadow-sm border border-white/50">
                                {producto.eventos.nombre}
                            </span>
                        )}

                        {producto.destacado && (
                            <span className="px-2 py-1 sm:px-3 sm:py-1.5 bg-amber-400/90 backdrop-blur-sm text-amber-900 text-[10px] sm:text-xs font-semibold rounded-md sm:rounded-lg shadow-sm flex items-center gap-0.5 sm:gap-1">
                                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                Destacado
                            </span>
                        )}
                    </div>

                    {/* Imagen redondeada interior */}
                    <div className="w-full h-full rounded-2xl overflow-hidden relative">
                        {producto.foto_principal ? (
                            <Image
                                src={producto.foto_principal}
                                alt={producto.titulo}
                                fill
                                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center">
                                <span className="text-3xl sm:text-5xl">🎉</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Contenido - Pegado a la imagen */}
                <div className="px-2.5 pb-3 sm:px-4 sm:pb-4">
                    {/* Título */}
                    <h3 className="text-sm sm:text-xl font-bold text-gray-900 line-clamp-1 sm:line-clamp-2">
                        {producto.titulo}
                    </h3>

                    {/* Descripción */}
                    {producto.descripcion && (
                        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mt-1 sm:mt-2 line-clamp-1 sm:line-clamp-2">
                            {producto.descripcion}
                        </p>
                    )}

                    {/* Link con subrayado siempre visible */}
                    <div className="mt-2 sm:mt-3 flex items-center gap-1.5 text-primary font-semibold text-xs sm:text-sm">
                        <span className="border-b-2 border-primary">Ver detalles</span>
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </Link>
    );
}
