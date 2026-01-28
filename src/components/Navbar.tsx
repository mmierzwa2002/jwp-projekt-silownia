"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-black/50 p-4 border-b border-gray-700 flex justify-between items-center text-white backdrop-blur-md sticky top-0 z-50">
      <Link href="/" className="text-xl font-bold text-blue-500 tracking-wider">
        GYM MANAGER
      </Link>

      <div className="flex gap-6 items-center">
        {!session ? (
          <>
            <Link href="/register" className="hover:text-blue-400 transition">
              Rejestracja
            </Link>
            <Link
              href="/api/auth/signin"
              className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition"
            >
              Zaloguj
            </Link>
          </>
        ) : (
          <>
            <span className="text-gray-400 hidden md:block">
              Witaj, {session.user?.name}
            </span>
            <Link href="/dashboard" className="hover:text-white transition">
              Panel Klienta
            </Link>

            {session.user?.role === "admin" && (
              <Link
                href="/admin"
                className="text-yellow-500 hover:text-yellow-400 font-semibold transition"
              >
                PANEL ADMINA
              </Link>
            )}

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="text-red-400 hover:text-red-300 border border-red-900 px-3 py-1 rounded transition"
            >
              Wyloguj
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
