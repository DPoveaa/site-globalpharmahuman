import "next-auth";
import "next-auth/jwt";

type UserRole = "ADMIN" | "EMPLOYEE" | "CUSTOMER";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      role: UserRole;
      phone?: string | null;
      cpf?: string | null;
      permissions?: string[];
      mustChangePassword?: boolean;
    };
    accessToken?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    accessToken?: string;
    phone?: string | null;
    cpf?: string | null;
    permissions?: string[];
    mustChangePassword?: boolean;
  }
}
