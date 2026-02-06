'use client';

import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Calendar, Package, Activity, ArrowRight, Clock, Image as ImageIcon, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';

interface Producto {
    id: string;
    titulo: string;
    created_at: string;
    foto_principal: string | null;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        eventosActivos: 0,
        eventosInactivos: 0,
        productosActivos: 0,
        productosInactivos: 0,
        galeriaFotos: 0,
    });
    const [productosRecientes, setProductosRecientes] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                // Eventos activos e inactivos
                const { count: eventosActivosCount } = await supabase
                    .from('eventos')
                    .select('*', { count: 'exact', head: true })
                    .eq('activo', true);

                const { count: eventosInactivosCount } = await supabase
                    .from('eventos')
                    .select('*', { count: 'exact', head: true })
                    .eq('activo', false);

                // Productos activos e inactivos
                const { count: productosActivosCount } = await supabase
                    .from('productos')
                    .select('*', { count: 'exact', head: true })
                    .eq('activo', true);

                const { count: productosInactivosCount } = await supabase
                    .from('productos')
                    .select('*', { count: 'exact', head: true })
                    .eq('activo', false);

                // Fotos en galería
                const { count: galeriaCount } = await supabase
                    .from('galeria_fotos')
                    .select('*', { count: 'exact', head: true });

                // Productos recientes
                const { data: productos } = await supabase
                    .from('productos')
                    .select('id, titulo, created_at, foto_principal')
                    .order('created_at', { ascending: false })
                    .limit(5);

                setStats({
                    eventosActivos: eventosActivosCount || 0,
                    eventosInactivos: eventosInactivosCount || 0,
                    productosActivos: productosActivosCount || 0,
                    productosInactivos: productosInactivosCount || 0,
                    galeriaFotos: galeriaCount || 0,
                });
                setProductosRecientes(productos || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-PE', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                        Panel de Control
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Resumen de tu sitio web
                    </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-4 py-2 rounded-full">
                    <Activity className="w-4 h-4" />
                    <span className="font-medium">Sistema activo</span>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Eventos Card */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                            <Calendar className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-500 text-sm font-medium">Eventos</p>
                            {loading ? (
                                <div className="h-7 w-16 bg-gray-100 animate-pulse rounded mt-1" />
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">{stats.eventosActivos + stats.eventosInactivos}</p>
                            )}
                        </div>
                    </div>
                    {!loading && (
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1 text-green-600">
                                <Eye className="w-3 h-3" />
                                <span className="font-medium">{stats.eventosActivos} activos</span>
                            </div>
                            {stats.eventosInactivos > 0 && (
                                <div className="flex items-center gap-1 text-gray-400">
                                    <EyeOff className="w-3 h-3" />
                                    <span>{stats.eventosInactivos}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Productos Card */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-dark rounded-xl flex items-center justify-center shadow-lg shadow-secondary/20">
                            <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-500 text-sm font-medium">Productos</p>
                            {loading ? (
                                <div className="h-7 w-16 bg-gray-100 animate-pulse rounded mt-1" />
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">{stats.productosActivos + stats.productosInactivos}</p>
                            )}
                        </div>
                    </div>
                    {!loading && (
                        <div className="flex items-center gap-4 text-xs">
                            <div className="flex items-center gap-1 text-green-600">
                                <Eye className="w-3 h-3" />
                                <span className="font-medium">{stats.productosActivos} activos</span>
                            </div>
                            {stats.productosInactivos > 0 && (
                                <div className="flex items-center gap-1 text-gray-400">
                                    <EyeOff className="w-3 h-3" />
                                    <span>{stats.productosInactivos}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Galería Card */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-pink-400/20">
                            <ImageIcon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                            <p className="text-gray-500 text-sm font-medium">Galería</p>
                            {loading ? (
                                <div className="h-7 w-16 bg-gray-100 animate-pulse rounded mt-1" />
                            ) : (
                                <p className="text-2xl font-bold text-gray-900">{stats.galeriaFotos}</p>
                            )}
                        </div>
                    </div>
                    {!loading && (
                        <p className="text-xs text-gray-400">Fotos totales</p>
                    )}
                </div>

                {/* Acción rápida - Nuevo Producto */}
                <Link
                    href="/admin/productos"
                    className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all group relative overflow-hidden"
                >
                    {/* Decorative gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/0 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative flex items-center justify-between h-full">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <p className="font-bold text-white text-lg">Nuevo producto</p>
                                <p className="text-white/80 text-sm">Agregar al catálogo</p>
                            </div>
                        </div>
                        <ArrowRight className="w-6 h-6 text-white/70 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            </div>

            {/* Productos recientes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-gray-900 text-lg">Productos recientes</h2>
                        <p className="text-sm text-gray-500 mt-0.5">Últimos productos agregados</p>
                    </div>
                    <Link href="/admin/productos" className="text-primary text-sm font-medium hover:underline flex items-center gap-1">
                        Ver todos
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="p-5 space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gray-100 rounded-xl animate-pulse" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-40 bg-gray-100 rounded animate-pulse" />
                                    <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : productosRecientes.length > 0 ? (
                    <div className="divide-y divide-gray-50">
                        {productosRecientes.map((producto) => (
                            <Link
                                key={producto.id}
                                href={`/admin/productos`}
                                className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors group"
                            >
                                <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 shrink-0 ring-2 ring-gray-100 group-hover:ring-primary/20 transition-all">
                                    {producto.foto_principal ? (
                                        <img
                                            src={producto.foto_principal}
                                            alt={producto.titulo}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Package className="w-6 h-6" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">{producto.titulo}</p>
                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-1">
                                        <Clock className="w-3.5 h-3.5" />
                                        {formatDate(producto.created_at)}
                                    </div>
                                </div>
                                <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Package className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 font-medium">No hay productos aún</p>
                        <p className="text-gray-400 text-sm mt-1">Comienza agregando tu primer producto</p>
                    </div>
                )}
            </div>

            {/* Tips Section */}
            <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-accent-light/50 to-accent/30 rounded-2xl p-5 border border-accent/30">
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">💡</span>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1.5">Consejo SEO</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Asegúrate de que todos los productos tengan <span className="font-semibold text-primary">imágenes de alta calidad</span> y descripciones detalladas para mejor posicionamiento.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 border border-blue-200/50">
                    <div className="flex items-start gap-3">
                        <span className="text-3xl">🎯</span>
                        <div>
                            <h3 className="font-bold text-gray-900 mb-1.5">Visibilidad</h3>
                            <p className="text-gray-600 text-sm leading-relaxed">
                                Los eventos deben estar <span className="font-semibold text-blue-600">activos</span> para aparecer en la página principal y tener imagen asignada.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
