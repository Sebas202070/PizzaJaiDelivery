'use client';
import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        <SessionProvider>
          <Navbar />
          <div className="flex-grow">{children}</div> {/* Agregado flex-grow */}
          <Footer/>
        </SessionProvider>
      </body>
    </html>
  );
}