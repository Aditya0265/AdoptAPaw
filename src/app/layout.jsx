import { Inter, Montserrat } from 'next/font/google';
import Providers from '../components/Providers';

import '../styles/globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'AdoptAPaw - Find Your Perfect Pet Companion',
  description: 'AdoptAPaw is a platform for dog adoption in India, connecting rescued dogs with loving families.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="min-h-screen font-sans">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}