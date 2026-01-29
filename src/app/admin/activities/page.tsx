import clientPromise from "@/lib/mongodb";
import { createActivity, deleteActivity } from "@/lib/actions";
import Link from "next/link";
import DeleteActivityForm from "@/components/DeleteActivityForm";

export default async function AdminActivitiesPage() {
  const client = await clientPromise;
  const activities = await client
    .db("gym_full_db")
    .collection("activities")
    .find({})
    .sort({ date: 1 })
    .toArray();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-purple-400 border-b border-gray-700 pb-4">
        Grafik Zajęć
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded shadow-lg border border-gray-700 h-fit">
          <h2 className="text-xl font-bold mb-4 text-gray-200">
            Zaplanuj Nowe Zajęcia
          </h2>
          <form action={createActivity} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Nazwa Zajęć
              </label>
              <input
                name="name"
                placeholder="np. Joga Poranna"
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded focus:border-purple-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Data i Godzina
              </label>
              <input
                name="date"
                type="datetime-local"
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded focus:border-purple-500 outline-none text-gray-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Limit Miejsc
              </label>
              <input
                name="capacity"
                type="number"
                placeholder="20"
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded focus:border-purple-500 outline-none"
                required
              />
            </div>

            <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded transition">
              + Dodaj do Grafiku
            </button>
          </form>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-200">
            Zaplanowane ({activities.length})
          </h2>

          {activities.length === 0 && (
            <p className="text-gray-500 italic">Brak zaplanowanych zajęć.</p>
          )}

          <div className="space-y-3 h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {activities.map((act: any) => (
              <div
                key={act._id}
                className="bg-gray-800 p-4 rounded border border-gray-700 flex justify-between items-center hover:border-gray-500 transition"
              >
                <div>
                  <h3 className="font-bold text-lg text-purple-300">
                    {act.name}
                  </h3>
                  <p className="text-white text-sm">
                    📅 {new Date(act.date).toLocaleDateString()}
                    <span className="text-gray-400 ml-2">
                      🕒{" "}
                      {new Date(act.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Limit miejsc: {act.capacity}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/admin/activities/${act._id.toString()}`}
                    className="text-blue-400 hover:text-blue-300 text-sm font-semibold hover:underline"
                  >
                    Edytuj
                  </Link>
                  <DeleteActivityForm id={act._id.toString()} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
