import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <aside className="w-64 bg-gray-800 border-r border-gray-700 hidden md:flex flex-col">
        <div className="p-6 text-xl font-bold text-blue-400 border-b border-gray-700">
          Panel Klienta
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/dashboard"
            className="block p-3 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition"
          >
            🏠 Podsumowanie
          </Link>
          <Link
            href="/dashboard/membership"
            className="block p-3 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition"
          >
            💳 Mój Karnet
          </Link>
          <Link
            href="/dashboard/reservations"
            className="block p-3 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition"
          >
            📅 Moje Rezerwacje
          </Link>
          <Link
            href="/activities"
            className="block p-3 rounded hover:bg-gray-700 text-gray-300 hover:text-white transition mt-4 border-t border-gray-700 pt-4"
          >
            🏋️ Przeglądaj Zajęcia
          </Link>
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
