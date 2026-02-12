'use client';

import { supabase } from '@/lib/supabase/client';
import { Database } from '@/types/database';
import { useEffect, useState } from 'react';
import {
    Save,
    Loader2,
    Globe,
    Phone,
    Share2,
    Info,
    Settings,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    Youtube,
    MessageCircle,
    LayoutGrid,
    Plus,
    X,
    Twitter,
    CheckCircle2,
    Music2,
    Trash2,
    AlertTriangle
} from 'lucide-react';

type Configuracion = Database['public']['Tables']['configuracion']['Row'];

// Mapeo de iconos por categoría
const categoryIcons: Record<string, React.ReactNode> = {
    general: <Globe className="w-5 h-5" />,
    contacto: <Phone className="w-5 h-5" />,
    redes_sociales: <Share2 className="w-5 h-5" />,
    informacion: <Info className="w-5 h-5" />,
};

// Mapeo de iconos específicos por clave
const keyIcons: Record<string, React.ReactNode> = {
    email: <Mail className="w-4 h-4" />,
    telefono: <Phone className="w-4 h-4" />,
    direccion: <MapPin className="w-4 h-4" />,
    facebook: <Facebook className="w-4 h-4" />,
    instagram: <Instagram className="w-4 h-4" />,
    youtube: <Youtube className="w-4 h-4" />,
    whatsapp: <MessageCircle className="w-4 h-4" />,
    twitter: <Twitter className="w-4 h-4" />,
    tiktok: <Music2 className="w-4 h-4" />,
};

const SOCIAL_OPTIONS = [
    { id: 'facebook', label: 'Facebook', icon: <Facebook className="w-4 h-4" /> },
    { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-4 h-4" /> },
    { id: 'youtube', label: 'YouTube', icon: <Youtube className="w-4 h-4" /> },
    { id: 'tiktok', label: 'TikTok', icon: <Music2 className="w-4 h-4" /> },
    { id: 'twitter', label: 'X (Twitter)', icon: <Twitter className="w-4 h-4" /> },
    { id: 'whatsapp', label: 'WhatsApp', icon: <MessageCircle className="w-4 h-4" /> },
];

const labelMapping: Record<string, string> = {
    descripcion: 'Mensaje de Saludo (WhatsApp)',
    descripcion_negocio: 'Mensaje de Saludo (WhatsApp)',
    descripcion_del_negocio: 'Mensaje de Saludo (WhatsApp)',
};

export default function ConfiguracionPage() {
    const [config, setConfig] = useState<Configuracion[]>([]);
    const [formData, setFormData] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ show: boolean, message: string, type: 'success' | 'error' } | null>(null);

    // Estados para crear nueva configuración
    const [showAddModal, setShowAddModal] = useState(false);
    const [newItem, setNewItem] = useState({ clave: 'facebook', valor: '', categoria: 'redes_sociales', tipo: 'text' });
    const [creating, setCreating] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);

    // Estado para modal de confirmación de eliminación
    const [deleteConfirm, setDeleteConfirm] = useState<{ id: string, clave: string } | null>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    useEffect(() => {
        if (toast?.show) {
            const timer = setTimeout(() => {
                setToast(null);
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    async function fetchConfig() {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('configuracion')
                .select('*')
                .order('categoria', { ascending: true })
                .order('clave', { ascending: true }) as any;

            if (error) throw error;

            // Campos requeridos por defecto
            const requiredFields = [
                { clave: 'telefono', categoria: 'contacto', tipo: 'text' },
                { clave: 'email', categoria: 'contacto', tipo: 'text' },
                { clave: 'direccion', categoria: 'informacion', tipo: 'text' } // Ahora en informacion para balancear
            ];

            const combinedData = [...(data || [])];
            const initialData: Record<string, string> = {};

            // Procesar datos existentes
            data?.forEach((item: Configuracion) => {
                initialData[item.id] = item.valor;
            });

            // Inyectar campos faltantes
            requiredFields.forEach(field => {
                if (!combinedData.some(item => item.clave === field.clave)) {
                    const tempId = `new_${field.clave}`; // ID temporal
                    combinedData.push({
                        id: tempId,
                        clave: field.clave,
                        valor: '',
                        categoria: field.categoria,
                        tipo: field.tipo,
                        mostrar: true,
                        updated_at: new Date().toISOString()
                    } as Configuracion);
                    initialData[tempId] = '';
                }
            });

            setConfig(combinedData);
            setFormData(initialData);
        } catch (error) {
            console.error('Error fetching config:', error);
            showToast('Error al cargar la configuración', 'error');
        } finally {
            setLoading(false);
        }
    }

    async function handleSave() {
        setSaving(true);
        try {
            const updates = config.filter(item => formData[item.id] !== item.valor);

            if (updates.length === 0) {
                setSaving(false);
                return;
            }

            // Separar o diferenciar inserts de updates
            const itemsToUpdate = updates.filter(item => !item.id.startsWith('new_'));
            const itemsToInsert = updates.filter(item => item.id.startsWith('new_'));

            // Ejecutar Updates
            if (itemsToUpdate.length > 0) {
                await Promise.all(itemsToUpdate.map(item =>
                    (supabase.from('configuracion') as any)
                        .update({ valor: formData[item.id] })
                        .eq('id', item.id)
                ));
            }

            // Ejecutar Inserts
            if (itemsToInsert.length > 0) {
                await Promise.all(itemsToInsert.map(item =>
                    (supabase.from('configuracion') as any)
                        .insert([{
                            clave: item.clave,
                            valor: formData[item.id],
                            categoria: item.categoria,
                            tipo: item.tipo,
                            mostrar: true
                        }])
                ));
            }

            // Recargar todo para obtener IDs reales
            await fetchConfig();

            showToast('Cambios guardados correctamente', 'success');
        } catch (error) {
            console.error('Error saving config:', error);
            showToast('Error al guardar los cambios', 'error');
        } finally {
            setSaving(false);
        }
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();

        // Verificar si ya existe
        if (config.some(c => c.clave === newItem.clave)) {
            showToast(`La red social ${newItem.clave} ya existe`, 'error');
            return;
        }

        setCreating(true);

        const itemToCreate = {
            ...newItem,
            categoria: 'redes_sociales',
            tipo: 'text',
            mostrar: true
        };

        try {
            const { data, error } = await (supabase
                .from('configuracion') as any)
                .insert([itemToCreate])
                .select()
                .single();

            if (error) throw error;

            setConfig(prev => [...prev, data]);
            setFormData(prev => ({ ...prev, [data.id]: data.valor }));
            setShowAddModal(false);
            setNewItem({ clave: 'tiktok', valor: '', categoria: 'redes_sociales', tipo: 'text' });
            showToast('Red social agregada correctamente', 'success');
        } catch (error) {
            console.error('Error creating config:', error);
            showToast('Error al crear', 'error');
        } finally {
            setCreating(false);
        }
    }

    async function handleDelete() {
        if (!deleteConfirm) return;

        const { id } = deleteConfirm;
        setDeleting(id);

        try {
            const { error } = await (supabase
                .from('configuracion') as any)
                .delete()
                .eq('id', id);

            if (error) throw error;

            setConfig(prev => prev.filter(item => item.id !== id));
            setFormData(prev => {
                const newData = { ...prev };
                delete newData[id];
                return newData;
            });
            showToast('Red social eliminada', 'success');
        } catch (error) {
            console.error('Error deleting:', error);
            showToast('Error al eliminar', 'error');
        } finally {
            setDeleting(null);
            setDeleteConfirm(null);
        }
    }

    function showToast(message: string, type: 'success' | 'error') {
        setToast({ show: true, message, type });
    }

    const handleChange = (id: string, value: string) => {
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    // Inicializar con categorías vacías para asegurar que siempre se muestren
    const groupedConfig = config.reduce((acc, item) => {
        const cat = item.categoria || 'Otros';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
    }, {
        general: [],
        contacto: [],
        redes_sociales: [],
        informacion: []
    } as Record<string, Configuracion[]>);

    const hasChanges = config.some(item => formData[item.id] !== item.valor);

    // Filtrar opciones disponibles
    const availableOptions = SOCIAL_OPTIONS.filter(opt => !config.some(c => c.clave === opt.id));

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-primary">
                <Loader2 className="w-10 h-10 animate-spin mb-4" />
                <p className="font-medium text-gray-500">Cargando configuración...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto pb-10">
            {/* Header Sticky - SIN botón agregar */}
            <div className="sticky top-0 z-10 bg-gray-50/80 backdrop-blur-md pb-6 pt-2">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2.5 rounded-xl text-primary">
                            <Settings className="w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Configuración</h1>
                            <p className="text-gray-500 text-sm">Personaliza la información general de tu sitio</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges || saving}
                            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-medium transition-all shadow-sm ${hasChanges
                                ? 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid de Contenido */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Object.entries(groupedConfig).map(([categoria, items]) => (
                    // Ocultar categorías vacías si no son importantes, pero mostrar redes_sociales siempre para poder agregar
                    (items.length > 0 || categoria === 'redes_sociales') && (
                        <div
                            key={categoria}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100/80 overflow-hidden hover:shadow-md transition-shadow duration-300"
                        >
                            {/* Card Header */}
                            <div className="px-6 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                                <div className="flex items-center gap-3">
                                    <span className="p-2 rounded-lg bg-primary/5 text-primary">
                                        {categoryIcons[categoria] || <LayoutGrid className="w-5 h-5" />}
                                    </span>
                                    <h3 className="font-bold text-gray-800 capitalize text-lg">
                                        {categoria.replace(/_/g, ' ')}
                                    </h3>
                                </div>

                                {/* Botón de agregar SOLO en Redes Sociales */}
                                {categoria === 'redes_sociales' ? (
                                    <button
                                        type="button"
                                        onClick={() => setShowAddModal(true)}
                                        className="p-1.5 hover:bg-white rounded-lg text-primary hover:text-primary-dark border border-transparent hover:border-primary/20 hover:shadow-sm transition-all flex items-center gap-1.5 md:px-3 z-0 relative cursor-pointer"
                                        title="Agregar red social"
                                    >
                                        <Plus className="w-4 h-4" />
                                        <span className="hidden md:inline text-xs font-semibold uppercase tracking-wide">Agregar</span>
                                    </button>
                                ) : (
                                    <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-500 rounded-full border border-gray-200">
                                        {items.length} campos
                                    </span>
                                )}
                            </div>

                            {/* Card Content */}
                            <div className="p-6 space-y-5">
                                {items.length === 0 && (
                                    <p className="text-sm text-gray-400 italic text-center py-4">No hay elementos configurados.</p>
                                )}

                                {items.map((item) => {
                                    const isSocial = categoria === 'redes_sociales';
                                    const inputStyle = "bg-gray-50/50 border-gray-200 focus:border-primary focus:ring-primary/20";
                                    const iconColor = isSocial ? "text-primary" : "text-gray-400";

                                    return (
                                        <div key={item.id} className="group">
                                            {!isSocial && (
                                                <label className="text-sm font-semibold text-gray-700 mb-2 capitalize flex items-center gap-2">
                                                    {keyIcons[item.clave] && (
                                                        <span className="text-gray-400 group-hover:text-primary transition-colors">
                                                            {keyIcons[item.clave]}
                                                        </span>
                                                    )}
                                                    {labelMapping[item.clave] || item.clave.replace(/_/g, ' ')}
                                                </label>
                                            )}

                                            <div className="flex items-center gap-2">
                                                <div className="relative flex-1">
                                                    {/* Icono interior para redes sociales */}
                                                    {isSocial && keyIcons[item.clave] && (
                                                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${iconColor}`}>
                                                            {keyIcons[item.clave]}
                                                        </div>
                                                    )}

                                                    {item.tipo === 'textarea' || ['descripcion', 'descripcion_negocio', 'descripcion_del_negocio'].includes(item.clave) ? (
                                                        <textarea
                                                            value={formData[item.id] || ''}
                                                            onChange={(e) => handleChange(item.id, e.target.value)}
                                                            rows={3}
                                                            className={`w-full px-4 py-3 border rounded-xl outline-none transition-all duration-200 resize-none text-sm text-gray-800 placeholder-gray-400 focus:ring-2 ${inputStyle} ${isSocial ? 'pl-11' : ''}`}
                                                            placeholder={`Ingresa ${item.clave.replace(/_/g, ' ')}...`}
                                                        />
                                                    ) : (
                                                        <input
                                                            type="text"
                                                            value={formData[item.id] || ''}
                                                            onChange={(e) => handleChange(item.id, e.target.value)}
                                                            className={`w-full ${isSocial && keyIcons[item.clave] ? 'pl-11 pr-10' : 'px-4'} py-3 border rounded-xl outline-none transition-all duration-200 text-sm text-gray-800 placeholder-gray-400 focus:ring-2 ${inputStyle}`}
                                                            placeholder={isSocial ? `URL de ${item.clave}` : `Ingresa ${item.clave.replace(/_/g, ' ')}...`}
                                                        />
                                                    )}

                                                    {/* Indicador de cambios */}
                                                    {formData[item.id] !== item.valor && !isSocial && (
                                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 cursor-help" title="Campo modificado">
                                                            <span className="flex h-2 w-2 relative">
                                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Botón eliminar para redes sociales */}
                                                {isSocial && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setDeleteConfirm({ id: item.id, clave: item.clave })}
                                                        disabled={deleting === item.id}
                                                        className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all border border-transparent hover:border-red-100 cursor-pointer disabled:opacity-50"
                                                        title={`Eliminar ${item.clave}`}
                                                    >
                                                        {deleting === item.id ? (
                                                            <Loader2 className="w-4 h-4 animate-spin" />
                                                        ) : (
                                                            <X className="w-4 h-4" />
                                                        )}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                ))}
            </div>

            {/* Modal Agregar Red Social */}
            {showAddModal && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                            <div className="flex items-center gap-2 text-primary">
                                <Share2 className="w-5 h-5" />
                                <h3 className="font-bold text-gray-800 text-lg">Agregar Red Social</h3>
                            </div>
                            <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="p-6 space-y-5">

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Selecciona la red social</label>
                                <div className="space-y-2">
                                    {availableOptions.map(option => (
                                        <label
                                            key={option.id}
                                            className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${newItem.clave === option.id
                                                ? 'border-primary bg-primary/5 text-primary'
                                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            <input
                                                type="radio"
                                                name="social_network"
                                                value={option.id}
                                                checked={newItem.clave === option.id}
                                                onChange={() => setNewItem({ ...newItem, clave: option.id })}
                                                className="hidden"
                                            />
                                            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border border-gray-100 shadow-sm text-gray-600">
                                                {option.icon}
                                            </div>
                                            <span className="font-medium">{option.label}</span>
                                            {newItem.clave === option.id && <CheckCircle2 className="w-5 h-5 ml-auto text-primary" />}
                                        </label>
                                    ))}

                                    {availableOptions.length === 0 && (
                                        <div className="text-center p-4 bg-gray-50 rounded-xl text-gray-500 text-sm">
                                            Ya tienes todas las redes sociales disponibles agregadas.
                                        </div>
                                    )}
                                </div>
                            </div>

                            {availableOptions.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1.5">URL del Perfil</label>
                                    <input
                                        required
                                        type="text"
                                        value={newItem.valor}
                                        onChange={e => setNewItem({ ...newItem, valor: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            )}

                            <div className="pt-2 flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors cursor-pointer"
                                >
                                    Cancelar
                                </button>
                                {availableOptions.length > 0 && (
                                    <button
                                        type="submit"
                                        disabled={creating}
                                        className="flex-1 px-4 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-primary/20"
                                    >
                                        {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                        Agregar
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Modal Confirmación de Eliminación */}
            {deleteConfirm && (
                <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="p-6 text-center">
                            {/* Icono de alerta */}
                            <div className="mx-auto w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mb-4">
                                <AlertTriangle className="w-7 h-7 text-red-600" />
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2">¿Eliminar red social?</h3>
                            <p className="text-gray-500 text-sm mb-6">
                                Estás a punto de eliminar <span className="font-semibold text-gray-700 capitalize">{deleteConfirm.clave}</span>. Esta acción no se puede deshacer.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setDeleteConfirm(null)}
                                    disabled={deleting !== null}
                                    className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={deleting !== null}
                                    className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/20 disabled:opacity-50"
                                >
                                    {deleting ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        <Trash2 className="w-4 h-4" />
                                    )}
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Toast Notification */}
            {toast && (
                <div className={`fixed bottom-6 right-6 flex items-center gap-3 px-5 py-3 rounded-full shadow-lg transform transition-all duration-300 backdrop-blur-md z-100 animate-in slide-in-from-bottom-5 fade-in ${toast.type === 'success'
                    ? 'bg-green-600/90 text-white shadow-green-500/20'
                    : 'bg-red-500/90 text-white shadow-red-500/20'
                    }`}>
                    {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <Info className="w-5 h-5" />}
                    <span className="font-medium text-sm">{toast.message}</span>
                </div>
            )}
        </div>
    );
}
