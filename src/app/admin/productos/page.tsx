'use client';

import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';
import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';

type Producto = Database['public']['Tables']['productos']['Row'];
type Evento = Database['public']['Tables']['eventos']['Row'];

export default function ProductosPage() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProducto, setCurrentProducto] = useState<Partial<Producto>>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [productosRes, eventosRes] = await Promise.all([
                supabase.from('productos').select('*, eventos(nombre)').order('created_at', { ascending: false }),
                supabase.from('eventos').select('*').eq('activo', true).order('orden', { ascending: true })
            ]);

            if (productosRes.error) throw productosRes.error;
            if (eventosRes.error) throw eventosRes.error;

            setProductos(productosRes.data || []);
            setEventos(eventosRes.data || []);
        } catch (error) {
            console.error('Error fetching data:', error);
            alert('Error al cargar datos');
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();

        if (!currentProducto.evento_id) {
            alert('Debes seleccionar un evento/categoría');
            return;
        }

        setSaving(true);
        try {
            if (currentProducto.id) {
                // Update
                const updatePayload: Database['public']['Tables']['productos']['Update'] = {
                    titulo: currentProducto.titulo,
                    descripcion: currentProducto.descripcion,
                    evento_id: currentProducto.evento_id,
                    foto_principal: currentProducto.foto_principal,
                    destacado: currentProducto.destacado,
                    activo: currentProducto.activo
                };
                const { error } = await (supabase
                    .from('productos') as any)
                    .update(updatePayload)
                    .eq('id', currentProducto.id);
                if (error) throw error;
            } else {
                // Insert
                const insertPayload: Database['public']['Tables']['productos']['Insert'] = {
                    titulo: currentProducto.titulo!,
                    descripcion: currentProducto.descripcion!,
                    evento_id: currentProducto.evento_id,
                    foto_principal: currentProducto.foto_principal!,
                    destacado: currentProducto.destacado || false,
                    activo: currentProducto.activo !== undefined ? currentProducto.activo : true
                };
                const { error } = await (supabase
                    .from('productos') as any)
                    .insert([insertPayload]);
                if (error) throw error;
            }

            setIsModalOpen(false);
            setCurrentProducto({});
            fetchData();
        } catch (error) {
            console.error('Error saving producto:', error);
            alert('Error al guardar el producto');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete(id: string) {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            const { error } = await supabase.from('productos').delete().eq('id', id);
            if (error) throw error;
            fetchData();
        } catch (error) {
            console.error('Error deleting producto:', error);
            alert('Error al eliminar');
        }
    }

    function openEdit(producto: Producto) {
        setCurrentProducto(producto);
        setIsModalOpen(true);
    }

    function openNew() {
        setCurrentProducto({ activo: true, destacado: false });
        setIsModalOpen(true);
    }

    if (loading) return <div className="p-8 text-center">Cargando productos...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Gestionar Productos</h1>
                <button
                    onClick={openNew}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
                >
                    <Plus size={20} /> Nuevo Producto
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold text-gray-600">Imagen</th>
                            <th className="p-4 font-semibold text-gray-600">Título</th>
                            <th className="p-4 font-semibold text-gray-600">Categoría</th>
                            <th className="p-4 font-semibold text-gray-600">Estado</th>
                            <th className="p-4 font-semibold text-gray-600 text-right">Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {productos.map((producto: any) => (
                            <tr key={producto.id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <div className="w-12 h-12 rounded overflow-hidden bg-gray-100">
                                        <img
                                            src={producto.foto_principal}
                                            alt={producto.titulo}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-gray-900">
                                    {producto.titulo}
                                    {producto.destacado && <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">Destacado</span>}
                                </td>
                                <td className="p-4 text-gray-500">{producto.eventos?.nombre || 'Sin categoría'}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded-full text-xs ${producto.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {producto.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td className="p-4 text-right space-x-2">
                                    <button
                                        onClick={() => openEdit(producto)}
                                        className="text-indigo-600 hover:text-indigo-800 p-1"
                                        title="Editar"
                                    >
                                        <Pencil size={18} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(producto.id)}
                                        className="text-red-500 hover:text-red-700 p-1"
                                        title="Eliminar"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {productos.length === 0 && (
                            <tr>
                                <td colSpan={5} className="p-8 text-center text-gray-500">
                                    No hay productos registrados.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">
                                {currentProducto.id ? 'Editar Producto' : 'Nuevo Producto'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={currentProducto.titulo || ''}
                                        onChange={e => setCurrentProducto({ ...currentProducto, titulo: e.target.value })}
                                    />
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Categoría (Evento)</label>
                                    <select
                                        required
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                        value={currentProducto.evento_id || ''}
                                        onChange={e => setCurrentProducto({ ...currentProducto, evento_id: e.target.value })}
                                    >
                                        <option value="">Selecciona una categoría...</option>
                                        {eventos.map(evento => (
                                            <option key={evento.id} value={evento.id}>{evento.nombre}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Foto Principal</label>
                                    <div className="flex items-start gap-4 p-4 border border-dashed border-gray-300 rounded-lg bg-gray-50">
                                        {currentProducto.foto_principal ? (
                                            <div className="relative w-32 h-32 rounded-lg overflow-hidden border border-gray-200">
                                                <img src={currentProducto.foto_principal} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                        ) : (
                                            <div className="w-32 h-32 flex items-center justify-center bg-gray-200 rounded-lg text-gray-400">
                                                <ImageIcon size={32} />
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <CldUploadWidget
                                                uploadPreset="ml_default"
                                                onSuccess={(result: any) => {
                                                    setCurrentProducto({ ...currentProducto, foto_principal: result.info.secure_url });
                                                }}
                                            >
                                                {({ open }: any) => (
                                                    <button
                                                        type="button"
                                                        onClick={() => open()}
                                                        className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-50 shadow-sm"
                                                    >
                                                        {currentProducto.foto_principal ? 'Cambiar Imagen' : 'Subir Imagen'}
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                            <p className="mt-2 text-xs text-gray-500">
                                                Sube una foto de alta calidad que represente el producto.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
                                    <textarea
                                        required
                                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-indigo-500 outline-none"
                                        rows={4}
                                        value={currentProducto.descripcion || ''}
                                        onChange={e => setCurrentProducto({ ...currentProducto, descripcion: e.target.value })}
                                    />
                                </div>

                                <div className="flex items-center gap-4 mt-2">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                                            checked={currentProducto.activo ?? true}
                                            onChange={e => setCurrentProducto({ ...currentProducto, activo: e.target.checked })}
                                        />
                                        <span className="text-sm font-medium text-gray-700">Activo</span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                                            checked={currentProducto.destacado ?? false}
                                            onChange={e => setCurrentProducto({ ...currentProducto, destacado: e.target.checked })}
                                        />
                                        <span className="text-sm font-medium text-gray-700">Destacado</span>
                                    </label>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100">
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
                                    Guardar Producto
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
