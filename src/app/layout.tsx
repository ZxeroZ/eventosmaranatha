import type { Metadata } from "next";
import { Roboto, Great_Vibes } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-roboto',
});

const greatVibes = Great_Vibes({
  weight: ['400'],
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-great-vibes',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://maranatha-eventos.vercel.app'),
  title: "Eventos Maranatha | Decoración y Servicios para Eventos en Chiclayo",
  description: "Maranatha Eventos en Chiclayo, Perú. Decoración de eventos, toldos, alquiler de menajería y servicio de mozos para bodas, cumpleaños y eventos corporativos.",
  keywords: ["Maranatha Eventos Chiclayo", "decoración de eventos Chiclayo", "toldos para eventos Chiclayo", "alquiler de menajes Chiclayo", "servicio de mozos Chiclayo", "bodas Chiclayo"],
  authors: [{ name: "Maranatha Eventos" }],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Maranatha Eventos | Decoración y Servicios para Eventos en Chiclayo",
    description: "Decoración profesional, toldos y menajes, y servicio de mozos para eventos sociales y corporativos en Chiclayo, Perú.",
    url: 'https://www.maranathaeventos.com',
    siteName: 'Eventos Maranatha',
    images: [
      {
        url: '/img/mesas.jpeg', // Usando imagen existente como fallback de preview.jpg
        width: 1200,
        height: 630,
        alt: 'Eventos Maranatha Chiclayo',
      },
    ],
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Maranatha Eventos Chiclayo',
    description: 'Decoración, alquiler de menajes, toldos y servicio de mozos para eventos en Chiclayo, Perú.',
    images: ['/img/mesas.jpeg'], // Fallback
  },
  other: {
    "geo.region": "PE-LAM",
    "geo.placename": "Chiclayo, Perú",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Eventos Maranatha",
    "image": "https://maranatha-eventos.vercel.app/img/mesas.jpeg",
    "description": "Decoración de eventos, toldos, alquiler de menajería y servicio de mozos para bodas, cumpleaños y eventos corporativos en Chiclayo, Perú.",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chiclayo",
      "addressRegion": "Lambayeque",
      "addressCountry": "PE"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -6.7714,
      "longitude": -79.8411
    },
    "url": "https://www.maranathaeventos.com",
    "telephone": "+51999999999",
    "priceRange": "$$",
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday"
      ],
      "opens": "09:00",
      "closes": "18:00"
    },
    "sameAs": [
      "https://www.facebook.com/maranathaeventos",
      "https://www.instagram.com/maranathaeventos"
    ]
  };

  return (
    <html lang="es">
      <body className={`${roboto.variable} ${greatVibes.variable} font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
