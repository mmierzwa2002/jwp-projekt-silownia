import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { buyMembership } from "@/lib/actions";

export default async function MembershipPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any).id;

  const client = await clientPromise;
  const db = client.db("gym_full_db");

  // Pobierz dostępne typy karnetów ORAZ aktualny karnet usera
  const membershipTypes = await db
    .collection("membership_types")
    .find({})
    .toArray();
  const myMembership = await db
    .collection("active_memberships")
    .findOne({ userId });

  const hasActive = myMembership && new Date(myMembership.endDate) > new Date();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-blue-400 border-b border-gray-700 pb-4">
        Twój Karnet
      </h1>
      {hasActive ? (
        <div className="bg-green-900/30 border border-green-600 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-green-400 mb-2">
            Masz aktywny pakiet!
          </h2>
          <p className="text-4xl font-bold text-white my-4">
            {myMembership.typeName}
          </p>
          <p className="text-gray-300">
            Wygasa dnia:{" "}
            <span className="text-white font-bold">
              {new Date(myMembership.endDate).toLocaleDateString()}
            </span>
          </p>
        </div>
      ) : (
        <div className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 text-center">
          <p className="text-gray-400">
            Nie posiadasz aktualnie aktywnego karnetu. Wybierz ofertę poniżej.
          </p>
        </div>
      )}
      <h2 className="text-2xl font-bold mt-8">Dostępne Oferty</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {membershipTypes.map((type: any) => (
          <div
            key={type._id}
            className="bg-gray-800 p-6 rounded-xl border border-gray-700 hover:border-blue-500 transition shadow-lg flex flex-col justify-between"
          >
            <div>
              <h3 className="text-xl font-bold text-white">{type.name}</h3>
              <p className="text-3xl font-bold text-blue-400 my-4">
                {type.price} <span className="text-sm text-gray-500">PLN</span>
              </p>
              <p className="text-gray-400 text-sm mb-6">
                Ważność: {type.durationMonths} msc
              </p>
            </div>

            {hasActive ? (
              <button
                disabled
                className="w-full py-2 bg-gray-700 text-gray-400 rounded cursor-not-allowed border border-gray-600"
              >
                Masz już karnet
              </button>
            ) : (
              <form
                action={async () => {
                  "use server";
                  await buyMembership(
                    userId,
                    type._id.toString(),
                    type.durationMonths,
                    type.name,
                  );
                }}
              >
                <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-bold transition shadow-lg shadow-blue-900/20">
                  Wybieram
                </button>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
