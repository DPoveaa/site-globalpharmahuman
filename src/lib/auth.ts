import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

type AuthUser = {
  role?: "ADMIN" | "EMPLOYEE" | "CUSTOMER";
  accessToken?: string;
  phone?: string | null;
  cpf?: string | null;
  permissions?: string[];
  mustChangePassword?: boolean;
};

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
          console.log(`[Auth Authorize] Attempting login for: ${credentials.email}`);
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
            console.log(`[Auth Authorize] Login successful for: ${credentials.email}, role: ${data.user.role}`);
            return {
              ...data.user,
              accessToken: data.token
            };
          } else {
            console.error(`[Auth Authorize] Login failed for: ${credentials.email}, status: ${res.status}`);
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
        const authUser = user as AuthUser;
        token.role = authUser.role ?? "CUSTOMER";
        token.accessToken = authUser.accessToken;
        token.phone = authUser.phone;
        token.cpf = authUser.cpf;
        token.permissions = authUser.permissions;
        token.mustChangePassword = authUser.mustChangePassword;
        console.log(`[Auth JWT Callback] User role: ${token.role}`);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub ?? "";
        session.user.role = token.role ?? "CUSTOMER";
        session.user.phone = token.phone;
        session.user.cpf = token.cpf;
        session.user.permissions = token.permissions;
        session.user.mustChangePassword = token.mustChangePassword;
      }
      // Garante que o accessToken seja passado do token para a sessão
      session.accessToken = token.accessToken;
      console.log(`[Auth Session Callback] Session role: ${session.user?.role}`);
      return session;
    }
  }
};
