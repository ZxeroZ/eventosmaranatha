'use client';

import { supabase } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, Settings, Package, Calendar } from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-xl border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-100">
                    <h1 className="text-xl font-bold text-gray-800">Maranatha <span className="text-indigo-600">Admin</span></h1>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    <Link
                        href="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition"
                    >
                        <LayoutDashboard className="w-5 h-5" />
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/eventos"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition"
                    >
                        <Calendar className="w-5 h-5" />
                        Eventos
                    </Link>
                    <Link
                        href="/admin/productos"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition"
                    >
                        <Package className="w-5 h-5" />
                        Productos
                    </Link>
                    <Link
                        href="/admin/configuracion"
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 rounded-lg hover:bg-indigo-50 hover:text-indigo-700 transition"
                    >
                        <Settings className="w-5 h-5" />
                        Configuración
                    </Link>
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 rounded-lg hover:bg-red-50 transition"
                    >
                        <LogOut className="w-5 h-5" />
                        Cerrar Sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="bg-white shadow h-16 md:hidden flex items-center px-4 justify-between">
                    <span className="font-bold">Panel Admin</span>
                    <button onClick={handleLogout} className="text-red-500">
                        <LogOut className="w-5 h-5" />
                    </button>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
