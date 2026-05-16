"use client";

import { useState } from "react";

export default function LoginPage() {

  const [pass, setPass] =
    useState("");

  function entrar() {

    if (pass !== "123456") {
      alert("Contraseña incorrecta");
      return;
    }

    document.cookie =
      "shinhwa_admin=123456; path=/";

    window.location.href =
      "/ordenes";
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
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
        }}
      >
        <h1
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: 20,
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
            padding: 15,
            borderRadius: 10,
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
            padding: 15,
            borderRadius: 10,
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
          }}
        >
          Entrar
        </button>
      </div>
    </div>
  );
}