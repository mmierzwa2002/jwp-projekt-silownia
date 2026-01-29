import clientPromise from "@/lib/mongodb";
import DeleteUserForm from "@/components/DeleteUserForm";
import Link from "next/link";

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

      <div className="bg-gray-800 rounded p-4 shadow-lg border border-gray-700">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-700 text-gray-400">
              <th className="p-3">Nazwa</th>
              <th className="p-3">Email</th>
              <th className="p-3">Rola</th>
              <th className="p-3 text-right">Akcje</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u: any) => (
              <tr
                key={u._id}
                className="border-b border-gray-700/50 hover:bg-gray-750 transition"
              >
                <td className="p-3 font-medium">{u.name}</td>
                <td className="p-3 text-gray-300">{u.email}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wider ${
                      u.role === "admin"
                        ? "bg-yellow-900/50 text-yellow-200 border border-yellow-800"
                        : u.role === "employee"
                          ? "bg-purple-900/50 text-purple-200 border border-purple-800"
                          : "bg-blue-900/50 text-blue-200 border border-blue-800"
                    }`}
                  >
                    {u.role}
                  </span>
                </td>
                <td className="p-3 text-right">
                  <div className="flex justify-end gap-4 items-center">
                    <Link
                      href={`/admin/users/${u._id.toString()}`}
                      className="text-blue-400 hover:text-blue-300 text-sm font-semibold transition hover:underline"
                    >
                      Edytuj
                    </Link>
                    <DeleteUserForm userId={u._id.toString()} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
