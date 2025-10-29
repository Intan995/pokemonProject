import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {},
        password: {},
      },
      async authorize(credentials) {
     
        if (credentials?.username === "pokeone" && credentials?.password === "123") {
          return { id: "1", name: "pokeone", role: "admin" };
        }
        if (credentials?.username === "poketwo" && credentials?.password === "123") {
          return { id: "2", name: "poketwo", role: "user" };
        }
        return null;
      },
    }),
  ],
 callbacks: {
  async jwt({ token, user }) {
    if (user) token.role = user.role;
    return token;
  },
  async session({ session, token }) {
    session.user.role = token.role;
    return session;
  },
  async redirect({ url, baseUrl }) {
    // arahkan berdasarkan role
    if (url.startsWith("/")) return `${baseUrl}${url}`;
    return baseUrl;
  },
},

  pages: {
    signIn: "/login",
  },
});


export { handler as GET, handler as POST };
