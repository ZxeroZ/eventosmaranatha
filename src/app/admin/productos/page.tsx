'use client';

import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';
import { useEffect, useState, useRef } from 'react';
import { Plus, Pencil, Trash2, X, Loader2, Package, Upload, Star, Images, Search, Filter } from 'lucide-react';
import Image from 'next/image';

type Producto = Database['public']['Tables']['productos']['Row'];
type Evento = Database['public']['Tables']['eventos']['Row'];
type GaleriaFoto = Database['public']['Tables']['galeria_fotos']['Row'];

export default function ProductosPage() {
    const [productos, setProductos] = useState<Producto[]>([]);
    const [eventos, setEventos] = useState<Evento[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentProducto, setCurrentProducto] = useState<Partial<Producto>>({});
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [deleteModal, setDeleteModal] = useState<{ open: boolean; producto: Producto | null }>({ open: false, producto: null });
    const [deleting, setDeleting] = useState(false);
    const [galeria, setGaleria] = useState<GaleriaFoto[]>([]);
    const [uploadingGaleria, setUploadingGaleria] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const galeriaInputRef = useRef<HTMLInputElement>(null);

    // Search and filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEvento, setSelectedEvento] = useState<string>('all');

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [productosRes, eventosRes] = await Promise.all([
                (supabase.from('productos').select('*, eventos(nombre)').order('created_at', { ascending: false }) as any),
                (supabase.from('eventos').select('*').eq('activo', true).order('nombre', { ascending: true }) as any)
            ]);

            if (productosRes.error) throw productosRes.error;
            if (eventosRes.error) throw eventosRes.error;

            setProductos(productosRes.data || []);
            setEventos(eventosRes.data || []);
        } catch (error: any) {
            console.error('Error fetching data:', error);
            console.error('Error details:', {
                message: error?.message,
                details: error?.details,
                hint: error?.hint,
                code: error?.code
            });
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

        if (!currentProducto.foto_principal) {
            alert('Debes subir una imagen principal');
            return;
        }

        setSaving(true);
        try {
            if (currentProducto.id) {
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

    async function handleDelete() {
        if (!deleteModal.producto) return;

        setDeleting(true);
        try {
            const { error } = await (supabase.from('productos') as any).delete().eq('id', deleteModal.producto.id);
            if (error) throw error;
            setDeleteModal({ open: false, producto: null });
            fetchData();
        } catch (error) {
            console.error('Error deleting producto:', error);
            alert('Error al eliminar');
        } finally {
            setDeleting(false);
        }
    }

    function openEdit(producto: Producto) {
        setCurrentProducto(producto);
        setIsModalOpen(true);
        fetchGaleria(producto.id);
    }

    function openNew() {
        setCurrentProducto({ activo: true, destacado: false });
        setGaleria([]);
        setIsModalOpen(true);
    }

    async function fetchGaleria(productoId: string) {
        try {
            const { data, error } = await supabase
                .from('galeria_fotos')
                .select('*')
                .eq('producto_id', productoId)
                .order('created_at', { ascending: true }) as any;

            if (error) throw error;
            setGaleria(data || []);
        } catch (error) {
            console.error('Error fetching galeria:', error);
        }
    }

    async function handleUploadGaleria(file: File) {
        if (!currentProducto.id) {
            alert('Primero guarda el producto para agregar fotos a la galería');
            return;
        }

        setUploadingGaleria(true);
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
                const { error } = await (supabase
                    .from('galeria_fotos') as any)
                    .insert([{
                        producto_id: currentProducto.id,
                        url_foto: data.secure_url,
                        orden: galeria.length
                    }]);

                if (error) throw error;
                fetchGaleria(currentProducto.id);
            }
        } catch (error) {
            console.error('Error uploading to galeria:', error);
            alert('Error al subir la imagen');
        } finally {
            setUploadingGaleria(false);
        }
    }

    async function handleDeleteGaleriaFoto(fotoId: string) {
        if (!currentProducto.id) return;

        try {
            const { error } = await supabase
                .from('galeria_fotos')
                .delete()
                .eq('id', fotoId) as any;

            if (error) throw error;
            fetchGaleria(currentProducto.id);
        } catch (error) {
            console.error('Error deleting galeria foto:', error);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    // Filter products based on search and selected evento
    const filteredProductos = productos.filter((producto: any) => {
        const matchesSearch = producto.titulo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            producto.descripcion?.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesEvento = selectedEvento === 'all' || producto.evento_id === selectedEvento;
        return matchesSearch && matchesEvento;
    });

    // Group filtered products by evento
    const productosPorEvento = filteredProductos.reduce((acc: any, producto: any) => {
        const eventoId = producto.evento_id || 'sin-categoria';
        const eventoNombre = producto.eventos?.nombre || 'Sin categoría';

        if (!acc[eventoId]) {
            acc[eventoId] = {
                nombre: eventoNombre,
                productos: []
            };
        }
        acc[eventoId].productos.push(producto);
        return acc;
    }, {});

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Productos</h1>
                    <p className="text-gray-500 text-sm mt-1">
                        {filteredProductos.length} de {productos.length} producto{productos.length !== 1 ? 's' : ''}
                    </p>
                </div>
                <button
                    onClick={openNew}
                    className="bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors shadow-sm cursor-pointer"
                >
                    <Plus size={20} />
                    <span>Nuevo Producto</span>
                </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Search Bar */}
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    </div>

                    {/* Category Filter */}
                    <div className="sm:w-64 relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                        <select
                            value={selectedEvento}
                            onChange={(e) => setSelectedEvento(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all appearance-none bg-white cursor-pointer"
                        >
                            <option value="all">Todas las categorías</option>
                            {eventos.map((evento) => (
                                <option key={evento.id} value={evento.id}>
                                    {evento.nombre}
                                </option>
                            ))}
                            <option value="sin-categoria">Sin categoría</option>
                        </select>
                    </div>

                    {/* Clear Filters Button */}
                    {(searchQuery || selectedEvento !== 'all') && (
                        <button
                            onClick={() => {
                                setSearchQuery('');
                                setSelectedEvento('all');
                            }}
                            className="px-4 py-2.5 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl transition-colors text-sm font-medium"
                        >
                            Limpiar
                        </button>
                    )}
                </div>
            </div>

            {/* Products grouped by category */}
            <div className="space-y-4">
                {Object.entries(productosPorEvento).map(([eventoId, grupo]: [string, any]) => (
                    <div key={eventoId} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Category Header */}
                        <div className="bg-gradient-to-r from-primary/5 to-primary/10 px-5 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                                        <Package className="w-5 h-5 text-primary" />
                                    </div>
                                    <div>
                                        <h2 className="font-bold text-gray-900">{grupo.nombre}</h2>
                                        <p className="text-sm text-gray-500">{grupo.productos.length} producto{grupo.productos.length !== 1 ? 's' : ''}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Products Table */}
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-gray-50 border-b border-gray-100">
                                    <tr>
                                        <th className="p-4 font-semibold text-gray-600 text-sm">Producto</th>
                                        <th className="p-4 font-semibold text-gray-600 text-sm">Estado</th>
                                        <th className="p-4 font-semibold text-gray-600 text-sm text-right">Acciones</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {grupo.productos.map((producto: any) => (
                                        <tr key={producto.id} className="hover:bg-gray-50/50 transition-colors">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 relative shrink-0">
                                                        {producto.foto_principal ? (
                                                            <Image
                                                                src={producto.foto_principal}
                                                                alt={producto.titulo}
                                                                fill
                                                                sizes="48px"
                                                                className="object-cover"
                                                            />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                <Package size={20} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900">{producto.titulo}</p>
                                                        {producto.destacado && (
                                                            <span className="inline-flex items-center gap-1 text-xs text-amber-600 mt-0.5">
                                                                <Star size={12} fill="currentColor" />
                                                                Destacado
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${producto.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                    {producto.activo ? 'Activo' : 'Inactivo'}
                                                </span>
                                            </td>
                                            <td className="p-4 text-right">
                                                <div className="flex items-center justify-end gap-1">
                                                    <button
                                                        onClick={() => openEdit(producto)}
                                                        className="p-2 text-gray-500 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
                                                        title="Editar"
                                                    >
                                                        <Pencil size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteModal({ open: true, producto })}
                                                        className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ))}

                {filteredProductos.length === 0 && (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                        <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500 font-medium">
                            {searchQuery || selectedEvento !== 'all' ? 'No se encontraron productos' : 'No hay productos'}
                        </p>
                        <p className="text-gray-400 text-sm mt-1">
                            {searchQuery || selectedEvento !== 'all' ? 'Intenta con otros filtros' : 'Crea tu primer producto'}
                        </p>
                    </div>
                )}
            </div>

            {/* Modal de crear/editar */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white">
                            <h3 className="text-lg font-bold text-gray-900">
                                {currentProducto.id ? 'Editar Producto' : 'Nuevo Producto'}
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
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Título</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                                    placeholder="Nombre del producto"
                                    value={currentProducto.titulo || ''}
                                    onChange={e => setCurrentProducto({ ...currentProducto, titulo: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Categoría</label>
                                <select
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all cursor-pointer"
                                    value={currentProducto.evento_id || ''}
                                    onChange={e => setCurrentProducto({ ...currentProducto, evento_id: e.target.value })}
                                >
                                    <option value="">Selecciona una categoría...</option>
                                    {eventos.map(evento => (
                                        <option key={evento.id} value={evento.id}>{evento.nombre}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Foto</label>

                                {currentProducto.foto_principal ? (
                                    <div className="relative mb-2">
                                        <div className="w-full h-48 relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
                                            <Image src={currentProducto.foto_principal} alt="Preview" fill className="object-contain" sizes="400px" />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setCurrentProducto({ ...currentProducto, foto_principal: undefined })}
                                            className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors cursor-pointer"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
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
                                                setCurrentProducto({ ...currentProducto, foto_principal: data.secure_url });
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

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Descripción</label>
                                <textarea
                                    required
                                    className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                                    rows={3}
                                    placeholder="Descripción del producto"
                                    value={currentProducto.descripcion || ''}
                                    onChange={e => setCurrentProducto({ ...currentProducto, descripcion: e.target.value })}
                                />
                            </div>

                            {/* Galería de fotos */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                    Galería de fotos
                                    {currentProducto.id && <span className="text-gray-400 font-normal ml-1">({galeria.length} fotos)</span>}
                                </label>

                                {currentProducto.id ? (
                                    <div className="grid grid-cols-4 gap-2">
                                        {galeria.map((foto) => (
                                            <div key={foto.id} className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group">
                                                <Image
                                                    src={foto.url_foto}
                                                    alt=""
                                                    fill
                                                    className="object-cover"
                                                    sizes="100px"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => handleDeleteGaleriaFoto(foto.id)}
                                                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ))}

                                        {/* Botón agregar foto */}
                                        <div
                                            onClick={() => galeriaInputRef.current?.click()}
                                            className="aspect-square border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-1 cursor-pointer hover:border-primary hover:bg-primary/5 transition-all"
                                        >
                                            {uploadingGaleria ? (
                                                <Loader2 className="w-5 h-5 text-primary animate-spin" />
                                            ) : (
                                                <>
                                                    <Plus className="w-5 h-5 text-gray-400" />
                                                    <span className="text-xs text-gray-400">Agregar</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl text-center">
                                        <Images className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                                        <p className="text-sm text-gray-500">Guarda el producto primero para agregar fotos a la galería</p>
                                    </div>
                                )}

                                <input
                                    ref={galeriaInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            handleUploadGaleria(file);
                                        }
                                        if (galeriaInputRef.current) galeriaInputRef.current.value = '';
                                    }}
                                />
                            </div>

                            {/* Switches */}
                            <div className="flex items-center gap-6 py-2">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={currentProducto.activo ?? true}
                                            onChange={e => setCurrentProducto({ ...currentProducto, activo: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-primary transition-colors"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Activo</span>
                                </label>

                                <label className="flex items-center gap-3 cursor-pointer">
                                    <div className="relative">
                                        <input
                                            type="checkbox"
                                            className="sr-only peer"
                                            checked={currentProducto.destacado ?? false}
                                            onChange={e => setCurrentProducto({ ...currentProducto, destacado: e.target.checked })}
                                        />
                                        <div className="w-11 h-6 bg-gray-200 rounded-full peer-checked:bg-amber-400 transition-colors"></div>
                                        <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">Destacado</span>
                                </label>
                            </div>

                            {/* Botones */}
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
            )
            }

            {/* Modal de confirmación de eliminación */}
            {
                deleteModal.open && deleteModal.producto && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden">
                            <div className="p-6 text-center">
                                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Trash2 className="w-8 h-8 text-red-500" />
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 mb-2">
                                    ¿Eliminar producto?
                                </h3>

                                <p className="text-gray-500 text-sm mb-6">
                                    Estás por eliminar <span className="font-semibold text-gray-700">{deleteModal.producto.titulo}</span>
                                </p>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setDeleteModal({ open: false, producto: null })}
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
                )
            }
        </div >
    );
}
