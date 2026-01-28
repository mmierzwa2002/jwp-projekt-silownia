import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      {/* --- SIDEBAR --- */}
      <aside className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 text-2xl font-bold text-yellow-500 border-b border-gray-700">
          Admin Panel
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <Link
            href="/admin"
            className="block p-3 rounded hover:bg-gray-700 text-gray-300 hover:text-white"
          >
            📊 Pulpit (Statystyki)
          </Link>
          <Link
            href="/admin/users"
            className="block p-3 rounded hover:bg-gray-700 text-gray-300 hover:text-white"
          >
            👥 Użytkownicy
          </Link>
          <Link
            href="/admin/memberships"
            className="block p-3 rounded hover:bg-gray-700 text-gray-300 hover:text-white"
          >
            💳 Typy Karnetów
          </Link>
          <Link
            href="/admin/activities"
            className="block p-3 rounded hover:bg-gray-700 text-gray-300 hover:text-white"
          >
            🏋️ Zajęcia
          </Link>
          <Link
            href="/admin/reservations"
            className="block p-3 rounded hover:bg-gray-700 text-gray-300 hover:text-white"
          >
            📝 Rezerwacje
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-700">
          <Link href="/" className="text-sm text-gray-500 hover:text-white">
            ← Wróć do strony głównej
          </Link>
        </div>
      </aside>

      {/* --- GŁÓWNA ZAWARTOŚĆ --- */}
      <main className="flex-1 p-8 overflow-y-auto">{children}</main>
    </div>
  );
}
