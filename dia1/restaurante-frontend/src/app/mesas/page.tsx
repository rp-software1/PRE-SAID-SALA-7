"use client";

import { useEffect, useState } from "react";

const API = "http://localhost:3001";

interface Mesa {
  id: number;
  numero: number;
  capacidad: number;
  estado: string;
}

const estadoColors: Record<string, string> = {
  disponible: "border-green-400 bg-green-50",
  ocupada: "border-red-400 bg-red-50",
  reservada: "border-yellow-400 bg-yellow-50",
};

const estadoBadge: Record<string, string> = {
  disponible: "bg-green-100 text-green-700",
  ocupada: "bg-red-100 text-red-700",
  reservada: "bg-yellow-100 text-yellow-700",
};

const nextEstado: Record<string, string> = {
  disponible: "ocupada",
  ocupada: "reservada",
  reservada: "disponible",
};

export default function MesasPage() {
  const [mesas, setMesas] = useState<Mesa[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMesas = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/mesas`);
      if (!res.ok) throw new Error("Error al obtener mesas");
      setMesas(await res.json());
    } catch {
      setError("No se pudieron cargar las mesas. Verificá que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMesas(); }, []);

  const cambiarEstado = async (id: number, estadoActual: string) => {
    const nuevo = nextEstado[estadoActual] || "disponible";
    try {
      const res = await fetch(`${API}/mesas/${id}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado: nuevo }),
      });
      if (!res.ok) throw new Error("Error al cambiar estado");
      await fetchMesas();
    } catch {
      setError("No se pudo cambiar el estado de la mesa.");
    }
  };

  if (loading) return <p className="text-gray-500">Cargando mesas...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mesas</h1>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
          {error}
          <button onClick={() => setError("")} className="float-right font-bold">&times;</button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {mesas.map((m) => (
          <div
            key={m.id}
            className={`bg-white rounded-xl shadow border-l-4 p-4 ${estadoColors[m.estado] || "border-gray-300"}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold">Mesa #{m.numero}</h2>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${estadoBadge[m.estado] || "bg-gray-100 text-gray-600"}`}>
                {m.estado}
              </span>
            </div>
            <p className="text-sm text-gray-500 mb-3">Capacidad: {m.capacidad} personas</p>
            <button
              onClick={() => cambiarEstado(m.id, m.estado)}
              className="w-full bg-gray-800 text-white text-sm py-2 rounded-lg hover:bg-gray-700 transition"
            >
              Cambiar a {nextEstado[m.estado]}
            </button>
          </div>
        ))}
        {mesas.length === 0 && (
          <p className="col-span-full text-center text-gray-400 py-8">No hay mesas registradas</p>
        )}
      </div>
    </div>
  );
}
