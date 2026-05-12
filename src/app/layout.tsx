import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Taller Pro",
  description: "Sistema de reparación",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#111827" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body style={{ margin: 0, fontFamily: "Arial" }}>
        {/* NAVBAR SUPERIOR */}
        <div
          style={{
            background: "#111827",
            color: "white",
            padding: 10,
            textAlign: "center",
            fontWeight: "bold",
          }}
        >
          🔧 Taller Pro
        </div>

        {/* CONTENIDO */}
        <main style={{ padding: 10, paddingBottom: 70 }}>
          {children}
        </main>

        {/* 🔥 BARRA INFERIOR TIPO APP */}
        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            background: "#111827",
            display: "flex",
            justifyContent: "space-around",
            padding: 10,
            zIndex: 1000,
          }}
        >
          <Link href="/" style={navBtn}>🏠</Link>
          <Link href="/clientes" style={navBtn}>👤</Link>
          <Link href="/ordenes" style={navBtn}>📋</Link>
          <Link href="/ordenes/nueva" style={navBtn}>➕</Link>
          <Link href="/caja" style={navBtn}>💰</Link>
        </nav>
      </body>
    </html>
  );
}

const navBtn = {
  color: "white",
  fontSize: 20,
  textDecoration: "none",
};