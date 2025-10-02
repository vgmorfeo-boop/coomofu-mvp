import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Coomofu · MVP Intermunicipal",
  description: "Compra de tiquetes intermunicipales de forma fácil.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        {/* Header */}
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-6xl px-4 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold text-coomofu-blue">
              Coomofu <span className="text-slate-600">MVP</span>
            </Link>
            <nav className="flex gap-4 text-sm">
              <Link href="/search" className="text-slate-600 hover:text-coomofu-blue">
                Buses
              </Link>
              <Link href="/tours" className="text-slate-600 hover:text-coomofu-blue">
                Tours
              </Link>
              <Link href="/about" className="text-slate-600 hover:text-coomofu-blue">
                Nosotros
              </Link>
            </nav>
          </div>
        </header>

        {/* Contenido dinámico */}
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>

        {/* Footer */}
        <footer className="mt-16 border-t border-slate-200 py-8 text-center text-xs text-slate-500">
          Demo para reunión con Coomofu · Construido con Next.js · {new Date().getFullYear()}
        </footer>
      </body>
    </html>
  );
}
