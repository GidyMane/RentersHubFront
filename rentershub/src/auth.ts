import NextAuth from "next-auth";

import { JWT } from "next-auth/jwt";
import { type DefaultSession } from "next-auth";
import authConfig from "./auth.config";
import axios from "axios";






declare module "next-auth" {
  interface CredentialsProvider<T extends Record<string, any> = Record<string, any>> {
    credentials: {
      username: { label: string; type: string; placeholder: string };
      password: { label: string; type: string; placeholder: string };     
      contact: { label: string; type: string; placeholder: string };
    };
  }
  interface Session {
    user: {
      
      accessToken: string;
      refreshToken: string;      
    } & DefaultSession["user"];
  }

  interface User {
    accessToken: string;
    refreshToken: string;

    
  }

  interface Token {
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
  }
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);