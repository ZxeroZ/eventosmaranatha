'use client';

import { supabase } from '@/lib/supabase/client';
import { useRouter, usePathname } from 'next/navigation';
import { LogOut, LayoutDashboard, Settings, Package, Calendar, Menu, X, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/eventos', label: 'Eventos', icon: Calendar },
    { href: '/admin/productos', label: 'Productos', icon: Package },
    { href: '/admin/configuracion', label: 'Configuración', icon: Settings },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/admin/login');
        router.refresh();
    };

    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    return (
        <div className="h-screen bg-gray-50 flex overflow-hidden">
            {/* Overlay para cerrar sidebar en móvil */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Desktop siempre visible, Móvil deslizable */}
            <aside className={`
                fixed md:static inset-y-0 left-0 z-50
                w-64 bg-white shadow-xl border-r border-gray-200
                transform transition-transform duration-300 ease-in-out
                ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0 md:flex flex-col
            `}>
                {/* Header del Sidebar */}
                <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800">
                        Maranatha <span className="text-primary">Admin</span>
                    </h1>
                    {/* Botón cerrar solo en móvil */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Navegación */}
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${active
                                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="font-medium">{item.label}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="p-4 border-t border-gray-100 space-y-1">
                    <Link
                        href="/"
                        target="_blank"
                        className="flex items-center gap-3 w-full px-4 py-3 text-gray-600 rounded-xl hover:bg-gray-100 hover:text-gray-900 transition-colors"
                    >
                        <ExternalLink className="w-5 h-5" />
                        <span className="font-medium">Ver Tienda</span>
                    </Link>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 rounded-xl hover:bg-red-50 transition-colors cursor-pointer"
                    >
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {/* Header Móvil */}
                <header className="bg-white shadow-sm h-16 md:hidden flex items-center px-4 gap-4 shrink-0 border-b border-gray-100">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">Panel Admin</h1>
                </header>

                {/* Contenido con scroll */}
                <div className="flex-1 overflow-y-auto">
                    <div className="p-4 md:p-8">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
}
