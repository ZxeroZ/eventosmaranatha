'use client';

import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';
import { useEffect, useState } from 'react';
import { Save, Loader2, RefreshCw, HelpCircleIcon } from 'lucide-react';

type Configuracion = Database['public']['Tables']['configuracion']['Row'];

export default function ConfiguracionPage() {
    const [config, setConfig] = useState<Configuracion[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchConfig();
    }, []);

    async function fetchConfig() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('configuracion')
                .select('*')
                .order('clave', { ascending: true });

            if (error) throw error;
            setConfig(data || []);
        } catch (error) {
            console.error('Error fetching config:', error);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(id: string, valor: string) {
        setSaving(true);
        try {
            const { error } = await (supabase
                .from('configuracion') as any)
                .update({ valor })
                .eq('id', id);

            if (error) throw error;
            // Update local state without refetching everything for smoothness
            setConfig(prev => prev.map(item => item.id === id ? { ...item, valor } : item));
            alert('Guardado exitosamente');
        } catch (error) {
            console.error('Error saving config:', error);
            alert('Error al guardar');
        } finally {
            setSaving(false);
        }
    }

    // Helper to group configs by category
    const groupedConfig = config.reduce((acc, item) => {
        const cat = item.categoria || 'general';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {} as Record<string, Configuracion[]>);

    if (loading && config.length === 0) return <div className="p-8 text-center">Cargando configuración...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Configuración del Sitio</h1>
                    <p className="text-gray-500 text-sm">Administra los textos, contactos y redes sociales visibles en la web.</p>
                </div>
                <button
                    onClick={fetchConfig}
                    className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-gray-100 transition-colors"
                    title="Recargar"
                >
                    <RefreshCw size={20} />
                </button>
            </div>

            {Object.keys(groupedConfig).length === 0 && !loading && (
                <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500">
                    No hay configuraciones registradas. Agrega claves en la base de datos (tabla 'configuracion') para que aparezcan aquí.
                </div>
            )}

            <div className="space-y-8">
                {Object.entries(groupedConfig).map(([categoria, items]) => (
                    <div key={categoria} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-700 capitalize">
                                {categoria.replace('_', ' ')}
                            </h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {items.map((item) => (
                                <div key={item.id} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start border-b border-gray-50 last:border-0 pb-6 last:pb-0">
                                    <div className="md:col-span-1">
                                        <label className="block text-sm font-medium text-gray-900 mb-1 capitalize">
                                            {item.clave.replace(/_/g, ' ')}
                                        </label>
                                        <span className="text-xs text-gray-500 font-mono bg-gray-100 px-1 py-0.5 rounded">
                                            {item.clave}
                                        </span>
                                    </div>
                                    <div className="md:col-span-2 flex gap-2">
                                        <div className="flex-1">
                                            {item.tipo === 'textarea' ? (
                                                <textarea
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                                    rows={3}
                                                    defaultValue={item.valor}
                                                    onBlur={(e) => {
                                                        if (e.target.value !== item.valor) {
                                                            handleSave(item.id, e.target.value);
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <input
                                                    type="text"
                                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                                                    defaultValue={item.valor}
                                                    onBlur={(e) => {
                                                        if (e.target.value !== item.valor) {
                                                            handleSave(item.id, e.target.value);
                                                        }
                                                    }}
                                                />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
