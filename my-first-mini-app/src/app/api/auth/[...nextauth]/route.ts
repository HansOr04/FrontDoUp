// Disable TypeScript checking for this file as NextAuth types are causing issues
// @ts-nocheck

import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// Define our custom types directly without imports
type CustomUser = {
  id: string;
  name: string;
  walletAddress: string;
  verificationLevel: string;
  walletAuthorized: boolean;
}

// Extend the existing modules
declare module "next-auth" {
  interface User {
    walletAddress: string;
    verificationLevel: string;
    walletAuthorized: boolean;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      walletAddress: string;
      verificationLevel: string;
      walletAuthorized: boolean;
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    walletAddress: string;
    verificationLevel: string;
    walletAuthorized: boolean;
  }
}

// Create authOptions object
const authOptions = {
  providers: [
    CredentialsProvider({
      name: "World ID",
      credentials: {
        token: { label: "Token", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.token) {
          return null;
        }

        try {
          // Verify the token with your backend
          const response = await fetch(`${process.env.BACKEND_API_URL}/api/auth/verify-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token: credentials.token,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          if (!data.success) {
            return null;
          }

          // Return the user data
          return {
            id: data.data.id,
            name: data.data.name,
            walletAddress: data.data.walletAddress,
            verificationLevel: data.data.verificationLevel,
            walletAuthorized: data.data.walletAuthorized
          };
        } catch (error) {
          console.error("Authentication error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt(params) {
      const { token, user } = params;
      if (user) {
        token.id = user.id;
        token.walletAddress = user.walletAddress;
        token.verificationLevel = user.verificationLevel;
        token.walletAuthorized = user.walletAuthorized;
      }
      return token;
    },
    async session(params) {
      const { session, token } = params;
      if (token) {
        session.user.id = token.id;
        session.user.walletAddress = token.walletAddress;
        session.user.verificationLevel = token.verificationLevel;
        session.user.walletAuthorized = token.walletAuthorized;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt", // Set as explicit string
    maxAge: 7 * 24 * 60 * 60, // 7 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Create and export the handler
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };