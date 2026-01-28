"use server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";
import { User, UserRole } from "@/types";

const DB_NAME = "gym_full_db";

// ---  AUTH ---

export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) return { error: "Wypełnij wszystkie pola" };

  const client = await clientPromise;
  const db = client.db(DB_NAME);

  // Sprawdź czy user istnieje
  const existingUser = await db.collection("users").findOne({ email });
  if (existingUser) return { error: "Użytkownik już istnieje" };

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser: Omit<User, "_id"> = {
    name,
    email,
    password: hashedPassword,
    role: UserRole.USER,
  };

  await db.collection("users").insertOne(newUser);
  return { success: true };
}

// UŻYTKOWNICY ---

export async function deleteUser(userId: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  await db.collection("users").deleteOne({ _id: new ObjectId(userId) });
  await db.collection("active_memberships").deleteMany({ userId });
  await db.collection("reservations").deleteMany({ userId });
  revalidatePath("/admin/users");
}

// --- TYPY KARNETÓW ---

export async function createMembershipType(formData: FormData) {
  const client = await clientPromise;
  await client
    .db(DB_NAME)
    .collection("membership_types")
    .insertOne({
      name: formData.get("name"),
      price: Number(formData.get("price")),
      durationMonths: Number(formData.get("durationMonths")),
    });
  revalidatePath("/admin/memberships");
  revalidatePath("/dashboard");
}

export async function deleteMembershipType(id: string) {
  const client = await clientPromise;
  await client
    .db(DB_NAME)
    .collection("membership_types")
    .deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/admin/memberships");
  revalidatePath("/dashboard");
}

// --- AKTYWNE KARNETY (Kupowanie/Usuwanie) ---

export async function buyMembership(
  userId: string,
  typeId: string,
  duration: number,
  typeName: string,
) {
  const client = await clientPromise;
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + duration);

  await client.db(DB_NAME).collection("active_memberships").insertOne({
    userId,
    membershipTypeId: typeId,
    typeName,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    isActive: true,
  });
  revalidatePath("/dashboard");
  revalidatePath("/admin");
}

export async function deleteActiveMembership(id: string) {
  const client = await clientPromise;
  await client
    .db(DB_NAME)
    .collection("active_memberships")
    .deleteOne({ _id: new ObjectId(id) });
  revalidatePath("/admin");
  revalidatePath("/dashboard");
}

// --- ZAJĘCIA ---

export async function createActivity(formData: FormData) {
  const client = await clientPromise;
  await client
    .db(DB_NAME)
    .collection("activities")
    .insertOne({
      name: formData.get("name"),
      date: formData.get("date"),
      capacity: Number(formData.get("capacity")),
    });
  revalidatePath("/admin/activities");
  revalidatePath("/dashboard");
}

export async function deleteActivity(id: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  await db.collection("activities").deleteOne({ _id: new ObjectId(id) });
  await db.collection("reservations").deleteMany({ activityId: id });

  revalidatePath("/admin/activities");
  revalidatePath("/admin/reservations");
  revalidatePath("/dashboard");
}

export async function createReservation(
  userId: string,
  activityId: string,
  activityName: string,
  activityDate: string,
) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);

  const existing = await db
    .collection("reservations")
    .findOne({ userId, activityId });
  if (existing) return { error: "Już jesteś zapisany!" };

  const currentCount = await db
    .collection("reservations")
    .countDocuments({ activityId });
  const activity = await db
    .collection("activities")
    .findOne({ _id: new ObjectId(activityId) });

  if (!activity || currentCount >= activity.capacity) {
    return { error: "Brak miejsc!" };
  }

  await db.collection("reservations").insertOne({
    userId,
    activityId,
    activityName,
    activityDate,
    createdAt: new Date().toISOString(),
  });

  revalidatePath("/dashboard");
  revalidatePath("/admin/reservations");
}

export async function deleteReservation(reservationId: string) {
  const client = await clientPromise;
  await client
    .db(DB_NAME)
    .collection("reservations")
    .deleteOne({ _id: new ObjectId(reservationId) });
  revalidatePath("/dashboard");
  revalidatePath("/admin/reservations");
}
