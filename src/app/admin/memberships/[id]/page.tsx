import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { updateMembershipType } from "@/lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditMembershipPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await clientPromise;

  const membership = await client
    .db("gym_full_db")
    .collection("membership_types")
    .findOne({
      _id: new ObjectId(id),
    });

  if (!membership) return <div>Nie znaleziono karnetu</div>;

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateMembershipType(formData);
    redirect("/admin/memberships");
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-green-400 mb-8 border-b border-gray-700 pb-4">
        Edycja Karnetu
      </h1>

      <form
        action={handleUpdate}
        className="bg-gray-800 p-8 rounded-xl border border-gray-700 space-y-6"
      >
        <input type="hidden" name="id" value={membership._id.toString()} />

        <div>
          <label className="block text-gray-400 mb-2 text-sm">Nazwa</label>
          <input
            name="name"
            defaultValue={membership.name}
            className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-green-500 outline-none"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 mb-2 text-sm">
              Cena (PLN)
            </label>
            <input
              type="number"
              name="price"
              defaultValue={membership.price}
              min="1"
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-green-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-gray-400 mb-2 text-sm">
              Ważność (miesiące)
            </label>
            <input
              type="number"
              name="durationMonths"
              defaultValue={membership.durationMonths}
              min="1"
              className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-green-500 outline-none"
              required
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <Link
            href="/admin/memberships"
            className="px-6 py-3 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
          >
            Anuluj
          </Link>
          <button
            type="submit"
            className="px-6 py-3 rounded bg-green-600 text-white hover:bg-green-500 transition font-bold"
          >
            Zapisz Zmiany
          </button>
        </div>
      </form>
    </div>
  );
}
