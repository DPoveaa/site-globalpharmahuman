import { compare } from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
        
        try {
          // O login deve ser validado pelo BACKEND agora
          const res = await fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password
            })
          });

          if (res.ok) {
            const data = await res.json();
            // O backend retorna { token, user: { id, name, email, role } }
            return {
              ...data.user,
              accessToken: data.token
            };
          }
        } catch (error) {
          console.error("Erro na autenticação via API:", error);
        }

        return null;
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role ?? "CUSTOMER";
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = (token.role as any) ?? "CUSTOMER";
        (session as any).accessToken = token.accessToken;
      }
      return session;
    }
  }
};
