'use client';

import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, ArrowRight } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = new FormData(e.currentTarget);
        const emailInput = formData.get('email') as string;
        const passwordInput = formData.get('password') as string;

        setLoading(true);
        setError(null);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: emailInput,
                password: passwordInput,
            });

            if (error) {
                if (error.message.includes("Email not confirmed")) {
                    throw new Error("El correo no ha sido confirmado.");
                }
                if (error.message.includes("Invalid login credentials")) {
                    throw new Error("Credenciales incorrectas.");
                }
                throw error;
            }

            router.push('/admin');
            router.refresh();
        } catch (err: any) {
            setError(err.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 relative overflow-hidden px-4">
            {/* Background Gradients similar to Contact/Home */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-white to-pink-50/50" />
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-20 left-10 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="max-w-md w-full relative z-10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-3xl shadow-xl shadow-pink-100 mb-6 group transform transition-transform hover:scale-110 duration-500">
                        <span className="text-4xl font-bold text-primary group-hover:rotate-12 transition-transform duration-500">M</span>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Bienvenido</h2>
                    <p className="mt-3 text-gray-500 font-medium">Panel de Administración Maranatha</p>
                </div>

                <div className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 backdrop-blur-sm">
                    <form className="space-y-6" onSubmit={handleLogin}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-3">
                                <div className="shrink-0 text-red-500 mt-0.5">
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <p className="text-sm font-medium text-red-600">{error}</p>
                            </div>
                        )}

                        <div className="space-y-5">
                            <div className="space-y-2">
                                <label htmlFor="email" className="text-sm font-bold text-gray-700 uppercase tracking-wide ml-1">
                                    Correo electrónico
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    className="block w-full px-5 py-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder-gray-400 font-medium"
                                    placeholder="admin@maranatha.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <label htmlFor="password" className="text-sm font-bold text-gray-700 uppercase tracking-wide ml-1">
                                    Contraseña
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    className="block w-full px-5 py-4 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:bg-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all placeholder-gray-400 font-medium"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full flex items-center justify-center gap-2 py-4 px-6 border border-transparent text-base font-bold rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-primary/30 hover:shadow-xl hover:shadow-primary/40 transition-all hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin w-5 h-5" />
                                        <span>Iniciando...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Ingresar</span>
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>

                <p className="text-center text-gray-400 mt-8 text-xs font-medium uppercase tracking-widest">
                    &copy; {new Date().getFullYear()} Eventos Maranatha
                </p>
            </div>
        </div>
    );
}