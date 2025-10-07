export default function AdminHome() {
  return (
    <div className="space-y-4">
      <div className="card">
        <h2 className="text-xl font-bold">Bienvenido(a)</h2>
        <p className="text-slate-600">
          Usa el menú para configurar <b>Rutas & Horarios</b>. Los cambios se guardan en tu
          navegador y la página pública de búsqueda usará esta configuración para listar salidas.
        </p>
      </div>

      <div className="card">
        <h3 className="font-semibold mb-2">Flujo de demo</h3>
        <ol className="list-decimal ml-6 text-slate-700 space-y-1">
          <li>Entra a <b>Rutas & Horarios</b> y agrega una ruta (ej: Bogotá → Girardot).</li>
          <li>Define horario (ej: 05:00–21:00 cada 60 min) y precio base.</li>
          <li>Abre la página pública y busca esa ruta: verás salidas generadas con tu config.</li>
        </ol>
      </div>
    </div>
  );
}
