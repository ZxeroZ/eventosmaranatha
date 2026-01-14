import CloudinaryTest from '@/components/CloudinaryTest';
import SupabaseTest from '@/components/SupabaseTest';

export default function TestConnectionPage() {
    return (
        <div className="min-h-screen p-8 max-w-2xl mx-auto font-[family-name:var(--font-geist-sans)]">
            <h1 className="text-3xl font-bold mb-8 text-center">Verificación de Conexiones</h1>

            <div className="space-y-8">
                <SupabaseTest />
                <CloudinaryTest />
            </div>

            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
                <p className="font-bold">Pasos Siguientes:</p>
                <ul className="list-disc list-inside mt-2">
                    <li>Si Supabase falla: Verifica NEXT_PUBLIC_SUPABASE_URL y Key en .env.local</li>
                    <li>Si Cloudinary falla: Verifica Cloud Name y crea un "Upload Preset" en tu dashboard de Cloudinary (Settings - Upload - Add upload preset) y ponle nombre "ml_default" o actualiza el componente.</li>
                </ul>
            </div>
        </div>
    );
}
