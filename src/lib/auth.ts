import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

const isDev = process.env.NODE_ENV === "development";
const enableDemoAuth = isDev && process.env.ENABLE_DEMO_AUTH === "true";

if (!process.env.NEXTAUTH_SECRET && process.env.NODE_ENV === "production") {
  console.warn(
    "[Configuration Notice] NEXTAUTH_SECRET is not defined in environment. NextAuth requires this secret to be set in your Vercel Dashboard."
  );
}

export const authOptions: AuthOptions = {
  providers: [
    // 1. Production Google OAuth Provider (Free - Google Cloud Console)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // 2. Development-Only Demo Verification (Disabled completely in production)
    ...(enableDemoAuth
      ? [
          CredentialsProvider({
            id: "google-demo",
            name: "Google Account Demo Verification (Development Only)",
            credentials: {
              email: { label: "Google Email", type: "email", placeholder: "applicant@gmail.com" },
              name: { label: "Full Name", type: "text", placeholder: "Alex Chen" },
            },
            async authorize(credentials) {
              if (!credentials?.email || !credentials?.name) return null;
              return {
                id: `demo_${Date.now()}`,
                name: credentials.name,
                email: credentials.email.toLowerCase(),
                image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80",
              };
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        // @ts-expect-error - Augmenting user session
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "borderbound_dev_secret_32_characters_minimum",
};
