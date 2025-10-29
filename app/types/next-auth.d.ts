import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

// ✅ Tambahkan properti `role` ke `User` dan `Session`
declare module "next-auth" {
  interface User extends DefaultUser {
    role?: string;
  }

  interface Session extends DefaultSession {
    user: {
      role?: string;
    } & DefaultSession["user"];
  }
}

// ✅ Tambahkan juga ke JWT
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
