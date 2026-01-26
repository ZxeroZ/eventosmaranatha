'use client';

import { useState } from 'react';
import Image from 'next/image';

interface GalleryImage {
    id: string;
    url: string;
    alt: string;
}

export default function ProductGallery({ images }: { images: GalleryImage[] }) {
    const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(images.length > 0 ? images[0] : null);

    if (!selectedImage) return null;

    return (
        <div className="relative w-full">
            {/* Imagen Principal */}
            {/* Móvil: Alta y ocupa espacio | Desktop: Más grande y vertical */}
            <div className="relative h-[65vh] sm:h-[75vh] w-full rounded-b-[3rem] rounded-t-none sm:rounded-3xl overflow-hidden bg-gray-100 shadow-lg sm:shadow-sm">
                <Image
                    key={selectedImage.id}
                    src={selectedImage.url}
                    alt={selectedImage.alt}
                    fill
                    className="object-cover transition-transform duration-700 hover:scale-105"
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                />

                {/* Degradado oscuro solo en la parte inferior para resaltar texto si lo hubiera o dar profundidad */}
                <div className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/30 opacity-60"></div>
            </div>

            {/* Miniaturas Flotantes (Visibles en todas las resoluciones) */}
            {images.length > 1 && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 sm:top-8 sm:translate-y-0 sm:right-6 flex flex-col gap-3 py-2 z-20">
                    {images.map((img) => (
                        <button
                            key={img.id}
                            onClick={() => setSelectedImage(img)}
                            className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shadow-lg border-2 transition-all duration-300 ${selectedImage.id === img.id
                                ? 'border-white scale-110 ring-2 ring-black/20'
                                : 'border-white/70 hover:border-white opacity-90'
                                }`}
                        >
                            <Image
                                src={img.url}
                                alt={img.alt}
                                fill
                                className="object-cover"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
