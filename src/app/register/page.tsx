"use client";
import { registerUser } from "@/lib/actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    const res = await registerUser(formData);
    if (res?.error) {
      alert(res.error);
    } else {
      router.push("/login");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-96 border border-gray-700">
        <h1 className="text-4xl font-display text-blue-500 mb-6 text-center tracking-wide">
          Dołącz do nas
        </h1>

        <form action={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">
              Imię i Nazwisko
            </label>
            <input
              name="name"
              type="text"
              className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Hasło</label>
            <input
              name="password"
              type="password"
              className="w-full p-3 bg-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition duration-200 mt-4">
            Zarejestruj się
          </button>
        </form>

        <p className="mt-4 text-center text-gray-400 text-sm">
          Masz już konto?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
}
