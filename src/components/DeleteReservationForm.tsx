"use client";

import { deleteReservation } from "@/lib/actions";

export default function DeleteReservationForm({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        const confirmed = window.confirm(
          "Czy na pewno chcesz anulować tę rezerwację?",
        );
        if (confirmed) {
          await deleteReservation(id);
        }
      }}
    >
      <button className="text-red-400 hover:text-red-200 hover:bg-red-900/30 px-3 py-1 rounded transition text-sm border border-red-900">
        Anuluj
      </button>
    </form>
  );
}
