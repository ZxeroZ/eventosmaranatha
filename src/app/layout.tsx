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
  title: "Eventos Maranatha",
  description: "Creamos momentos inolvidables - Decoraciones, arreglos y eventos para bodas, cumpleaños y ocasiones especiales.",
  openGraph: {
    title: "Eventos Maranatha",
    description: "Decoraciones y organización de eventos exclusivos. Creamos experiencias inolvidables.",
    url: '/',
    siteName: 'Eventos Maranatha',
    images: [
      {
        url: '/img/mesas.jpeg', // Imagen por defecto
        width: 1200,
        height: 630,
        alt: 'Eventos Maranatha Preview',
      },
    ],
    locale: 'es_ES',
    type: 'website',
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
