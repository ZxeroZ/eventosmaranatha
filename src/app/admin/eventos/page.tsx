'use client';

import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save, Loader2 } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

type Evento = Database['public']['Tables']['eventos']['Row'];

export default function EventosPage() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvento, setCurrentEvento] = useState<Partial<Evento>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchEventos();
    }, []);

    async function fetchEventos() {
        try {
            const { data, error } = await supabase
                .from('eventos')
                .select('*')
                .order('orden', { ascending: true });

            if (error) throw error;
            setEventos(data || []);
        } catch (error) {
            console.error('Error fetching eventos:', error);
            alert('Error al cargar eventos');
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        try {
            if (currentEvento.id) {
                // Update
                const updatePayload: Database['public']['Tables']['eventos']['Update'] = {
                    nombre: currentEvento.nombre,
                    descripcion: currentEvento.descripcion,
                    orden: currentEvento.orden,
                    activo: currentEvento.activo,
                    imagen_url: currentEvento.imagen_url
                };
                const { error } = await (supabase
                    .from('eventos') as any)
                    .update(updatePayload)
                    .eq('id', currentEvento.id);
                if (error) throw error;
            } else {
                // Insert
                const insertPayload: Database['public']['Tables']['eventos']['Insert'] = {
                    nombre: currentEvento.nombre!,
                    descripcion: currentEvento.descripcion,
                    orden: currentEvento.orden || 0,
                    activo: currentEvento.activo !== undefined ? currentEvento.activo : true,
                    imagen_url: currentEvento.imagen_url
                };
                const { error } = await (supabase
                    .from('eventos') as any)
                    .insert([insertPayload]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            setCurrentEvento({});
            fetchEventos();
        } catch (error) {
            console.error('Error saving evento:', error);
            alert('Error al guardar el evento');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Estás seguro? Esto borrará también todos los productos asociados.')) return;

        try {
            const { error } = await supabase.from('eventos').delete().eq('id', id);
            if (error) throw error;
            fetchEventos();
        } catch (error) {
            console.error('Error deleting evento:', error);
            alert('Error al eliminar');
        }
    }

    function openEdit(evento: Evento) {
        setCurrentEvento(evento);
        setIsModalOpen(true);
    }

    function openNew() {
        setCurrentEvento({ activo: true, orden: 0 });
        setIsModalOpen(true);
    }

    if (loading) return <div className="p-8 text-center">Cargando eventos...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestionar Eventos</h1>
                <button
                    onClick={openNew}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
                >
                    <Plus size={20} /> Nuevo Evento
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Orden</th>
                            <th className="p-4 font-semibold text-gray-600">Nombre</th>
                            <th className="p-4 font-semibold text-gray-600">Descripción</th>
                            <th className="p-4 font-semibold text-gray-600">Estado</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {eventos.map((evento) => (
                            <tr key={evento.id} className="hover:bg-gray-50">
                                <td className="p-4 text-gray-500">{evento.orden}</td>
                                <td className="p-4 font-medium text-gray-900">{evento.nombre}</td>
                                <td className="p-4 text-gray-500 truncate max-w-xs">{evento.descripcion || '-'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${evento.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {evento.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => openEdit(evento)}
                                        className="text-indigo-600 hover:text-indigo-800 p-1"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(evento.id)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {eventos.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No hay eventos registrados. ¡Crea el primero!
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal / Formulario Flotante */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">
                                {currentEvento.id ? 'Editar Evento' : 'Nuevo Evento'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                    value={currentEvento.nombre || ''}
                                    onChange={e => setCurrentEvento({ ...currentEvento, nombre: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Foto de Portada</label>
                                <div className="flex items-center gap-4">
                                    {currentEvento.imagen_url && (
                                        <img src={currentEvento.imagen_url} alt="Portada" className="w-16 h-16 object-cover rounded" />
                                    )}
                                    <CldUploadWidget
                                        uploadPreset="ml_default"
                                        onSuccess={(result: any) => {
                                            setCurrentEvento({ ...currentEvento, imagen_url: result.info.secure_url });
                                        }}
                                    >
                                        {({ open }: any) => (
                                            <button
                                                type="button"
                                                onClick={() => open()}
                                                className="text-sm bg-gray-100 text-gray-700 px-3 py-2 rounded hover:bg-gray-200 border border-gray-300"
                                            >
                                                {currentEvento.imagen_url ? 'Cambiar Imagen' : 'Subir Imagen'}
                                            </button>
                                        )}
                                    </CldUploadWidget>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                <textarea
                                    className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                    rows={3}
                                    value={currentEvento.descripcion || ''}
                                    onChange={e => setCurrentEvento({ ...currentEvento, descripcion: e.target.value })}
                                />
                            </div>

                            <div className="flex gap-4">
                                <div className="w-1/2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Orden</label>
                                    <input
                                        type="number"
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={currentEvento.orden || 0}
                                        onChange={e => setCurrentEvento({ ...currentEvento, orden: parseInt(e.target.value) })}
                                    />
                                </div>
                                <div className="w-1/2 flex items-center mt-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                            checked={currentEvento.activo ?? true}
                                            onChange={e => setCurrentEvento({ ...currentEvento, activo: e.target.checked })}
                                        />
                                        <span className="text-sm font-medium text-gray-700">Activo</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 flex items-center gap-2"
                                >
                                    {saving && <Loader2 className="animate-spin w-4 h-4" />}
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
