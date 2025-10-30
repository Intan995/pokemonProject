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

// menambahkan role ke JWT(jason web token) oken yang berisi informasi user
declare module "next-auth/jwt" {
  interface JWT {
    role?: string;
  }
}
