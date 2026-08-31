import type { Metadata, Viewport } from 'next';
import '../styles/globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppButton from '../components/WhatsAppButton';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'HAVA Global Trade – Commerce International & Sourcing depuis la Turquie',
  description:
    'HAVA Global Trade relie les marchés mondiaux aux meilleurs fabricants industriels et artisans de Turquie. Textile, Mobilier, Santé, Agroalimentaire.',
  keywords: [
    'import export turquie',
    'sourcing turquie',
    'b2b istanbul',
    'grossiste textile turquie',
    'fabricant mobilier turquie',
    'cosmetique turque export',
    'agroalimentaire turc',
  ],
  icons: {
    icon: '/file/HAVA GLOBAL TRADİNG.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="/file/HAVA GLOBAL TRADİNG.png" />
      </head>
      <body>
        <Navbar />
        {children}
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
