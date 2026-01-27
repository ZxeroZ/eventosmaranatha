'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

interface Evento {
    id: string;
    nombre: string;
    descripcion?: string;
    imagen_url?: string;
}

interface ServicesCarouselProps {
    eventos: Evento[];
}

export default function ServicesCarousel({ eventos }: ServicesCarouselProps) {
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Solo mostrar carrusel en desktop si hay más de 4 items
    const showCarousel = eventos.length > 4;

    // Duplicar items para efecto infinito
    const duplicatedEventos = showCarousel ? [...eventos, ...eventos] : eventos;

    if (!eventos || eventos.length === 0) {
        return (
            <div className="col-span-full text-center py-12 sm:py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                <div className="text-4xl sm:text-5xl mb-4">🎉</div>
                <p className="text-gray-500 font-medium text-sm sm:text-base">Próximamente más servicios</p>
                <p className="text-xs sm:text-sm text-gray-400 mt-1">¡Contáctanos para conocer nuestro catálogo!</p>
            </div>
        );
    }

    // Renderizar tarjeta individual
    const renderCard = (evento: Evento, index: number) => (
        <Link
            href={`/eventos/${evento.id}`}
            key={`${evento.id}-${index}`}
            className="group flex-shrink-0 w-[280px] lg:w-[300px]"
        >
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden bg-gray-100 shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-xl">
                <div className="absolute inset-0">
                    {evento.imagen_url ? (
                        <Image src={evento.imagen_url} alt={evento.nombre} fill sizes="300px" className="object-cover" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                            <span className="text-white text-5xl sm:text-6xl">🎉</span>
                        </div>
                    )}
                </div>

                <div className="absolute inset-0 flex flex-col justify-end p-4 sm:p-6 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                    <h3 className="text-xl sm:text-2xl font-bold text-white">{evento.nombre}</h3>
                    {evento.descripcion && <p className="text-gray-200 text-xs sm:text-sm mt-2 line-clamp-2">{evento.descripcion}</p>}
                </div>
            </div>
        </Link>
    );

    return (
        <>
            {/* Vista móvil y tablet - Carrusel horizontal con scroll táctil uno por uno */}
            <div
                className="lg:hidden overflow-x-auto scrollbar-hide pb-4"
                style={{
                    scrollSnapType: 'x mandatory',
                    WebkitOverflowScrolling: 'touch'
                }}
            >
                <div
                    className="flex gap-4 px-[15%]"
                    style={{ width: 'max-content' }}
                >
                    {eventos.map((evento, index) => (
                        <Link
                            href={`/eventos/${evento.id}`}
                            key={`mobile-${evento.id}-${index}`}
                            className="group shrink-0"
                            style={{
                                width: 'calc(70vw)',
                                scrollSnapAlign: 'center'
                            }}
                        >
                            <div className="relative h-56 sm:h-64 rounded-2xl overflow-hidden bg-gray-100 shadow-lg transition-all duration-300">
                                <div className="absolute inset-0">
                                    {evento.imagen_url ? (
                                        <Image src={evento.imagen_url} alt={evento.nombre} fill sizes="70vw" className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                                            <span className="text-white text-4xl">🎉</span>
                                        </div>
                                    )}
                                </div>
                                <div className="absolute inset-0 flex flex-col justify-end p-3 sm:p-4 bg-gradient-to-t from-black/80 via-black/20 to-transparent">
                                    <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">{evento.nombre}</h3>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Vista desktop - Carrusel infinito con sombras y bordes redondeados */}
            <div className="hidden lg:block relative">
                <div
                    className="overflow-hidden rounded-3xl"
                    style={{
                        boxShadow: showCarousel ? 'inset 20px 0 30px -15px rgba(0,0,0,0.15), inset -20px 0 30px -15px rgba(0,0,0,0.15)' : 'none'
                    }}
                >
                    <div
                        ref={containerRef}
                        className={`flex gap-6 py-4 ${showCarousel ? 'animate-scroll' : 'justify-center'}`}
                        style={showCarousel ? { width: 'max-content' } : {}}
                        onMouseEnter={() => setIsPaused(true)}
                        onMouseLeave={() => setIsPaused(false)}
                    >
                        <style jsx>{`
                            @keyframes scroll {
                                0% {
                                    transform: translateX(0);
                                }
                                100% {
                                    transform: translateX(-50%);
                                }
                            }
                            .animate-scroll {
                                animation: scroll 30s linear infinite;
                            }
                            .animate-scroll:hover {
                                animation-play-state: paused;
                            }
                        `}</style>

                        {duplicatedEventos.map((evento, index) => renderCard(evento, index))}
                    </div>
                </div>
            </div>
        </>
    );
}
