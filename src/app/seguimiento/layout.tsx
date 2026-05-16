export const dynamic = "force-dynamic";

export default function SeguimientoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <title>Seguimiento | SHINHWA REPAIR</title>

        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />

        <meta
          name="robots"
          content="noindex,nofollow"
        />
      </head>

      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#0f172a",
          overflowX: "hidden",
        }}
      >
        {/* 🔒 BLOQUEAR CLICK DERECHO */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.addEventListener('contextmenu', event => event.preventDefault());

              document.addEventListener('keydown', function(e) {

                if (
                  e.key === "F12" ||
                  (e.ctrlKey && e.shiftKey && e.key === "I") ||
                  (e.ctrlKey && e.shiftKey && e.key === "J") ||
                  (e.ctrlKey && e.key === "U")
                ) {
                  e.preventDefault();
                }
              });
            `,
          }}
        />

        {children}
      </body>
    </html>
  );
}