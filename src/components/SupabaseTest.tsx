'use client';

import { supabase } from '@/lib/supabase/client';
import { useEffect, useState } from 'react';

export default function SupabaseTest() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        async function checkConnection() {
            try {
                const { data, error } = await supabase
                    .from('eventos')
                    .select('*')
                    .limit(5);

                if (error) throw error;

                setStatus('success');
                setMessage('Conexión exitosa con Supabase');
                setData(data || []);
            } catch (err: any) {
                setStatus('error');
                setMessage(err.message || 'Error conectando con Supabase');
            }
        }

        checkConnection();
    }, []);

    return (
        <div className="p-4 border rounded-lg mb-8">
            <h3 className="text-lg font-bold mb-4">Prueba de Supabase</h3>

            {status === 'loading' && <p>Verificando conexión...</p>}

            {status === 'error' && (
                <div className="text-red-500">
                    <p>Error: {message}</p>
                    <p className="text-sm mt-2 text-gray-600">Revisa tus variables de entorno (.env.local)</p>
                </div>
            )}

            {status === 'success' && (
                <div>
                    <p className="text-green-600 font-semibold mb-2">{message}</p>
                    <p className="text-sm text-gray-600 mb-2">Eventos encontrados: {data.length}</p>
                    <div className="bg-gray-100 p-2 rounded text-xs font-mono max-h-40 overflow-auto">
                        {JSON.stringify(data, null, 2)}
                    </div>
                </div>
            )}
        </div>
    );
}
