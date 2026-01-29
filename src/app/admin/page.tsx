import clientPromise from "@/lib/mongodb";
import Link from "next/link";

export default async function AdminDashboard() {
  const client = await clientPromise;
  const db = client.db("gym_full_db");
  const usersCount = await db.collection("users").countDocuments();
  const activeMembershipsCount = await db
    .collection("active_memberships")
    .countDocuments();
  const reservationsCount = await db
    .collection("reservations")
    .countDocuments();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-white">
        Witaj w Panelu Admina 👋
      </h1>

      <div className="grid md:grid-cols-3 gap-6">
        <Link
          href="/admin/users"
          className="block p-6 bg-blue-900/20 border border-blue-800 rounded-lg hover:bg-blue-900/40 transition cursor-pointer group"
        >
          <h2 className="text-sm font-bold text-blue-400 uppercase tracking-wider mb-2 group-hover:text-blue-300">
            Użytkownicy
          </h2>
          <p className="text-4xl font-bold text-white">{usersCount}</p>
        </Link>
        <Link
          href="/admin/memberships"
          className="block p-6 bg-green-900/20 border border-green-800 rounded-lg hover:bg-green-900/40 transition cursor-pointer group"
        >
          <h2 className="text-sm font-bold text-green-400 uppercase tracking-wider mb-2 group-hover:text-green-300">
            Aktywne Karnety
          </h2>
          <p className="text-4xl font-bold text-white">
            {activeMembershipsCount}
          </p>
        </Link>
        <Link
          href="/admin/reservations"
          className="block p-6 bg-purple-900/20 border border-purple-800 rounded-lg hover:bg-purple-900/40 transition cursor-pointer group"
        >
          <h2 className="text-sm font-bold text-purple-400 uppercase tracking-wider mb-2 group-hover:text-purple-300">
            Rezerwacje
          </h2>
          <p className="text-4xl font-bold text-white">{reservationsCount}</p>
        </Link>
      </div>
      <div className="mt-8">
        <Link
          href="/admin/activities"
          className="inline-block px-6 py-3 bg-gray-800 border border-gray-700 rounded hover:bg-gray-700 transition text-gray-300 hover:text-white"
        >
          Zarządzaj Grafikiem Zajęć &rarr;
        </Link>
      </div>
    </div>
  );
}
