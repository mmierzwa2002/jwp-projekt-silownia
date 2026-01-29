"use client";

import { deleteMembershipType } from "@/lib/actions";

export default function DeleteMembershipForm({ id }: { id: string }) {
  return (
    <form
      action={async () => {
        const confirmed = window.confirm(
          "Czy na pewno chcesz usunąć ten typ karnetu?",
        );
        if (confirmed) {
          await deleteMembershipType(id);
        }
      }}
    >
      <button className="text-red-400 hover:text-red-200 hover:bg-red-900/30 px-3 py-1 rounded transition text-sm border border-red-900">
        Usuń
      </button>
    </form>
  );
}
