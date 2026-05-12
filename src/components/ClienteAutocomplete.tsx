"use client";

import { useState } from "react";

export default function ClienteAutocomplete({ onSelect }: any) {
  const [q, setQ] = useState("");
  const [clientes, setClientes] = useState([]);

  async function buscar(valor: string) {
    setQ(valor);

    if (valor.length < 2) return;

    const res = await fetch(`/api/clientes?q=${valor}`);
    const data = await res.json();
    setClientes(data);
  }

  return (
    <div className="relative">
      <input
        value={q}
        onChange={(e) => buscar(e.target.value)}
        placeholder="Buscar DNI o nombre"
        className="w-full border p-3 rounded-xl"
      />

      {clientes.length > 0 && (
        <div className="absolute bg-white border w-full mt-1 rounded-xl shadow z-10">
          {clientes.map((c: any) => (
            <div
              key={c.id}
              onClick={() => {
                onSelect(c);
                setQ(c.nombre);
                setClientes([]);
              }}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {c.nombre} - {c.dni}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
