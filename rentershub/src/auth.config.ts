import Credentials from "next-auth/providers/credentials";
// import NextAuth from "next-auth";
import axios from "axios";
// Your own logic for dealing with plaintext password strings; be careful!
import type { NextAuthConfig } from "next-auth";
<<<<<<< HEAD
=======
import { json } from "stream/consumers";
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
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
          // Send the login request
          const res = await axios.post(
            `${process.env.baseUrl}accounts/login/user/`,
            {
              contact: credentials.contact,
              password: credentials.password,
            }
          );
      
<<<<<<< HEAD
          console.dir(res);
=======
          // console.dir(res);
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
      
          // Check if the response is successful
          if (res.status === 200) {
            // Check for an error object in the response body
            if (res.data.error) {
              throw new Error(res.data.error); // Throw the error message from the response
            }
      
            // Extract user details if no error exists
            user = res.data;
            return {
              accessToken: user.result.tokens.access,
              refreshToken: user.result.tokens.refresh,
              user_id: user.result.user_id,
<<<<<<< HEAD
            };
          }
=======
              role: user.result.role,
            };
          }
          else{
            throw new Error (JSON.stringify(res.data))
          }
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
        } catch (error: any) {
          console.error("Authorization error:", error);
      
          // Handle specific errors
          if (error.response) {
            const status = error.response.status;
            if (status === 400) {
              throw new Error('Bad request: Invalid credentials or input.');
            }
          }
      
          // Rethrow the error with the original message
          throw new Error(error.message || 'An unknown error occurred.');
        }
      
        // If no user is returned
        return null;
      }
      
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
        token.refreshToken= user.refreshToken,
<<<<<<< HEAD
        token.user_id = user.user_id as unknown as number
=======
        token.user_id = user.user_id as unknown as number,
        token.role = user.role
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
      }
  

// console.log(token, "token",user, "user", profile , "profile", session , "     session", account, "account", trigger, "trigger")
      return token;  

      
    },
    session: async ({ session, token }) => {
<<<<<<< HEAD
      // console.log(token)
=======
      // console.log(token, "itpoken")
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6
      return {
        ...session,
        user: {
          ...session?.user, 
<<<<<<< HEAD
          accessToken : token.accessToken,
          refreshToken: token.refreshToken,
          user_id: token.user_id as number
=======
          // accessToken : token.accessToken,
          // refreshToken: token.refreshToken,
          user_id: token.user_id as number,
          ...token
          
>>>>>>> da2dc9da5fc186335cc48ca707f8b25d5cfb93b6

          
        }
      }
    },
  },
  secret: process.env.AUTH_SECRET!,
  pages: {
    signIn: "/login",
    error: '/auth/error',
  },
} satisfies NextAuthConfig;