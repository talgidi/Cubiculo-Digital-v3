"use client";

import { useState } from "react";

export default function LoginPageView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0B1120] px-4">
      <div className="w-full max-w-md bg-[#0F172A] rounded-xl shadow-xl p-8">
        
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">
          Iniciar Sesión
        </h1>

        <form className="space-y-4">
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#101622] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="correo@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-[#101622] border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="********"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium"
          >
            Entrar
          </button>

        </form>
      </div>
    </div>
  );
}
