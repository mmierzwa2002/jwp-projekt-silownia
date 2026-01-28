import clientPromise from "@/lib/mongodb";

export default async function AdminDashboardHome() {
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
    <div>
      <h1 className="text-3xl font-bold mb-8">Witaj w Panelu Admina 👋</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-900/40 p-6 rounded border border-blue-700">
          <h3 className="text-blue-300 text-sm uppercase font-bold">
            Użytkownicy
          </h3>
          <p className="text-4xl font-bold mt-2">{usersCount}</p>
        </div>
        <div className="bg-green-900/40 p-6 rounded border border-green-700">
          <h3 className="text-green-300 text-sm uppercase font-bold">
            Aktywne Karnety
          </h3>
          <p className="text-4xl font-bold mt-2">{activeMembershipsCount}</p>
        </div>
        <div className="bg-purple-900/40 p-6 rounded border border-purple-700">
          <h3 className="text-purple-300 text-sm uppercase font-bold">
            Rezerwacje
          </h3>
          <p className="text-4xl font-bold mt-2">{reservationsCount}</p>
        </div>
      </div>
    </div>
  );
}
