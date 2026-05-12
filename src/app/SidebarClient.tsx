"use client";

import Link from "next/link";
import { useState } from "react";

export default function SidebarClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* HEADER MÓVIL */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#111827",
          color: "white",
          padding: 10,
        }}
      >
        <button
          onClick={() => setOpen(!open)}
          style={{
            fontSize: 20,
            background: "transparent",
            color: "white",
            border: "none",
          }}
        >
          ☰
        </button>

        <h3 style={{ margin: 0 }}>🔧 Taller Pro</h3>
      </div>

      <div style={{ display: "flex" }}>
        {/* SIDEBAR */}
        <aside
          style={{
            position: "fixed",
            top: 0,
            left: open ? 0 : -250,
            width: 220,
            height: "100vh",
            background: "#111827",
            color: "white",
            padding: 20,
            transition: "0.3s",
            zIndex: 1000,
          }}
        >
          <h2>🔧 Taller Pro</h2>

          <nav style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link href="/" style={linkStyle}>🏠 Dashboard</Link>
            <Link href="/clientes" style={linkStyle}>👤 Clientes</Link>
            <Link href="/ordenes" style={linkStyle}>📋 Órdenes</Link>
            <Link href="/ordenes/nueva" style={linkStyle}>➕ Nueva Orden</Link>
            <Link href="/caja" style={linkStyle}>💰 Caja</Link>
          </nav>
        </aside>

        {/* OVERLAY */}
        {open && (
          <div
            onClick={() => setOpen(false)}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              background: "rgba(0,0,0,0.5)",
              zIndex: 500,
            }}
          />
        )}

        {/* CONTENIDO */}
        <main
          style={{
            flex: 1,
            padding: 15,
            marginTop: 10,
            width: "100%",
          }}
        >
          {children}
        </main>
      </div>
    </>
  );
}

const linkStyle = {
  color: "white",
  textDecoration: "none",
  padding: 10,
  borderRadius: 6,
  background: "#1f2937",
};