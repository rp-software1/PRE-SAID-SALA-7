"use client";

import { useEffect, useState } from "react";

const API = "http://localhost:3001";

interface Pedido {
  id: number;
  mesa: { id: number; numero: number };
  platos: { nombre: string }[];
  total: string;
  estado: string;
}

interface Comanda {
  id: number;
  pedidoId: number;
  pedido: Pedido;
  observaciones: string | null;
  estado: string;
  createdAt: string;
}

const estados = ["recibida", "en_preparacion", "lista"] as const;

const estadoBadge: Record<string, string> = {
  recibida: "bg-yellow-100 text-yellow-700",
  en_preparacion: "bg-blue-100 text-blue-700",
  lista: "bg-green-100 text-green-700",
};

export default function ComandasPage() {
  const [comandas, setComandas] = useState<Comanda[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [pedidoId, setPedidoId] = useState("");
  const [observaciones, setObservaciones] = useState("");

  const fetchComandas = async () => {
    try {
      setLoading(true);
      const [comRes, pedRes] = await Promise.all([
        fetch(`${API}/comandas`),
        fetch(`${API}/pedidos`),
      ]);
      if (!comRes.ok || !pedRes.ok) throw new Error();
      setComandas(await comRes.json());
      setPedidos(await pedRes.json());
    } catch {
      setError("No se pudieron cargar las comandas. Verificá que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchComandas(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pedidoId) return;
    try {
      const res = await fetch(`${API}/comandas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pedidoId: Number(pedidoId),
          observaciones: observaciones || undefined,
        }),
      });
      if (!res.ok) throw new Error("Error al crear comanda");
      setPedidoId("");
      setObservaciones("");
      setShowForm(false);
      await fetchComandas();
    } catch {
      setError("No se pudo crear la comanda.");
    }
  };

  const cambiarEstado = async (id: number, estado: string) => {
    try {
      const res = await fetch(`${API}/comandas/${id}/estado`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      if (!res.ok) throw new Error();
      await fetchComandas();
    } catch {
      setError("No se pudo cambiar el estado.");
    }
  };

  const eliminar = async (id: number) => {
    if (!confirm("¿Eliminar esta comanda?")) return;
    try {
      const res = await fetch(`${API}/comandas/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      await fetchComandas();
    } catch {
      setError("No se pudo eliminar la comanda.");
    }
  };

  const nextEstado = (actual: string) => {
    const idx = estados.indexOf(actual as typeof estados[number]);
    return idx >= 0 && idx < estados.length - 1 ? estados[idx + 1] : null;
  };

  if (loading) return <p className="text-gray-500">Cargando comandas...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Comandas</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition"
        >
          {showForm ? "Cancelar" : "+ Nueva Comanda"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
          {error}
          <button onClick={() => setError("")} className="float-right font-bold">&times;</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-4 mb-6 space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Pedido</label>
            <select
              value={pedidoId}
              onChange={(e) => setPedidoId(e.target.value)}
              required
              className="w-full border rounded-lg px-3 py-2 text-sm"
            >
              <option value="">Seleccionar pedido...</option>
              {pedidos.map((p) => (
                <option key={p.id} value={p.id}>
                  Pedido #{p.id} — Mesa #{p.mesa?.numero} — ${Number(p.total).toFixed(2)}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Observaciones</label>
            <textarea
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              rows={2}
              className="w-full border rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
            Crear Comanda
          </button>
        </form>
      )}

      <div className="space-y-3">
        {comandas.map((c) => {
          const sig = nextEstado(c.estado);
          return (
            <div key={c.id} className="bg-white rounded-xl shadow p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold">Comanda #{c.id}</h3>
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${estadoBadge[c.estado] || "bg-gray-100"}`}>
                      {c.estado.replace("_", " ")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Pedido #{c.pedidoId} — Mesa #{c.pedido?.mesa?.numero ?? "?"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Platos: {c.pedido?.platos?.map((pl) => pl.nombre).join(", ") || "—"}
                  </p>
                  {c.observaciones && (
                    <p className="text-sm text-gray-400 italic mt-1">Obs: {c.observaciones}</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {sig && (
                    <button
                      onClick={() => cambiarEstado(c.id, sig)}
                      className="bg-gray-800 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-gray-700 transition"
                    >
                      Pasar a {sig.replace("_", " ")}
                    </button>
                  )}
                  <button
                    onClick={() => eliminar(c.id)}
                    className="text-red-500 text-xs hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {comandas.length === 0 && (
          <p className="text-center text-gray-400 py-8">No hay comandas registradas</p>
        )}
      </div>
    </div>
  );
}
