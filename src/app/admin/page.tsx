'use client';

import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

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
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Panel de Control</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Eventos Activos</h3>
                    {loading ? (
                        <Loader2 className="animate-spin w-8 h-8 text-indigo-200 mt-2" />
                    ) : (
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.eventos}</p>
                    )}
                    <p className="text-xs text-green-600 mt-2">Categorías principales</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Productos</h3>
                    {loading ? (
                        <Loader2 className="animate-spin w-8 h-8 text-indigo-200 mt-2" />
                    ) : (
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stats.productos}</p>
                    )}
                    <p className="text-xs text-indigo-600 mt-2">Arreglos registrados</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h3 className="text-gray-500 text-sm font-medium">Estado</h3>
                    <p className="text-3xl font-bold text-green-600 mt-2">Online</p>
                    <p className="text-xs text-gray-500 mt-2">Sistema funcionando</p>
                </div>
            </div>

            <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h2 className="text-lg font-bold text-blue-800 mb-2">👋 ¡Bienvenido al Admin!</h2>
                <p className="text-blue-700">
                    Desde aquí podrás gestionar tus eventos, productos y la configuración de la página web.
                    Usa el menú lateral para navegar.
                </p>
            </div>
        </div>
    )
}
