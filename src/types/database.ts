export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            eventos: {
                Row: {
                    id: string
                    nombre: string
                    descripcion: string | null
                    icono: string | null
                    imagen_url: string | null
                    orden: number
                    activo: boolean
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    nombre: string
                    descripcion?: string | null
                    icono?: string | null
                    imagen_url?: string | null
                    orden?: number
                    activo?: boolean
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    nombre?: string
                    descripcion?: string | null
                    icono?: string | null
                    imagen_url?: string | null
                    orden?: number
                    activo?: boolean
                    created_at?: string
                    updated_at?: string
                }
            }
            productos: {
                Row: {
                    id: string
                    evento_id: string
                    titulo: string
                    descripcion: string
                    foto_principal: string
                    precio: number | null
                    destacado: boolean
                    activo: boolean
                    orden: number
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    evento_id: string
                    titulo: string
                    descripcion: string
                    foto_principal: string
                    precio?: number | null
                    destacado?: boolean
                    activo?: boolean
                    orden?: number
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    evento_id?: string
                    titulo?: string
                    descripcion?: string
                    foto_principal?: string
                    precio?: number | null
                    destacado?: boolean
                    activo?: boolean
                    orden?: number
                    created_at?: string
                    updated_at?: string
                }
            }
            galeria_fotos: {
                Row: {
                    id: string
                    producto_id: string
                    url_foto: string
                    alt_text: string | null
                    orden: number
                    created_at: string
                }
                Insert: {
                    id?: string
                    producto_id: string
                    url_foto: string
                    alt_text?: string | null
                    orden?: number
                    created_at?: string
                }
                Update: {
                    id?: string
                    producto_id?: string
                    url_foto?: string
                    alt_text?: string | null
                    orden?: number
                    created_at?: string
                }
            }
            configuracion: {
                Row: {
                    id: string
                    clave: string
                    valor: string
                    tipo: string
                    categoria: string
                    mostrar: boolean
                    updated_at: string
                }
                Insert: {
                    id?: string
                    clave: string
                    valor: string
                    tipo?: string
                    categoria?: string
                    mostrar?: boolean
                    updated_at?: string
                }
                Update: {
                    id?: string
                    clave?: string
                    valor?: string
                    tipo?: string
                    categoria?: string
                    mostrar?: boolean
                    updated_at?: string
                }
            }
        },
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
        CompositeTypes: {
            [_ in never]: never
        }
    }
}
