import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import HeroCarousel from "@/components/HeroCarousel";
import ServicesCarousel from "@/components/ServicesCarousel";
import ProductCard from "@/components/ProductCard";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const supabase = await createClient();

  // Obtener eventos activos
  const { data: eventos } = await supabase
    .from('eventos')
    .select('*')
    .eq('activo', true)
    .order('nombre', { ascending: true }) as any;

  // Obtener productos activos con info del evento
  const { data: productos } = await supabase
    .from('productos')
    .select('*, eventos(nombre)')
    .eq('activo', true)
    .order('created_at', { ascending: false })
    .limit(8) as any;

  // Obtener configuración general (redes sociales, teléfono, dirección)
  const { data: config } = await supabase
    .from('configuracion')
    .select('clave, valor, categoria')
    .eq('mostrar', true) as any;

  const redesSociales = config?.filter((c: any) => c.categoria === 'redes_sociales') || [];
  const telefono = config?.find((c: any) => c.clave === 'telefono')?.valor;
  const direccion = config?.find((c: any) => c.clave === 'direccion')?.valor;

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
            <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-black/20"></div>
          </div>

          {/* Navbar flotante transparente */}
          <Navbar eventos={eventos || []} redesSociales={redesSociales || []} variant="transparent" />
        </div>

        {/* Contenido de texto debajo de la imagen */}
        <div className="px-5 sm:px-8 md:px-12 py-8 sm:py-10 md:py-12 text-center">
          {/* Subtítulo */}
          <p className="text-xs sm:text-sm font-medium text-gray-500 uppercase tracking-widest mb-5 sm:mb-6">
            CREAMOS MOMENTOS INOLVIDABLES
          </p>

          {/* Título - Estilo escalera igual que desktop */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-snug mb-8 sm:mb-10">
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
            <Navbar eventos={eventos || []} redesSociales={redesSociales || []} variant="solid" />


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
                  href="#productos"
                  className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-900 px-5 py-2.5 rounded-full font-medium border border-gray-200 shadow-sm transition-all text-sm"
                >
                  Ver Decoraciones
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
      <section id="servicios" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 pb-8 sm:pb-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 relative inline-block">
            Nuestros <span className="text-primary">Servicios</span>
            <span className="block w-16 h-1 bg-primary mx-auto mt-2 rounded-full"></span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-lg">
            Descubre todo lo que podemos hacer para tu próximo evento
          </p>
        </div>

        <ServicesCarousel eventos={eventos || []} />

        {/* Botón ver todos los servicios */}
        <div className="text-center mt-8 sm:mt-10">
          <Link
            href="/servicios"
            className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 sm:px-8 sm:py-3 rounded-full font-medium shadow-sm transition-all text-sm sm:text-base"
          >
            Ver todos los servicios
            <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Products Section - Siempre visible */}
      <section id="productos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 relative inline-block">
            Nuestras <span className="text-primary">Creaciones</span>
            <span className="block w-16 h-1 bg-primary mx-auto mt-2 rounded-full"></span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-lg">
            Conoce algunas de nuestras mejores opciones para tu evento
          </p>
        </div>

        {/* Grilla de productos - Sin carrusel */}
        {productos && productos.length > 0 ? (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
              {productos.map((producto: any) => (
                <ProductCard key={producto.id} producto={producto} />
              ))}
            </div>

            {/* Botón ver todos */}
            <div className="text-center mt-8 sm:mt-10">
              <Link
                href="/productos"
                className="inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white px-6 py-3 sm:px-8 sm:py-3 rounded-full font-medium shadow-sm transition-all text-sm sm:text-base"
              >
                Ver todos los productos
                <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </>
        ) : (
          <div className="text-center py-12 sm:py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <div className="text-4xl sm:text-5xl mb-4">📦</div>
            <p className="text-gray-500 font-medium text-sm sm:text-base">Próximamente más productos</p>
            <p className="text-xs sm:text-sm text-gray-400 mt-1">¡Contáctanos para conocer nuestro catálogo completo!</p>
          </div>
        )}
      </section>

      {/* Galería Destacada - Momentos Inolvidables */}
      <section className="bg-white py-8 sm:py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 relative inline-block">
              Momentos <span className="text-primary">Inolvidables</span>
              <span className="block w-16 h-1 bg-primary mx-auto mt-2 rounded-full"></span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-lg">
              Mira algunos de los trabajos que hemos hecho con mucho cariño para nuestros clientes. ¡Gracias por confiar en nosotros!
            </p>
          </div>

          <div className="max-w-5xl mx-auto mb-8 sm:mb-10">
            {/* Galería Bento Responsive */}
            <div className="grid grid-cols-2 gap-4 h-[500px] sm:h-[600px]">
              {/* Imagen 1 (Blanco) -> Móvil: Pos 1 / Desktop: Pos 2 (Derecha Arriba) */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg group order-1 md:order-2">
                <img
                  src="/img/blanco.webp"
                  alt="Decoración Minimalista"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>

              {/* Imagen 2 (Rosado) -> Móvil: Pos 2 / Desktop: Pos 3 (Derecha Abajo) */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg group order-2 md:order-3">
                <img
                  src="/img/rosado.webp"
                  alt="Quinceaños"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>

              {/* Imagen Principal (Mesas) -> Móvil: Pos 3 (Abajo Ancho) / Desktop: Pos 1 (Izquierda Alto) */}
              <div className="relative rounded-3xl overflow-hidden shadow-lg group order-3 col-span-2 md:order-1 md:col-span-1 md:row-span-2">
                <img
                  src="/img/mesas.jpeg"
                  alt="Decoración de Boda"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Por Qué Elegirnos - Tarjetas Sutiles */}
      <section className="bg-white pt-8 sm:pt-10 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 relative inline-block">
              ¿Por qué <span className="text-primary">Elegirnos?</span>
              <span className="block w-16 h-1 bg-primary mx-auto mt-2 rounded-full"></span>
            </h2>
            <p className="text-gray-500 max-w-2xl mx-auto text-sm md:text-lg">
              Nuestra experiencia y dedicación garantizan el éxito de tu evento.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Item 1 */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl shadow-primary/20">
              <div className="w-14 h-14 bg-white text-primary rounded-2xl flex items-center justify-center mb-5 mx-auto shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Diseño Único</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Hacemos que la decoración de tu evento quede tal como la imaginaste.
              </p>
            </div>

            {/* Item 2 */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl shadow-primary/20">
              <div className="w-14 h-14 bg-white text-primary rounded-2xl flex items-center justify-center mb-5 mx-auto shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Cero Estrés</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Nos encargamos de preparar todo para que tú solo te dediques a disfrutar.
              </p>
            </div>

            {/* Item 3 */}
            <div className="bg-white rounded-2xl p-8 text-center shadow-xl shadow-primary/20">
              <div className="w-14 h-14 bg-white text-primary rounded-2xl flex items-center justify-center mb-5 mx-auto shadow-sm">
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Inolvidable</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Llenamos tu fiesta de detalles lindos que a todos les van a encantar.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer
        redesSociales={redesSociales}
        eventos={eventos || []}
        direccion={direccion}
        telefono={telefono}
      />
    </div>
  );
}

