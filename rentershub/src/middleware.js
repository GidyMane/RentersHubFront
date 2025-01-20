import { NextRequest } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const publicroutes = ["/successmessage","/Terms-and-Conditions"];

export const authroutes = ["/login"];

const apiAuthPrefix = "/api/auth";

const DEFAULT_LOGIN_REDIRECT = "/";

const { auth } = NextAuth(authConfig);

export default auth(async(req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const date = new Date()

  
  console.log(req.auth)
  

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicroutes.includes(nextUrl.pathname);

  const isAuthRoute = authroutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }
    return null;
  }

  if (!isLoggedIn && !isPublicRoute) {
    return Response.redirect(new URL("/login", nextUrl));
  }




  return null;
});

export const config = {
  matcher: ["/(api|trpc)(.)", "/", "/successmessage", "/login", "/rentershub/:path*", "/Terms-and-conditions"],
};