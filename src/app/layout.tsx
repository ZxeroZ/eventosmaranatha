import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ["latin"],
  display: 'swap',
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
  return (
    <html lang="es">
      <body className={`${roboto.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
