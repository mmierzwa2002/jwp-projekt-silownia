import Link from "next/link";
import clientPromise from "@/lib/mongodb";
import { createMembershipType } from "@/lib/actions";
import DeleteMembershipForm from "@/components/DeleteMembershipForm";

export default async function AdminMembershipsPage() {
  const client = await clientPromise;

  const memberships = await client
    .db("gym_full_db")
    .collection("membership_types")
    .find({})
    .toArray();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-green-400 border-b border-gray-700 pb-4">
        Zarządzanie Ofertą Karnetów
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-gray-800 p-6 rounded shadow-lg border border-gray-700 h-fit">
          <h2 className="text-xl font-bold mb-4 text-gray-200">
            Dodaj Nowy Typ
          </h2>
          <form action={createMembershipType} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">
                Nazwa Karnetu
              </label>
              <input
                name="name"
                placeholder="np. Karnet Studencki"
                className="w-full p-2 bg-gray-900 border border-gray-600 rounded focus:border-green-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Cena (PLN)
                </label>
                <input
                  name="price"
                  type="number"
                  min="1"
                  placeholder="99"
                  className="w-full p-2 bg-gray-900 border border-gray-600 rounded focus:border-green-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">
                  Ważność (miesiące)
                </label>
                <input
                  name="durationMonths"
                  type="number"
                  placeholder="1"
                  min="1"
                  className="w-full p-2 bg-gray-900 border border-gray-600 rounded focus:border-green-500 outline-none"
                  required
                />
              </div>
            </div>

            <button className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded transition">
              + Dodaj do Oferty
            </button>
          </form>
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-200">
            Aktywne Oferty ({memberships.length})
          </h2>

          {memberships.length === 0 && (
            <p className="text-gray-500 italic">
              Brak zdefiniowanych karnetów.
            </p>
          )}
          {memberships.map((m: any) => (
            <div
              key={m._id}
              className="bg-gray-800 p-4 rounded border border-gray-700 flex justify-between items-center hover:border-gray-500 transition"
            >
              <div>
                <h3 className="font-bold text-lg text-green-300">{m.name}</h3>
                <p className="text-gray-400 text-sm">
                  Cena: <span className="text-white">{m.price} zł</span> | Czas:{" "}
                  <span className="text-white">{m.durationMonths} msc</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/admin/memberships/${m._id.toString()}`}
                  className="text-blue-400 hover:text-blue-300 text-sm font-semibold hover:underline"
                >
                  Edytuj
                </Link>
                <DeleteMembershipForm id={m._id.toString()} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
