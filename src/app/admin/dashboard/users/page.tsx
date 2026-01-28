// src/app/admin/users/page.tsx
import clientPromise from "@/lib/mongodb";
import { deleteUser } from "@/lib/actions";

export default async function AdminUsersPage() {
  const client = await clientPromise;
  const users = await client
    .db("gym_full_db")
    .collection("users")
    .find({})
    .toArray();

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-blue-400">
        Zarządzanie Użytkownikami
      </h1>

      <div className="bg-gray-800 rounded p-4 shadow-lg">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="p-3">Nazwa</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rola</th>
              <th className="p-3 text-right">Akcja</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr
                key={u._id}
                className="border-b border-gray-700/50 hover:bg-gray-750"
              >
                <td className="p-3">{u.name}</td>
                <td className="p-3 text-gray-300">{u.email}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${u.role === "admin" ? "bg-yellow-900 text-yellow-200" : "bg-blue-900 text-blue-200"}`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <form action={deleteUser.bind(null, u._id.toString())}>
                    <button className="text-red-400 hover:text-red-300 text-sm font-semibold transition">
                      Usuń
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
