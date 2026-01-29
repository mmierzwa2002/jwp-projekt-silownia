"use client";

import { createReservation } from "@/lib/actions";

interface Props {
  userId: string;
  activityId: string;
  activityName: string;
  activityDate: string;
}

export default function JoinActivityForm({
  userId,
  activityId,
  activityName,
  activityDate,
}: Props) {
  return (
    <form
      action={async () => {
        const confirmed = window.confirm(
          `Czy na pewno chcesz zapisać się na zajęcia: ${activityName}?`,
        );
        if (confirmed) {
          await createReservation(
            userId,
            activityId,
            activityName,
            activityDate,
          );
        }
      }}
    >
      <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium transition shadow-lg shadow-blue-900/20">
        Zapisz się teraz
      </button>
    </form>
  );
}
