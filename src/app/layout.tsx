import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MobileNav from '@/components/MobileNav';
import Chatbot from '@/components/Chatbot';

export const metadata: Metadata = {
  title: 'Cake Box Guntur — Fresh Bakes. Sweet Moments. Delivered.',
  description:
    'Order fresh celebration cakes, birthday cakes, pastries, pizzas, burgers, chocolates, and snacks from Cake Box Brodipet, Guntur. Fast delivery across Guntur with live order tracking.',
  keywords: [
    'Cake Box Guntur',
    'Bakery in Guntur',
    'Cake delivery Guntur',
    'Brodipet bakery',
    'Birthday cake Guntur',
    'Eggless cake Guntur',
    'Pizza delivery Guntur',
  ],
  authors: [{ name: 'Cake Box Guntur' }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col selection:bg-[#E85A71] selection:text-white" style={{ fontFamily: "'Outfit', sans-serif" }}>
        <AuthProvider>
          <CartProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
            <MobileNav />
            <Chatbot />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
