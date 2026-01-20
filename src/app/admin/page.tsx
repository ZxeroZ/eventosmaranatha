'use client';

import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Loader2, Calendar, Package, Activity } from 'lucide-react';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        eventos: 0,
        productos: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStats() {
            try {
                const { count: eventosCount } = await supabase
                    .from('eventos')
                    .select('*', { count: 'exact', head: true });

                const { count: productosCount } = await supabase
                    .from('productos')
                    .select('*', { count: 'exact', head: true });

                setStats({
                    eventos: eventosCount || 0,
                    productos: productosCount || 0,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    return (
        <div className="space-y-8">
            {/* Welcome Section */}
            <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">
                        ¡Hola de nuevo! 👋
                    </h1>
                    <p className="text-indigo-100 text-lg max-w-xl">
                        Bienvenido a tu panel de control. Desde aquí puedes gestionar tus eventos, productos y la configuración de tu sitio web de manera sencilla.
                    </p>
                </div>
                {/* Decorative circles */}
                <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-purple-500/20 rounded-full blur-2xl"></div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Eventos Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors">
                            <Calendar className="w-6 h-6 text-indigo-600" />
                        </div>
                        <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            Activos
                        </span>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-gray-500 text-sm font-medium">Eventos y Categorías</h3>
                        {loading ? (
                            <div className="h-8 w-16 bg-gray-100 animate-pulse rounded"></div>
                        ) : (
                            <p className="text-3xl font-bold text-gray-900">{stats.eventos}</p>
                        )}
                    </div>
                </div>

                {/* Productos Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-fuchsia-50 rounded-xl group-hover:bg-fuchsia-100 transition-colors">
                            <Package className="w-6 h-6 text-fuchsia-600" />
                        </div>
                        <span className="text-xs font-semibold bg-fuchsia-100 text-fuchsia-700 px-2 py-1 rounded-full">
                            Catálogo
                        </span>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-gray-500 text-sm font-medium">Productos Totales</h3>
                        {loading ? (
                            <div className="h-8 w-16 bg-gray-100 animate-pulse rounded"></div>
                        ) : (
                            <p className="text-3xl font-bold text-gray-900">{stats.productos}</p>
                        )}
                    </div>
                </div>

                {/* System Status Card */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                            <Activity className="w-6 h-6 text-emerald-600" />
                        </div>
                        <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                            Online
                        </span>
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-gray-500 text-sm font-medium">Estado del Sistema</h3>
                        <p className="text-lg font-semibold text-gray-900">Funcionando correctamente</p>
                    </div>
                </div>
            </div>

            {/* Quick Tips Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-2">💡 Tip Rápido</h3>
                    <p className="text-gray-600 text-sm">
                        Recuerda que para que un evento aparezca en la página principal, debe tener el estado <strong>Activo</strong> y una imagen de portada asignada.
                    </p>
                </div>
                <div className="bg-gradient-to-r from-gray-50 to-white p-6 rounded-2xl border border-gray-100">
                    <h3 className="font-bold text-gray-800 mb-2">📸 Imágenes</h3>
                    <p className="text-gray-600 text-sm">
                        Trata de subir imágenes de menos de 2MB para asegurar que tu página cargue rápido en todos los dispositivos.
                    </p>
                </div>
            </div>
        </div>
    )
}
