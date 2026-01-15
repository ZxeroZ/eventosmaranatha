import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HeroCarousel from "@/components/HeroCarousel";

export default async function Home() {
  const supabase = await createClient();

  // Obtener eventos activos
  const { data: eventos } = await supabase
    .from('eventos')
    .select('*')
    .eq('activo', true)
    .order('orden', { ascending: true }) as any;

  return (
    <div className="min-h-screen bg-white">
      {/* Header + Hero combinados en grid 50/50 */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 gap-6 lg:gap-10 min-h-screen py-3 sm:py-5 lg:py-6">
          {/* Columna izquierda - Todo el contenido */}
          <div className="flex flex-col">
            {/* Navbar */}
            <nav className="flex items-center justify-between py-3 sm:py-4 lg:py-5">
              {/* Botón hamburguesa móvil - izquierda */}
              <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Logo - centrado en móvil */}
              <Link href="/" className="flex items-center gap-2 md:order-first">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">
                  Maranatha
                </span>
              </Link>

              {/* Enlaces Desktop */}
              <div className="hidden md:flex items-center gap-6">
                <Link href="#servicios" className="link-underline text-secondary-dark hover:text-primary font-medium text-sm transition-colors">
                  Servicios
                </Link>
                <Link href="#contacto" className="link-underline text-secondary-dark hover:text-primary font-medium text-sm transition-colors">
                  Contacto
                </Link>
              </div>

              {/* Espaciador móvil para centrar logo */}
              <div className="w-10 md:hidden"></div>
            </nav>

            {/* Contenido Hero - debajo del navbar */}
            <div className="flex-1 flex flex-col justify-center py-3 sm:py-6 lg:py-10">
              {/* Subtítulo - centrado en móvil */}
              <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-wider mb-3 sm:mb-4 text-center lg:text-left">
                CREAMOS MOMENTOS INOLVIDABLES
              </p>

              {/* Título para móvil - estilo escalera */}
              <h1 className="sm:hidden text-3xl font-bold text-gray-900 leading-tight mb-4 text-center">
                <span className="text-primary">Decoramos</span>
                <br />
                tus momentos
              </h1>

              {/* Título principal - Desktop - Estilo escalera */}
              <h1 className="hidden sm:block text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6 lg:text-left">
                Estilo,
                <br />
                <span className="text-primary">Color y Emoción</span>
                <br />
                en Cada Evento
              </h1>

              {/* Botón CTA - oculto en móvil */}
              <div className="hidden sm:block mb-8 sm:mb-12">
                <Link
                  href="https://wa.me/51999999999"
                  target="_blank"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-5 py-2.5 rounded-full font-medium border border-gray-200 shadow-sm transition-all text-sm"
                >
                  Cotizar Ahora
                  <span className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              </div>

              {/* Estadísticas - Un solo contenedor con divisor */}
              <div className="hidden md:inline-flex bg-gray-100 rounded-2xl items-center max-w-sm shadow-primary-sm">
                {/* Contador */}
                <div className="px-5 py-4">
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">50 +</p>
                  <p className="text-xs sm:text-sm text-gray-500">Clientes satisfechos</p>
                </div>

                {/* Línea divisoria */}
                <div className="w-px h-16 bg-gray-300"></div>

                {/* Card descripción */}
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 shrink-0 overflow-hidden rounded-xl">
                    <img
                      src="/img/mesas.jpeg"
                      alt="Evento"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-[180px]">
                    Decoraciones premium y arreglos florales para tu evento.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Columna derecha - Carrusel de imágenes */}
          <div className="relative h-[40vh] sm:h-[50vh] lg:h-full order-first lg:order-last">
            <div className="relative w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden">
              <HeroCarousel
                images={[
                  "/img/mesas.jpeg",
                  "/img/blanco.webp",
                  "/img/rosado.webp"
                ]}
              />

              {/* Botón flotante - Cotizar - oculto en móvil */}
              <div className="hidden sm:block absolute top-4 sm:top-6 right-4 sm:right-6">
                <button className="bg-primary hover:bg-primary-dark backdrop-blur-sm text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-colors cursor-pointer">
                  Cotizar
                </button>
              </div>
            </div>

            {/* Botón Cotizar Ahora - Solo móvil, debajo de imagen */}
            <div className="sm:hidden mt-3 flex justify-center">
              <Link
                href="https://wa.me/51999999999"
                target="_blank"
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full font-medium transition-colors text-sm shadow-lg"
              >
                Cotizar Ahora
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="servicios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 sm:mb-4">
          Nuestros <span className="text-primary">Servicios</span>
        </h2>
        <p className="text-center text-gray-500 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
          Descubre todo lo que podemos hacer para tu próximo evento
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {eventos?.map((evento: any) => (
            <Link href={`/eventos/${evento.id}`} key={evento.id} className="group flex justify-center">
              <div className="relative h-72 sm:h-80 w-full max-w-[240px] rounded-3xl overflow-hidden bg-gray-100 shadow-md transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl">
                {/* Imagen de fondo */}
                <div className="absolute inset-0">
                  {evento.imagen_url ? (
                    <img
                      src={evento.imagen_url}
                      alt={evento.nombre}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                      <span className="text-white text-5xl sm:text-6xl">🎉</span>
                    </div>
                  )}
                </div>

                {/* Pastilla blanca inferior */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{evento.nombre}</h3>
                    {evento.descripcion && (
                      <p className="text-gray-500 text-sm line-clamp-2">{evento.descripcion}</p>
                    )}
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {(!eventos || eventos.length === 0) && (
            <div className="col-span-full text-center py-12 sm:py-16 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
              <div className="text-4xl sm:text-5xl mb-4">🎉</div>
              <p className="text-gray-500 font-medium text-sm sm:text-base">Próximamente más servicios</p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">¡Contáctanos para conocer nuestro catálogo!</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer id="contacto" className="bg-gray-900 text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">M</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold">
              Maranatha
            </h3>
          </div>
          <p className="text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
            Creamos momentos inolvidables para ti y los tuyos
          </p>
          <div className="flex justify-center gap-3 sm:gap-4 mb-6 sm:mb-8">
            <Link
              href="https://wa.me/51999999999"
              target="_blank"
              className="bg-primary hover:bg-primary-dark text-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold transition-colors inline-flex items-center gap-2 text-sm sm:text-base"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </Link>
          </div>
          <p className="text-gray-500 text-xs sm:text-sm">© {new Date().getFullYear()} Eventos Maranatha. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}
