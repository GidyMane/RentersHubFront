import { NextRequest } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

<<<<<<< HEAD
const publicroutes = ["/successmessage","/Terms-and-Conditions"];

export const authroutes = ["/login"];

const apiAuthPrefix = "/api/auth";

=======
const publicRoutes = ["/successmessage", "/Terms-and-Conditions", "/", "/properties"];
const authRoutes = ["/login"];
const apiAuthPrefix = "/api/auth";
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
const DEFAULT_LOGIN_REDIRECT = "/";

const { auth } = NextAuth(authConfig);

<<<<<<< HEAD
export default auth(async(req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const date = new Date()

  
  console.log(req.auth)
  

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicroutes.includes(nextUrl.pathname);

  const isAuthRoute = authroutes.includes(nextUrl.pathname);
=======
export default auth(async (req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  console.log(req.auth, "api");

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isRentersHubRoute = nextUrl.pathname.startsWith("/rentershub");
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6

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

<<<<<<< HEAD


=======
  // Restrict /admin access only to Admins
  if (isAdminRoute) {
    if (req.auth.user.role !== "ADMIN") {
      return Response.redirect(new URL("/login", nextUrl)); // Redirect unauthorized users
    }
    return null; // Allow access to Admins
  }

  // Restrict /rentershub access only to Landlords and Ground Agents
  if (isRentersHubRoute) {
    if (!["LANDLORD", "GROUNDAGENT"].includes(req.auth.user.role)) {
      return Response.redirect(new URL("/login", nextUrl)); // Redirect unauthorized users
    }
    return null; // Allow access to Landlords & Ground Agents
  }
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6

  return null;
});

export const config = {
<<<<<<< HEAD
  matcher: ["/(api|trpc)(.)", "/", "/successmessage", "/login", "/properties","/rentershub/:path*", "/Terms-and-conditions"],
};
=======
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




>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
