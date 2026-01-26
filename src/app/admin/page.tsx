'use client';

import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Calendar, Package, Activity, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

interface Producto {
    id: string;
    titulo: string;
    created_at: string;
    foto_principal: string | null;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        eventos: 0,
        productos: 0,
    });
    const [productosRecientes, setProductosRecientes] = useState<Producto[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const { count: eventosCount } = await supabase
                    .from('eventos')
                    .select('*', { count: 'exact', head: true });

                const { count: productosCount } = await supabase
                    .from('productos')
                    .select('*', { count: 'exact', head: true });

                const { data: productos } = await supabase
                    .from('productos')
                    .select('id, titulo, created_at, foto_principal')
                    .order('created_at', { ascending: false })
                    .limit(5);

                setStats({
                    eventos: eventosCount || 0,
                    productos: productosCount || 0,
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
            month: 'short'
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

            {/* Stats + Acción */}
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Eventos */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-primary" />
                        </div>
                        <span className="text-gray-500 text-sm">Eventos</span>
                    </div>
                    {loading ? (
                        <div className="h-8 w-12 bg-gray-100 animate-pulse rounded"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">{stats.eventos}</p>
                    )}
                </div>

                {/* Productos */}
                <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-secondary/20 rounded-xl flex items-center justify-center">
                            <Package className="w-5 h-5 text-secondary-dark" />
                        </div>
                        <span className="text-gray-500 text-sm">Productos</span>
                    </div>
                    {loading ? (
                        <div className="h-8 w-12 bg-gray-100 animate-pulse rounded"></div>
                    ) : (
                        <p className="text-3xl font-bold text-gray-900">{stats.productos}</p>
                    )}
                </div>

                {/* Acción rápida */}
                <Link
                    href="/admin/productos"
                    className="bg-primary rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all group col-span-2 lg:col-span-1"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <Package className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <p className="font-semibold text-white">Nuevo producto</p>
                                <p className="text-white/70 text-sm">Agregar al catálogo</p>
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-white/70 group-hover:translate-x-1 transition-transform" />
                    </div>
                </Link>
            </div>

            {/* Productos recientes */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">Productos recientes</h2>
                    <Link href="/admin/productos" className="text-primary text-sm font-medium hover:underline">
                        Ver todos
                    </Link>
                </div>

                {loading ? (
                    <div className="p-5 space-y-3">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gray-100 rounded-xl animate-pulse"></div>
                                <div className="flex-1">
                                    <div className="h-4 w-32 bg-gray-100 rounded animate-pulse"></div>
                                    <div className="h-3 w-20 bg-gray-100 rounded animate-pulse mt-2"></div>
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
                                className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors"
                            >
                                <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                                    {producto.foto_principal ? (
                                        <img
                                            src={producto.foto_principal}
                                            alt={producto.titulo}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Package className="w-5 h-5" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate">{producto.titulo}</p>
                                    <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-0.5">
                                        <Clock className="w-3 h-3" />
                                        {formatDate(producto.created_at)}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="p-8 text-center">
                        <Package className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No hay productos aún</p>
                    </div>
                )}
            </div>

            {/* Tip único */}
            <div className="bg-accent-light/50 rounded-2xl p-5 border border-accent/30">
                <div className="flex items-start gap-3">
                    <span className="text-2xl">💡</span>
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-1">Consejo</h3>
                        <p className="text-gray-600 text-sm">
                            Para que un evento aparezca en la página principal, debe estar <span className="font-medium text-primary">Activo</span> y tener una imagen de portada asignada.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
