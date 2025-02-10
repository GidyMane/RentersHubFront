
import { withAuth, } from "@kinde-oss/kinde-auth-nextjs/middleware";

const publicroutes = ["/", "/intime-listings", "/listing", "/blogs", "contact"];

export const authroutes = ["/api/auth/login", "/api/auth/signup"];

const apiAuthPrefix = "/api/auth";

const DEFAULT_LOGIN_REDIRECT = "/intime-admin/dashboard";

export default function middleware(req) {
    const { nextUrl } = req;


    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicroutes.includes(nextUrl.pathname);


    if (isApiAuthRoute) {
        return null;
    }

    if(isPublicRoute){
        return null;
    }


    return withAuth(req, {
        isReturnToCurrentPage: true
    });
}


export const config = {
    matcher: ["/(api|trpc)(.*)", "/", "/contact", "/intime-listings", "/listing", "/blogs", "/contact", "/intime-admin", "/intime-admin/:path*"],
};