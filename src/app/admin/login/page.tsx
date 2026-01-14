'use client';

import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Lock, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Usamos FormData para asegurar que capturamos lo que el navegador rellenó
        const formData = new FormData(e.currentTarget);
        const emailInput = formData.get('email') as string;
        const passwordInput = formData.get('password') as string;

        console.log("Intentando iniciar sesión con:", emailInput);
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: emailInput,
                password: passwordInput,
            });

            console.log("Respuesta de Supabase:", { data, error });

            if (error) {
                // Mensaje amigable si el error es "Email not confirmed"
                if (error.message.includes("Email not confirmed")) {
                    throw new Error("El correo no ha sido confirmado. Revisa tu consola de Supabase (Authentication -> Providers -> Email -> Confirm email: OFF) y crea el usuario de nuevo.");
                }
                throw error;
            }

            console.log("Login exitoso, redirigiendo...");
            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            console.error("Error capturado:", err);
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg border border-gray-100">
                <div className="text-center">
                    <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-indigo-600" />
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-900">Panel Admin</h2>
                    <p className="mt-2 text-sm text-gray-600">Eventos Maranatha</p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleLogin}>
                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="email" className="sr-only">Correo electrónico</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Contraseña</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <Loader2 className="animate-spin w-4 h-4" />
                                    <span>Entrando...</span>
                                </div>
                            ) : (
                                'Iniciar Sesión'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
