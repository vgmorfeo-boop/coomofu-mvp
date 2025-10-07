import AdminGuard from "@/components/AdminGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <AdminGuard>
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900">Panel de Administración</h1>
          <nav className="flex gap-4 text-sm">
            <a className="text-slate-600 hover:text-[#166534]" href="/admin">Inicio</a>
            <a className="text-slate-600 hover:text-[#166534]" href="/admin/routes">Rutas & Horarios</a>
          </nav>
        </header>
        {children}
      </AdminGuard>
    </div>
  );
}
