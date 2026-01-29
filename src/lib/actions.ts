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
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!name || !email || !password || !confirmPassword) {
    return { error: "Wypełnij wszystkie pola" };
  }

  if (password !== confirmPassword) {
    return { error: "Hasła nie są identyczne!" };
  }

  const client = await clientPromise;
  const db = client.db("gym_full_db");

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
  revalidatePath("/admin/users");
  return { success: true };
}

// --- UŻYTKOWNICY ---

export async function deleteUser(userId: string) {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  await db.collection("users").deleteOne({ _id: new ObjectId(userId) });
  await db.collection("active_memberships").deleteMany({ userId });
  await db.collection("reservations").deleteMany({ userId });
  revalidatePath("/admin/users");
}

export async function updateUser(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const role = formData.get("role") as string;

  const client = await clientPromise;
  const db = client.db("gym_full_db");

  await db.collection("users").updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        name,
        email,
        role,
      },
    }
  );

  revalidatePath("/admin/users");
  return { success: true };
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

export async function updateMembershipType(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const price = Number(formData.get("price"));
  const durationMonths = Number(formData.get("durationMonths"));

  const client = await clientPromise;
  await client
    .db("gym_full_db")
    .collection("membership_types")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { name, price, durationMonths } }
    );

  revalidatePath("/admin/memberships");
  revalidatePath("/dashboard");
  return { success: true };
}

// --- AKTYWNE KARNETY (Kupowanie/Usuwanie) ---

export async function buyMembership(
  userId: string,
  typeId: string,
  duration: number,
  typeName: string
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

export async function updateActivity(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const date = formData.get("date") as string;
  const capacity = Number(formData.get("capacity"));

  const client = await clientPromise;
  await client
    .db("gym_full_db")
    .collection("activities")
    .updateOne({ _id: new ObjectId(id) }, { $set: { name, date, capacity } });

  revalidatePath("/admin/activities");
  revalidatePath("/activities");
  return { success: true };
}

export async function createReservation(
  userId: string,
  activityId: string,
  activityName: string,
  activityDate: string
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
  revalidatePath("/activities");
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
