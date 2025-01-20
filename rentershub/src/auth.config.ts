import Credentials from "next-auth/providers/credentials";
// import NextAuth from "next-auth";
import axios from "axios";
// Your own logic for dealing with plaintext password strings; be careful!
import type { NextAuthConfig } from "next-auth";
// import { ZodError } from "zod"
// import { signInSchema } from "./lib/zod"
// import GoogleProvider from "next-auth/providers/google";
// import { baseUrl } from "./utils/constants";



// async function refreshAccessToken(token: any) {
//   try {
//     const url = ""
//     const response = await fetch(url, {
//       headers: {
//         "Content-Type": "application/x-www-form-urlencoded",
//       },
//       method: "POST",
//     })

//     const refreshedTokens = await response.json()

//     if (!response.ok) {
//       throw refreshedTokens
//     }

//     return {
//       ...token,
//       access_token: refreshedTokens.access_token,
//       accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
//       refresh_token: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
//     }
//   } catch (error) {
//     console.log(error)

//     return {
//       ...token,
//       error: "RefreshAccessTokenError",
//     }
//   }
// }


export default {
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the credentials object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        contact: { label: "contact", type: "text", required: true },
        password: { label: "password", type: "password", required: true },
      },
      authorize: async (credentials) => {
        let user = null;

        try {
        
        // const { contact, password } = await signInSchema.parseAsync(credentials)

        
          
        const res = await axios.post(
          process.env.baseUrl! + "accounts/login/user/",
          {
            contact: credentials.contact,
            password: credentials.password,
          }
        );


        console.dir(res)



        if (res.status === 200) {
          user = res.data;
        }
        return {                      
            accessToken: user.result.access,
            refreshToken: user.result.refresh,
          };;
      
    } catch (error:any)
    {
        console.error("Authorization error:", error);

        // Handle invalid credentials or API errors
        throw new Error(error.message);
      }

      return null; // If no user is returned
    },
    }),
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID!,
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    //   // profile(profile) {
    //   //   return {
    //   //     id: profile.sub,
    //   //     given_name: profile.given_name,
    //   //     family_name: profile.family_name,
    //   //     email: profile.email,
    //   //     image: profile.picture,
    //   //   };
    //   // },
    // }),

  ],
  session: {
    strategy: "jwt",
    maxAge: 15 * 60,
    updateAge: 10 * 60
  },
  callbacks: {
    // { token, user, profile, session, account, trigger }
    jwt: async ({ token, user }) => {

      if (user){
        token.accessToken= user.accessToken,
        token.refreshToken= user.refreshToken
      }
  

// console.log(token, "token",user, "user", profile , "profile", session , "     session", account, "account", trigger, "trigger")
      return token;  

      
    },
    session: async ({ session, token }) => {
      // console.log(token)
      return {
        ...session,
        user: {
          ...session?.user, 
          accessToken : token.accessToken,
          refreshToken: token.refreshToken

          
        }
      }
    },
  },
  secret: process.env.AUTH_SECRET!,
  pages: {
    signIn: "/auth",
    error: '/auth/error',
  },
} satisfies NextAuthConfig;