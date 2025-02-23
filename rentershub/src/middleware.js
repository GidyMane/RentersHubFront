import { NextRequest } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

const publicRoutes = ["/successmessage", "/Terms-and-Conditions"];
const authRoutes = ["/login"];
const apiAuthPrefix = "/api/auth";
const DEFAULT_LOGIN_REDIRECT = "/";

const { auth } = NextAuth(authConfig);

export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  console.log(req.auth, "api");

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isRentersHubRoute = nextUrl.pathname.startsWith("/rentershub");

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

  // Restrict /admin access only to Admins
  if (isAdminRoute) {
    if (req.auth.user.role !== "ADMIN") {
      return Response.redirect(new URL("/", nextUrl)); // Redirect unauthorized users
    }
    return null; // Allow access to Admins
  }

  // Restrict /rentershub access only to Landlords and Ground Agents
  if (isRentersHubRoute) {
    if (!["LANDLORD", "GROUND AGENT"].includes(req.auth.user.role)) {
      return Response.redirect(new URL("/", nextUrl)); // Redirect unauthorized users
    }
    return null; // Allow access to Landlords & Ground Agents
  }

  return null;
});

export const config = {
  matcher: [
    "/(api|trpc)(.)",
    "/",
    "/successmessage",
    "/login",
    "/properties",
    "/admin",
    "/admin/:path*",
    "/rentershub/:path*",
    "/Terms-and-conditions",
  ],
};




