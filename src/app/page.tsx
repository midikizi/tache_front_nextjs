"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authService } from "@/app/services/authService";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      await authService.login(formData);
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f2027] via-[#2c5364] to-[#24243e] relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-500 opacity-30 blur-3xl rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-600 opacity-20 blur-2xl rounded-full animate-pulse" />
      </div>
      <div className="relative z-10 max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-10 border border-white/20">
        <h2 className="text-4xl font-extrabold text-white text-center mb-8 tracking-widest drop-shadow-lg">
          Connexion
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-200/80 border border-red-400 text-red-800 px-4 py-3 rounded relative text-center">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-white/80">
                Nom d'utilisateur
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full rounded-xl border-none bg-white/20 text-white placeholder-white/60 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                placeholder="Votre nom d'utilisateur"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white/80">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full rounded-xl border-none bg-white/20 text-white placeholder-white/60 px-4 py-3 focus:ring-2 focus:ring-blue-400 focus:bg-white/30 transition"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 tracking-widest"
          >
            Se connecter
          </button>
        </form>
        <div className="text-center mt-6">
          <span className="text-white/70">Pas encore de compte ? </span>
          <Link
            href="/inscription"
            className="font-bold text-blue-300 hover:text-purple-300 underline underline-offset-4 transition"
          >
            S'inscrire
          </Link>
        </div>
      </div>
    </div>
  );
}
