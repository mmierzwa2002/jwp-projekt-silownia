import clientPromise from "@/lib/mongodb";
import DeleteReservationForm from "@/components/DeleteReservationForm";

export default async function AdminReservationsPage() {
  const client = await clientPromise;
  const db = client.db("gym_full_db");

  const reservations = await db
    .collection("reservations")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const users = await db.collection("users").find({}).toArray();
  const userMap: Record<string, string> = {};
  users.forEach((u: any) => {
    userMap[u._id.toString()] = u.name;
  });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-pink-400">
        Wszystkie Rezerwacje
      </h1>

      <div className="bg-gray-800 rounded p-4 shadow-lg border border-gray-700 overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="p-3">Klient</th>
              <th className="p-3">Zajęcia</th>
              <th className="p-3">Data Treningu</th>
              <th className="p-3">Data Rezerwacji</th>
              <th className="p-3 text-right">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Brak rezerwacji w systemie.
                </td>
              </tr>
            ) : (
              reservations.map((res: any) => (
                <tr
                  key={res._id}
                  className="border-b border-gray-700/50 hover:bg-gray-750 transition"
                >
                  <td className="p-3 font-medium text-white">
                    {userMap[res.userId] || (
                      <span className="text-gray-500 text-xs">
                        {res.userId}
                      </span>
                    )}
                  </td>
                  <td className="p-3 text-purple-300 font-semibold">
                    {res.activityName}
                  </td>
                  <td className="p-3 text-gray-300">
                    {new Date(res.activityDate).toLocaleDateString()}{" "}
                    <span className="text-gray-500 text-xs">
                      {new Date(res.activityDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 text-sm">
                    {new Date(res.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 text-right">
                    <DeleteReservationForm id={res._id.toString()} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
