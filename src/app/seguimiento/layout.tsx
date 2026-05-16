export default function SeguimientoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body
        style={{
          margin: 0,
          padding: 0,
          background: "#0f172a",
        }}
      >
        {children}
      </body>
    </html>
  );
}