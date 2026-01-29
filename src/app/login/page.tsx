"use client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Błędny email lub hasło");
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96 border border-gray-700">
        <h1 className="text-4xl font-display text-blue-500 mb-6 text-center tracking-wide">
          Witaj Ponownie
        </h1>

        {error && (
          <div className="bg-red-500/20 text-red-400 p-3 rounded mb-4 text-center text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Hasło"
            className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition duration-200">
            Zaloguj
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Nie masz konta?{" "}
          <Link href="/register" className="text-blue-400 hover:underline">
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
}
