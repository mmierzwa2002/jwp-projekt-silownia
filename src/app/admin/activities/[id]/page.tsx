import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { updateActivity } from "@/lib/actions";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function EditActivityPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await clientPromise;

  const activity = await client
    .db("gym_full_db")
    .collection("activities")
    .findOne({
      _id: new ObjectId(id),
    });

  if (!activity) return <div>Nie znaleziono zajęć</div>;

  // Formatowanie daty dla inputa datetime-local (YYYY-MM-DDTHH:mm)
  const defaultDate = new Date(activity.date).toISOString().slice(0, 16);

  async function handleUpdate(formData: FormData) {
    "use server";
    await updateActivity(formData);
    redirect("/admin/activities");
  }

  return (
    <div className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold text-purple-400 mb-8 border-b border-gray-700 pb-4">
        Edycja Zajęć
      </h1>

      <form
        action={handleUpdate}
        className="bg-gray-800 p-8 rounded-xl border border-gray-700 space-y-6"
      >
        <input type="hidden" name="id" value={activity._id.toString()} />

        <div>
          <label className="block text-gray-400 mb-2 text-sm">
            Nazwa Zajęć
          </label>
          <input
            name="name"
            defaultValue={activity.name}
            className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-purple-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2 text-sm">
            Data i Godzina
          </label>
          <input
            type="datetime-local"
            name="date"
            defaultValue={defaultDate}
            className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-purple-500 outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-gray-400 mb-2 text-sm">
            Limit Miejsc
          </label>
          <input
            type="number"
            name="capacity"
            defaultValue={activity.capacity}
            className="w-full bg-gray-900 border border-gray-600 rounded p-3 text-white focus:border-purple-500 outline-none"
            required
          />
        </div>

        <div className="flex gap-4 pt-4">
          <Link
            href="/admin/activities"
            className="px-6 py-3 rounded bg-gray-700 text-gray-300 hover:bg-gray-600 transition"
          >
            Anuluj
          </Link>
          <button
            type="submit"
            className="px-6 py-3 rounded bg-purple-600 text-white hover:bg-purple-500 transition font-bold"
          >
            Zapisz Zmiany
          </button>
        </div>
      </form>
    </div>
  );
}
