import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { User } from "@/types";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Brak danych logowania");
        }

        const client = await clientPromise;
        const db = client.db("gym_full_db");

        const user = await db
          .collection<User>("users")
          .findOne({ email: credentials.email });

        if (!user) {
          console.log(
            "❌ Logowanie: Nie znaleziono użytkownika o emailu:",
            credentials.email,
          );
          throw new Error("Nie znaleziono użytkownika");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password || "",
        );

        if (!isValid) {
          console.log("❌ Logowanie: Błędne hasło dla:", credentials.email);
          throw new Error("Błędne hasło");
        }

        console.log("✅ Logowanie: Sukces dla:", user.name);

        return {
          id: user._id?.toString() || "",
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
};
