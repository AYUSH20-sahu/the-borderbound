import { AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    // 1. Google OAuth Provider (Free - Google Cloud Console)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),

    // 2. Verified Contestant Google Demo Auth (allows seamless local testing before setting Google API keys)
    CredentialsProvider({
      id: "google-demo",
      name: "Google Account Demo Verification",
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
  secret: process.env.NEXTAUTH_SECRET || "borderbound_jwt_secret_dev_32characters",
};
