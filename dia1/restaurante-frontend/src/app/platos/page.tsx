"use client";

import { useEffect, useState } from "react";

const API = "http://localhost:3001";

interface Plato {
  id: number;
  nombre: string;
  precio: string;
  disponible: boolean;
}

export default function PlatosPage() {
  const [platos, setPlatos] = useState<Plato[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [disponible, setDisponible] = useState(true);

  const fetchPlatos = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API}/platos`);
      if (!res.ok) throw new Error("Error al obtener platos");
      const data = await res.json();
      setPlatos(data);
    } catch {
      setError("No se pudieron cargar los platos. Verificá que el backend esté corriendo.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPlatos(); }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API}/platos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, precio: parseFloat(precio), disponible }),
      });
      if (!res.ok) throw new Error("Error al crear plato");
      setNombre("");
      setPrecio("");
      setDisponible(true);
      setShowForm(false);
      await fetchPlatos();
    } catch {
      setError("No se pudo crear el plato.");
    }
  };

  if (loading) return <p className="text-gray-500">Cargando platos...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Platos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition"
        >
          {showForm ? "Cancelar" : "+ Nuevo Plato"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-3 mb-4 text-sm">
          {error}
          <button onClick={() => setError("")} className="float-right font-bold">&times;</button>
        </div>
      )}

      {showForm && (
        <form onSubmit={handleCreate} className="bg-white rounded-xl shadow p-4 mb-6 grid grid-cols-1 sm:grid-cols-4 gap-3">
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre"
            required
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
            type="number"
            step="0.01"
            placeholder="Precio"
            required
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={disponible} onChange={(e) => setDisponible(e.target.checked)} />
            Disponible
          </label>
          <button type="submit" className="bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-700 transition">
            Guardar
          </button>
        </form>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-left">
            <tr>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Disponible</th>
            </tr>
          </thead>
          <tbody>
            {platos.map((p) => (
              <tr key={p.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-3">{p.nombre}</td>
                <td className="px-4 py-3">${Number(p.precio).toFixed(2)}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${p.disponible ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {p.disponible ? "Sí" : "No"}
                  </span>
                </td>
              </tr>
            ))}
            {platos.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-gray-400">No hay platos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
