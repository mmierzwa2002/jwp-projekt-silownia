import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardHome() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any).id;

  const client = await clientPromise;
  const db = client.db("gym_full_db");
  const activeMembership = await db
    .collection("active_memberships")
    .findOne({ userId });
  const reservationsCount = await db
    .collection("reservations")
    .countDocuments({ userId });
  const isMemberActive =
    activeMembership && new Date(activeMembership.endDate) > new Date();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Cześć, {session?.user?.name}! 👋</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <div
          className={`p-6 rounded-xl border ${isMemberActive ? "bg-green-900/20 border-green-800" : "bg-red-900/20 border-red-800"}`}
        >
          <h2 className="text-xl font-bold mb-2 text-gray-200">
            Status Członkostwa
          </h2>
          {isMemberActive ? (
            <div>
              <p className="text-3xl font-bold text-green-400 mb-1">AKTYWNY</p>
              <p className="text-sm text-gray-400">
                Typ: {activeMembership.typeName}
              </p>
              <p className="text-sm text-gray-400">
                Ważny do:{" "}
                {new Date(activeMembership.endDate).toLocaleDateString()}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-3xl font-bold text-red-400 mb-4">NIEAKTYWNY</p>
              <Link
                href="/dashboard/membership"
                className="bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded text-sm transition"
              >
                Kup Karnet
              </Link>
            </div>
          )}
        </div>
        <div className="bg-blue-900/20 border border-blue-800 p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-2 text-gray-200">
            Twoje Rezerwacje
          </h2>
          <p className="text-3xl font-bold text-blue-400 mb-4">
            {reservationsCount}
          </p>
          <Link
            href="/dashboard/reservations"
            className="text-blue-300 hover:text-white text-sm underline decoration-blue-500"
          >
            Zarządzaj rezerwacjami &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
