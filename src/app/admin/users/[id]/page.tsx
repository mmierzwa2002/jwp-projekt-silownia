import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { updateUser } from "@/lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const client = await clientPromise;
  const user = await client
    .db("gym_full_db")
    .collection("users")
    .findOne({
      _id: new ObjectId(params.id),
    });

  if (!user) {
    return <div className="p-8">Użytkownik nie znaleziony</div>;
  }
  async function handleUpdate(formData: FormData) {
    "use server";
    await updateUser(formData);
    redirect("/admin/users");
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-400 mb-8 border-b border-gray-700 pb-4">
        Edycja Użytkownika
      </h1>

      <form
        action={handleUpdate}
        className="bg-gray-800 p-8 rounded-xl border border-gray-700 space-y-6"
      >
        <input type="hidden" name="id" value={user._id.toString()} />

        <div>
          <label className="block text-gray-400 mb-2 text-sm">
            Imię i Nazwisko
          </label>
          <input
            name="name"
            defaultValue={user.name}
            className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2 text-sm">Email</label>
          <input
            name="email"
            defaultValue={user.email}
            className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2 text-sm">Rola</label>
          <select
            name="role"
            defaultValue={user.role}
            className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-blue-500 outline-none"
          >
            <option value="user">Użytkownik (User)</option>
            <option value="admin">Administrator (Admin)</option>
            <option value="employee">Pracownik (Employee)</option>
          </select>
        </div>

        <div className="flex gap-4 pt-4">
          <Link
            href="/admin/users"
            className="px-6 py-3 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
          >
            Anuluj
          </Link>
          <button
            type="submit"
            className="px-6 py-3 rounded bg-blue-600 text-white hover:bg-blue-500 transition font-bold"
          >
            Zapisz Zmiany
          </button>
        </div>
      </form>
    </div>
  );
}
