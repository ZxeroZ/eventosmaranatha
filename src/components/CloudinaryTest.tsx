'use client';

import { CldUploadWidget } from 'next-cloudinary';
import { useState } from 'react';

export default function CloudinaryTest() {
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    return (
        <div className="p-4 border rounded-lg bg-white shadow-sm">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                📸 Prueba de Cloudinary
            </h3>

            <div className="mb-4">
                <CldUploadWidget
                    uploadPreset="ml_default"
                    options={{
                        sources: ['local', 'url'],
                        multiple: false,
                        maxFiles: 1
                    }}
                    onSuccess={(result: any) => {
                        console.log('Upload success:', result);
                        setUploadedUrl(result.info.secure_url);
                        setError(null);
                    }}
                    onError={(err: any) => {
                        console.error('Upload error:', err);
                        // Cloudinary a veces devuelve el error como string o como objeto
                        const errorMsg = typeof err === 'string' ? err : err?.statusText || 'Error desconocido';
                        setError(`Error al subir: ${errorMsg}. Revisa que tu "Upload Preset" sea "Unsigned".`);
                    }}
                >
                    {({ open }) => {
                        return (
                            <button
                                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                                onClick={() => open()}
                            >
                                Subir Imagen
                            </button>
                        );
                    }}
                </CldUploadWidget>
            </div>

            {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md border border-red-200 text-sm">
                    <p className="font-bold">⚠️ Falló la subida</p>
                    <p>{error}</p>
                </div>
            )}

            {uploadedUrl && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-green-700 font-bold mb-2">✅ ¡Imagen subida correctamente!</p>
                    <div className="relative aspect-video w-full max-w-md overflow-hidden rounded-lg border border-gray-300 bg-gray-100">
                        <img
                            src={uploadedUrl}
                            alt="Uploaded preview"
                            className="w-full h-full object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
