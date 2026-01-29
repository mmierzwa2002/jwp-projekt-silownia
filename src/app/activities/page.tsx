import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createReservation } from "@/lib/actions";
import Link from "next/link";
import JoinActivityForm from "@/components/JoinActivityForm";

export default async function PublicActivitiesPage() {
  const client = await clientPromise;
  const db = client.db("gym_full_db");
  const session = await getServerSession(authOptions);

  // Pobieramy zajęcia (posortowane od najbliższych)
  const activities = await db
    .collection("activities")
    .find({})
    .sort({ date: 1 })
    .toArray();

  // Pobieramy WSZYSTKIE rezerwacje, żeby policzyć obłożenie
  const allReservations = await db
    .collection("reservations")
    .find({})
    .toArray();

  // Sprawdzamy, na co zapisał się AKTUALNY użytkownik
  const myReservationsIds = session
    ? allReservations
        .filter((r: any) => r.userId === (session.user as any).id)
        .map((r: any) => r.activityId)
    : [];

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Grafik Zajęć
          </h1>
          <p className="text-gray-400">
            Sprawdź, co dla Ciebie przygotowaliśmy i dołącz do treningu!
          </p>
        </div>

        {activities.length === 0 ? (
          <div className="text-center text-gray-500 py-20 bg-gray-800/50 rounded-xl border border-gray-800">
            <p className="text-xl">
              Brak zaplanowanych zajęć na najbliższy czas.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activities.map((act: any) => {
              const takenSpots = allReservations.filter(
                (r: any) => r.activityId === act._id.toString(),
              ).length;
              const isFull = takenSpots >= act.capacity;
              const isSignedUp = myReservationsIds.includes(act._id.toString());

              return (
                <div
                  key={act._id}
                  className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-gray-500 transition shadow-lg flex flex-col"
                >
                  <div className="p-6 flex-1 space-y-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          {act.name}
                        </h3>
                        <p className="text-blue-400 font-medium">
                          {new Date(act.date).toLocaleDateString("pl-PL", {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                          })}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-200">
                          {new Date(act.date).toLocaleTimeString("pl-PL", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-400">Dostępność miejsc</span>
                        <span
                          className={isFull ? "text-red-400" : "text-green-400"}
                        >
                          {takenSpots} / {act.capacity}
                        </span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${isFull ? "bg-red-500" : "bg-green-500"}`}
                          style={{
                            width: `${Math.min((takenSpots / act.capacity) * 100, 100)}%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-800/50 border-t border-gray-700">
                    {!session ? (
                      <Link
                        href="/api/auth/signin"
                        className="block w-full text-center py-2 rounded border border-gray-600 text-gray-300 hover:bg-gray-700 transition"
                      >
                        Zaloguj się, aby dołączyć
                      </Link>
                    ) : (
                      <>
                        {isSignedUp ? (
                          <button
                            disabled
                            className="w-full py-2 bg-green-900/30 text-green-400 border border-green-900 rounded cursor-not-allowed"
                          >
                            Jesteś zapisany/a ✓
                          </button>
                        ) : isFull ? (
                          <button
                            disabled
                            className="w-full py-2 bg-red-900/20 text-red-500 border border-red-900/50 rounded cursor-not-allowed"
                          >
                            Brak miejsc
                          </button>
                        ) : (
                          <JoinActivityForm
                            userId={(session.user as any).id}
                            activityId={act._id.toString()}
                            activityName={act.name}
                            activityDate={act.date}
                          />
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
