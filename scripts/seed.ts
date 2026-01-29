import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("❌ Błąd: Brak MONGODB_URI w pliku .env.local");
}

const DB_NAME = "gym_full_db";

async function main() {
  const client = new MongoClient(MONGODB_URI as string);

  try {
    await client.connect();
    console.log(`✅ Połączono z MongoDB. Baza: ${DB_NAME}`);

    const db = client.db(DB_NAME);
    console.log("🧹 Usuwanie starych danych...");
    await db.collection("users").deleteMany({});
    await db.collection("membership_types").deleteMany({});
    await db.collection("active_memberships").deleteMany({});
    await db.collection("activities").deleteMany({});
    await db.collection("reservations").deleteMany({});
    const hashedPassword = await bcrypt.hash("1234", 10);
    console.log("👤 Tworzenie użytkowników...");

    const adminId = new ObjectId();
    const userId1 = new ObjectId();
    const userId2 = new ObjectId();

    const users = [
      {
        _id: adminId,
        name: "Admin Szef",
        email: "admin@gym.com",
        password: hashedPassword,
        role: "admin",
      },
      {
        _id: userId1,
        name: "Jan Kowalski",
        email: "jan@gym.com",
        password: hashedPassword,
        role: "user",
      },
      {
        _id: userId2,
        name: "Anna Nowak",
        email: "anna@gym.com",
        password: hashedPassword,
        role: "user",
      },
    ];

    await db.collection("users").insertMany(users);
    console.log("💳 Tworzenie oferty karnetów...");

    const memTypeId1 = new ObjectId();
    const memTypeId2 = new ObjectId();

    const membershipTypes = [
      {
        _id: memTypeId1,
        name: "Karnet Student",
        price: 99,
        durationMonths: 1,
      },
      {
        _id: memTypeId2,
        name: "Karnet Open",
        price: 159,
        durationMonths: 1,
      },
      {
        _id: new ObjectId(),
        name: "Karnet VIP (Rok)",
        price: 1200,
        durationMonths: 12,
      },
    ];

    await db.collection("membership_types").insertMany(membershipTypes);

    console.log("🎟️ Przypisywanie karnetu dla Jana...");

    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 1);

    await db.collection("active_memberships").insertOne({
      userId: userId1.toString(),
      membershipTypeId: memTypeId2.toString(),
      typeName: "Karnet Open",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive: true,
    });

    console.log("🏋️ Tworzenie grafiku zajęć...");

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const activityId1 = new ObjectId();

    const activities = [
      {
        _id: activityId1,
        name: "Joga Poranna",
        date: new Date(tomorrow.setHours(8, 0, 0, 0)).toISOString(),
        capacity: 15,
      },
      {
        _id: new ObjectId(),
        name: "Crossfit Hardcore",
        date: new Date(tomorrow.setHours(18, 0, 0, 0)).toISOString(),
        capacity: 10,
      },
      {
        _id: new ObjectId(),
        name: "Zumba",
        date: new Date(dayAfter.setHours(19, 0, 0, 0)).toISOString(),
        capacity: 25,
      },
    ];

    await db.collection("activities").insertMany(activities);
    console.log("📝 Zapisywanie Jana na Jogę...");

    await db.collection("reservations").insertOne({
      userId: userId1.toString(),
      activityId: activityId1.toString(),
      activityName: "Joga Poranna",
      activityDate: activities[0].date,
      createdAt: new Date().toISOString(),
    });

    console.log("\n🚀 SUKCES! Baza danych została zresetowana i napełniona.");
    console.log("-------------------------------------------------------");
    console.log("🔑 KONTO ADMINA:  admin@gym.com  / 1234");
    console.log(
      "🔑 KONTO USERA:   jan@gym.com    / 1234  (Ma karnet i rezerwację)",
    );
    console.log("🔑 KONTO USERA:   anna@gym.com   / 1234  (Puste konto)");
    console.log("-------------------------------------------------------");
  } catch (error) {
    console.error("❌ Błąd krytyczny podczas seedowania:", error);
  } finally {
    await client.close();
  }
}

main();
