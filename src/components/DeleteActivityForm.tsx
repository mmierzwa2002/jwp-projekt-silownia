"use client";

import { deleteActivity } from "@/lib/actions";

export default function DeleteActivityForm({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        const confirmed = window.confirm(
          "Czy na pewno chcesz odwołać te zajęcia? To usunie również wszystkie rezerwacje z nimi związane.",
        );
        if (confirmed) {
          await deleteActivity(id);
        }
      }}
    >
      <button className="text-red-400 hover:text-red-200 hover:bg-red-900/30 px-3 py-1 rounded transition text-sm border border-red-900">
        Odwołaj
      </button>
    </form>
  );
}
