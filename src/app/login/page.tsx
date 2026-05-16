"use client";

import { useState } from "react";

export default function LoginPage() {

  const [pass, setPass] = useState("");

  function entrar() {

    if (pass !== "123456") {
      alert("Contraseña incorrecta");
      return;
    }

    document.cookie =
      "shinhwa_admin=123456; path=/";

    window.location.href = "/ordenes";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "#111827",
          padding: 30,
          borderRadius: 20,
          border: "1px solid #374151",
        }}
      >
        <h1
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: 25,
          }}
        >
          🔒 SHINHWA REPAIR
        </h1>

        <input
          type="password"
          placeholder="Contraseña"
          value={pass}
          onChange={(e) =>
            setPass(e.target.value)
          }
          style={{
            width: "100%",
            padding: 16,
            borderRadius: 12,
            border: "none",
            fontSize: 18,
            boxSizing: "border-box",
          }}
        />

        <button
          onClick={entrar}
          style={{
            width: "100%",
            marginTop: 20,
            padding: 16,
            borderRadius: 12,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
            cursor: "pointer",
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}