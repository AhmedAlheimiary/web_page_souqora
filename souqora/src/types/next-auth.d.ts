import { UserRole } from "@prisma/client";
import { type DefaultSession } from "next-auth";

declare module "@auth/core/types" {
  interface User {
    id?: string;
    role?: UserRole;
    sellerProfileId?: string | null;
    storeSlug?: string | null;
  }

  interface Session {
    user: {
      id?: string;
      role?: UserRole;
      sellerProfileId?: string | null;
      storeSlug?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth" {
  interface User {
    id?: string;
    role?: UserRole;
    sellerProfileId?: string | null;
    storeSlug?: string | null;
  }

  interface Session {
    user: {
      id?: string;
      role?: UserRole;
      sellerProfileId?: string | null;
      storeSlug?: string | null;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    sellerProfileId?: string | null;
    storeSlug?: string | null;
  }
}
