"use client";

import { useEffect, useState } from "react";

const DEMO_PASS = "coomofu2025";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false);
  const [ask, setAsk] = useState(false);
  const [input, setInput] = useState("");

  useEffect(() => {
    const t = localStorage.getItem("admin_token");
    if (t === "ok") setOk(true);
    else setAsk(true);
  }, []);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (input === DEMO_PASS) {
      localStorage.setItem("admin_token", "ok");
      setOk(true);
      setAsk(false);
    } else {
      alert("Clave incorrecta");
    }
  }

  if (ok) return <>{children}</>;

  if (!ask) return null;

  return (
    <div className="max-w-md mx-auto mt-16 card">
      <h2 className="text-xl font-bold mb-3">Acceso administrador</h2>
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="input"
          type="password"
          placeholder="Clave de administrador"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button className="btn btn-primary w-full" type="submit">Entrar</button>
      </form>
      <p className="text-xs text-slate-500 mt-3">
        Demo: clave preconfigurada para presentación.
      </p>
    </div>
  );
}
