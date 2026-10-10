import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getDb } from "@/lib/mongodb";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  debug: process.env.NODE_ENV === "development",

  secret: process.env.NEXTAUTH_SECRET,

  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  providers: [
    // =========================================================
    // GOOGLE LOGIN
    // =========================================================

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),

    // =========================================================
    // EMAIL + PASSWORD LOGIN
    // =========================================================

    CredentialsProvider({
      name: "Credentials",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const db = await getDb();

          const email = String(credentials.email)
            .trim()
            .toLowerCase();

          // =====================================================
          // FIND USER IN MONGODB
          // =====================================================

          const user = await db.collection("User").findOne({
            email,
          });

          if (!user) {
            console.log("Login failed: user not found");
            return null;
          }

          if (!user.password) {
            console.log(
              "Login failed: user does not have a password"
            );
            return null;
          }

          // =====================================================
          // CHECK PASSWORD
          // =====================================================

          const isValidPassword = await bcrypt.compare(
            String(credentials.password),
            String(user.password)
          );

          if (!isValidPassword) {
            console.log("Login failed: invalid password");
            return null;
          }

          // =====================================================
          // RETURN NEXTAUTH USER
          // =====================================================

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name || null,
            role: user.role || "USER",
          };
        } catch (error) {
          console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],

  // ===========================================================
  // CALLBACKS
  // ===========================================================

  callbacks: {
    // =========================================================
    // JWT
    // =========================================================

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || "USER";
      }

      return token;
    },

    // =========================================================
    // SESSION
    // =========================================================

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role =
          token.role || "USER";
      }

      return session;
    },

    // =========================================================
    // REDIRECT
    // =========================================================

    async redirect({ url, baseUrl }) {
      if (url.startsWith("/")) {
        return `${baseUrl}${url}`;
      }

      if (new URL(url).origin === baseUrl) {
        return url;
      }

      return baseUrl;
    },
  },
};