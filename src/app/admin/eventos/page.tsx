'use client';

import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';
import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Calendar, Upload } from 'lucide-react';
import Image from 'next/image';

type Evento = Database['public']['Tables']['eventos']['Row'];

export default function EventosPage() {
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentEvento, setCurrentEvento] = useState<Partial<Evento>>({});
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; evento: Evento | null }>({ open: false, evento: null });
    const [deleting, setDeleting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchEventos();
    }, []);

    async function fetchEventos() {
        try {
            const { data, error } = await supabase
                .from('eventos')
                .select('*')
                .order('nombre', { ascending: true }) as any;

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
                const updatePayload: Database['public']['Tables']['eventos']['Update'] = {
                    nombre: currentEvento.nombre,
                    descripcion: currentEvento.descripcion,
                    activo: currentEvento.activo,
                    imagen_url: currentEvento.imagen_url
                };
                const { error } = await (supabase
                    .from('eventos') as any)
                    .update(updatePayload)
                    .eq('id', currentEvento.id);
                if (error) throw error;
            } else {
                const insertPayload: Database['public']['Tables']['eventos']['Insert'] = {
                    nombre: currentEvento.nombre!,
                    descripcion: currentEvento.descripcion,
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

    async function handleDelete() {
        if (!deleteModal.evento) return;

        setDeleting(true);
        try {
            const { error } = await supabase.from('eventos').delete().eq('id', deleteModal.evento.id);
            if (error) throw error;
            setDeleteModal({ open: false, evento: null });
            fetchEventos();
        } catch (error) {
            console.error('Error deleting evento:', error);
            alert('Error al eliminar');
        } finally {
            setDeleting(false);
        }
    }

    function openEdit(evento: Evento) {
        setCurrentEvento(evento);
        setIsModalOpen(true);
    }

    function openNew() {
        setCurrentEvento({ activo: true });
        setIsModalOpen(true);
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Eventos</h1>
                    <p className="text-gray-500 text-sm mt-1">Categorías para organizar tus productos</p>
                </div>
                <button
                    onClick={openNew}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                    <Plus size={20} />
                    <span>Nuevo Evento</span>
                </button>
            </div>

            {/* Grid de eventos */}
            {eventos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {eventos.map((evento) => (
                        <div
                            key={evento.id}
                            className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group hover:shadow-md transition-all"
                        >
                            {/* Imagen */}
                            <div className="aspect-video bg-gray-100 relative overflow-hidden">
                                {evento.imagen_url ? (
                                    <Image
                                        src={evento.imagen_url}
                                        alt={evento.nombre}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10">
                                        <Calendar className="w-12 h-12 text-primary/40" />
                                    </div>
                                )}
                                {/* Badge de estado */}
                                <div className="absolute top-3 right-3">
                                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${evento.activo
                                        ? 'bg-green-100 text-green-700'
                                        : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {evento.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </div>
                            </div>

                            {/* Info */}
                            <div className="p-4">
                                <h3 className="font-semibold text-gray-900">{evento.nombre}</h3>

                                {/* Acciones */}
                                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                                    <button
                                        onClick={() => openEdit(evento)}
                                        className="flex-1 text-sm font-medium text-gray-600 hover:text-primary py-2 px-3 rounded-lg hover:bg-primary/5 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <Pencil size={16} />
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => setDeleteModal({ open: true, evento })}
                                        className="text-sm font-medium text-red-500 hover:text-red-600 py-2 px-3 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
                    <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Calendar className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">No hay eventos</h3>
                    <p className="text-gray-500 text-sm mb-6">Crea tu primer evento para empezar a organizar productos</p>
                    <button
                        onClick={openNew}
                        className="bg-primary hover:bg-primary-dark text-white px-5 py-2.5 rounded-xl inline-flex items-center gap-2 transition-colors"
                    >
                        <Plus size={18} />
                        Crear evento
                    </button>
                </div>
            )}

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                        {/* Header del modal */}
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">
                                {currentEvento.id ? 'Editar Evento' : 'Nuevo Evento'}
                            </h3>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-5 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Nombre</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="Ej: Bodas"
                                    value={currentEvento.nombre || ''}
                                    onChange={e => setCurrentEvento({ ...currentEvento, nombre: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Imagen de portada</label>

                                {/* Preview de imagen actual */}
                                {currentEvento.imagen_url ? (
                                    <div className="relative mb-3">
                                        <div className="w-full h-40 relative rounded-xl overflow-hidden bg-gray-100">
                                            <Image src={currentEvento.imagen_url} alt="Portada" fill className="object-cover" sizes="400px" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentEvento({ ...currentEvento, imagen_url: undefined })}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    /* Zona de upload */
                                    <div
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full h-40 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                                    >
                                        {uploading ? (
                                            <>
                                                <Loader2 className="w-8 h-8 text-primary animate-spin" />
                                                <p className="text-sm text-gray-500">Subiendo...</p>
                                            </>
                                        ) : (
                                            <>
                                                <Upload className="w-8 h-8 text-gray-400" />
                                                <p className="text-sm text-gray-500">Clic para subir imagen</p>
                                                <p className="text-xs text-gray-400">JPG, PNG, WebP</p>
                                            </>
                                        )}
                                    </div>
                                )}

                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;

                                        setUploading(true);
                                        try {
                                            const formData = new FormData();
                                            formData.append('file', file);
                                            formData.append('upload_preset', 'ml_default');

                                            const res = await fetch(
                                                `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                                                { method: 'POST', body: formData }
                                            );

                                            const data = await res.json();
                                            if (data.secure_url) {
                                                setCurrentEvento({ ...currentEvento, imagen_url: data.secure_url });
                                            }
                                        } catch (error) {
                                            console.error('Error uploading:', error);
                                            alert('Error al subir la imagen');
                                        } finally {
                                            setUploading(false);
                                            if (fileInputRef.current) fileInputRef.current.value = '';
                                        }
                                    }}
                                />
                            </div>

                            {/* Switch Activo */}
                            <div className="flex items-center">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={currentEvento.activo ?? true}
                                            onChange={e => setCurrentEvento({ ...currentEvento, activo: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Activo</span>
                                </label>
                            </div>

                            {/* Acciones del modal */}
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl border border-gray-200 font-medium transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="flex-1 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {saving && <Loader2 className="animate-spin w-4 h-4" />}
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal de confirmación de eliminación */}
            {deleteModal.open && deleteModal.evento && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                        <div className="p-6 text-center">
                            {/* Icono de advertencia */}
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Trash2 className="w-8 h-8 text-red-500" />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                ¿Eliminar evento?
                            </h3>

                            <p className="text-gray-500 text-sm mb-2">
                                Estás por eliminar <span className="font-semibold text-gray-700">{deleteModal.evento.nombre}</span>
                            </p>

                            <p className="text-red-500 text-xs bg-red-50 rounded-lg p-3 mb-6">
                                ⚠️ Esto también eliminará todos los productos asociados a este evento.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeleteModal({ open: false, evento: null })}
                                    disabled={deleting}
                                    className="flex-1 px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl border border-gray-200 font-medium transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting}
                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white px-4 py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
                                >
                                    {deleting && <Loader2 className="animate-spin w-4 h-4" />}
                                    {deleting ? 'Eliminando...' : 'Eliminar'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

    );
}


// hellos