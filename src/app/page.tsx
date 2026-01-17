import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HeroCarousel from "@/components/HeroCarousel";
import ServicesCarousel from "@/components/ServicesCarousel";
import Navbar from "@/components/Navbar";

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
      {/* ============ HERO MÓVIL / TABLET - Imagen 50% arriba ============ */}
      <div className="lg:hidden">
        {/* Contenedor de imagen + navbar flotante */}
        <div className="relative h-[50vh]">
          {/* Carrusel de fondo */}
          <div className="absolute inset-0 rounded-b-3xl overflow-hidden">
            <HeroCarousel
              images={[
                "/img/mesas.jpeg",
                "/img/blanco.webp",
                "/img/rosado.webp"
              ]}
            />
            {/* Overlay sutil */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20"></div>
          </div>

          {/* Navbar flotante transparente */}
          <Navbar eventos={eventos || []} variant="transparent" />
        </div>

        {/* Contenido de texto debajo de la imagen */}
        <div className="px-5 sm:px-8 md:px-12 py-8 sm:py-10 md:py-12 text-center">
          {/* Subtítulo */}
          <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-widest mb-5 sm:mb-6">
            CREAMOS MOMENTOS INOLVIDABLES
          </p>

          {/* Título - Estilo escalera igual que desktop */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-snug mb-8 sm:mb-10">
            Estilo,
            <br />
            <span className="text-primary">Color y Emoción</span>
            <br />
            en Cada Evento
          </h1>

          {/* Estadísticas - Contenedor completo */}
          <div className="inline-flex bg-gray-100 rounded-2xl items-center shadow-sm mb-8 sm:mb-10">
            {/* Contador */}
            <div className="px-4 sm:px-5 py-3 sm:py-4">
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">50 +</p>
              <p className="text-xs sm:text-sm text-gray-500">Clientes satisfechos</p>
            </div>

            {/* Línea divisoria */}
            <div className="w-px h-12 sm:h-14 bg-gray-300"></div>

            {/* Card descripción con imagen */}
            <div className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 shrink-0 overflow-hidden rounded-xl">
                <img src="/img/mesas.jpeg" alt="Evento" className="w-full h-full object-cover" />
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed text-left max-w-[120px] sm:max-w-[150px]">
                Decoraciones premium para tu evento.
              </p>
            </div>
          </div>

          {/* Botón CTA */}
          <div>
            <Link
              href="https://wa.me/51999999999"
              target="_blank"
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-8 sm:px-10 py-3.5 sm:py-4 rounded-full font-medium transition-colors text-sm sm:text-base shadow-lg"
            >
              Cotizar Ahora
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* ============ HERO DESKTOP (solo laptop+) ============ */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 gap-8 lg:gap-12 min-h-screen py-4 lg:py-6">
          {/* Columna izquierda - Todo el contenido */}
          <div className="flex flex-col">
            {/* Navbar Desktop */}
            <Navbar eventos={eventos || []} variant="solid" />

            {/* Contenido Hero Desktop */}
            <div className="flex-1 flex flex-col justify-center py-8 lg:py-12">
              {/* Subtítulo */}
              <p className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-4">
                CREAMOS MOMENTOS INOLVIDABLES
              </p>

              {/* Título principal - Desktop - Estilo escalera */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight mb-6">
                Estilo,
                <br />
                <span className="text-primary">Color y Emoción</span>
                <br />
                en Cada Evento
              </h1>

              {/* Botón CTA */}
              <div className="mb-8 lg:mb-12">
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

              {/* Estadísticas */}
              <div className="hidden md:inline-flex bg-gray-100 rounded-2xl items-center max-w-sm shadow-primary-sm">
                <div className="px-5 py-4">
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900">50 +</p>
                  <p className="text-xs lg:text-sm text-gray-500">Clientes satisfechos</p>
                </div>
                <div className="w-px h-16 bg-gray-300"></div>
                <div className="flex items-center gap-4 px-5 py-4">
                  <div className="w-16 h-16 lg:w-20 lg:h-20 shrink-0 overflow-hidden rounded-xl">
                    <img src="/img/mesas.jpeg" alt="Evento" className="w-full h-full object-cover" />
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed max-w-[180px]">
                    Decoraciones premium y arreglos florales para tu evento.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha - Carrusel de imágenes */}
          <div className="relative h-[40vh] lg:h-full order-first lg:order-last">
            <div className="relative w-full h-full rounded-3xl overflow-hidden">
              <HeroCarousel
                images={[
                  "/img/mesas.jpeg",
                  "/img/blanco.webp",
                  "/img/rosado.webp"
                ]}
              />

              {/* Botón flotante - Cotizar */}
              <div className="absolute top-6 right-6">
                <button className="bg-primary hover:bg-primary-dark backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-sm font-medium transition-colors cursor-pointer">
                  Cotizar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="servicios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-6 md:py-8 lg:py-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-3 sm:mb-4">
          Nuestros <span className="text-primary">Servicios</span>
        </h2>
        <p className="text-center text-gray-500 mb-8 sm:mb-12 max-w-2xl mx-auto text-sm sm:text-base">
          Descubre todo lo que podemos hacer para tu próximo evento
        </p>

        <ServicesCarousel eventos={eventos || []} />
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
