"use client";

import { deleteReservation } from "@/lib/actions";

export default function CancelReservationForm({
  reservationId,
}: {
  reservationId: string;
}) {
  return (
    <form
      action={async () => {
        const confirmed = window.confirm(
          "Czy na pewno chcesz odwołać swoją rezerwację? Zwolni to miejsce dla innych.",
        );
        if (confirmed) {
          await deleteReservation(reservationId);
        }
      }}
    >
      <button className="text-red-400 hover:text-white hover:bg-red-600 px-4 py-2 rounded transition text-sm border border-red-900 hover:border-red-600">
        Odwołaj
      </button>
    </form>
  );
}
