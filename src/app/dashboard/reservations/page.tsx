import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { deleteReservation } from "@/lib/actions";
import Link from "next/link";
import CancelReservationForm from "@/components/CancelReservationForm";

export default async function ReservationsPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as any).id;

  const client = await clientPromise;
  const db = client.db("gym_full_db");
  const myReservations = await db
    .collection("reservations")
    .find({ userId })
    .sort({ activityDate: 1 })
    .toArray();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-purple-400">Moje Rezerwacje</h1>
        <Link
          href="/activities"
          className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded text-sm transition border border-gray-600"
        >
          + Zapisz się na nowe
        </Link>
      </div>

      {myReservations.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-xl border border-gray-700 border-dashed">
          <p className="text-gray-500 text-lg">
            Nie masz zaplanowanych żadnych zajęć.
          </p>
          <Link
            href="/activities"
            className="text-purple-400 hover:text-purple-300 mt-2 inline-block"
          >
            Sprawdź grafik
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {myReservations.map((res: any) => {
            const isPast = new Date(res.activityDate) < new Date();

            return (
              <div
                key={res._id}
                className={`flex flex-col md:flex-row justify-between items-center p-4 rounded-lg border ${isPast ? "bg-gray-800/30 border-gray-800 opacity-60" : "bg-gray-800 border-gray-700"}`}
              >
                <div className="mb-4 md:mb-0">
                  <h3 className="font-bold text-lg text-white">
                    {res.activityName}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    📅{" "}
                    {new Date(res.activityDate).toLocaleDateString("pl-PL", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                    <span className="ml-3 text-purple-400 font-mono">
                      🕒{" "}
                      {new Date(res.activityDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                </div>
                <div>
                  {isPast ? (
                    <span className="text-gray-500 text-sm px-4 py-2 bg-gray-900 rounded cursor-default">
                      Zakończone
                    </span>
                  ) : (
                    <CancelReservationForm reservationId={res._id.toString()} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
