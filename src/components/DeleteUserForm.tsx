"use client";

import { deleteUser } from "@/lib/actions";

export default function DeleteUserForm({ userId }: { userId: string }) {
  return (
    <form
      action={async () => {
        const confirmed = window.confirm(
          "Czy na pewno chcesz usunąć tego użytkownika? Tej operacji nie można cofnąć.",
        );
        if (confirmed) {
          await deleteUser(userId);
        }
      }}
    >
      <button className="text-red-400 hover:text-red-300 text-sm font-semibold transition hover:underline">
        Usuń
      </button>
    </form>
  );
}
