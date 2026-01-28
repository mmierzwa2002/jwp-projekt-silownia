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
        const client = await clientPromise;
        const user = await client
          .db("gym_db")
          .collection<User>("users")
          .findOne({ email: credentials?.email });

        if (!user) throw new Error("Brak użytkownika");

        const isValid = await bcrypt.compare(
          credentials!.password,
          user.password || "",
        );
        if (!isValid) throw new Error("Błędne hasło");

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
      if (session?.user) (session.user as any).role = token.role;
      return session;
    },
  },
};
