// app/api/auth/[...nextauth]/route.ts
import NextAuth, { type NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import type { DefaultSession } from "next-auth";
import type { JWT } from "next-auth/jwt";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export type Role = "USER" | "PRACTITIONER" | "ADMIN";

/** ---- Module augmentation: add id/role to Session & User ---- */
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
  interface User {
    id: string;
    role: Role;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = String(creds?.email ?? "");
        const password = String(creds?.password ?? "");
        if (!email || !password) return null;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !user.passwordHash) return null;

        const ok = await bcrypt.compare(password, user.passwordHash);
        if (!ok) return null;

        const role = (user.role ?? "USER") as Role;

        return {
          id: user.id,
          email: user.email,
          name: user.name ?? null,
          role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: JWT; user?: { id: string; role: Role } | null }) {
      if (user) token.role = user.role; // on sign-in
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.sub ?? "") as string;
        session.user.role = (token.role ?? "USER") as Role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/signin",
  },
};

// Route Handlers for NextAuth (App Router)
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
