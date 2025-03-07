import NextAuth from "next-auth";
import authConfig from "./auth.config";

import { PrismaClient } from "@prisma/client";
import { PrismaAdapter } from "@auth/prisma-adapter";

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      // Add user ID to the session
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      };
    },
    async redirect({ url, baseUrl }) {
      // Check if we're in a local development environment
      const isLocalhost =
        baseUrl.includes("localhost") ||
        baseUrl.includes("127.0.0.1") ||
        process.env.NODE_ENV === "development";

      // If on localhost/development, use the default redirect behavior
      if (isLocalhost) {
        // For absolute URLs that are safe (start with baseUrl), allow the redirect
        if (url.startsWith(baseUrl)) return url;
        // For relative URLs, prepend the baseUrl
        if (url.startsWith("/")) return `${baseUrl}${url}`;
        // Otherwise, redirect to the baseUrl
        return baseUrl;
      }

      // For production environment, enforce the production domain
      const productionUrl = "https://edu-toulouse.org";

      // For relative URLs, prepend the production domain
      if (url.startsWith("/")) return `${productionUrl}${url}`;

      // For absolute URLs that are already on our production domain, allow them
      if (url.startsWith(productionUrl)) return url;

      // Otherwise, redirect to the homepage of your production domain
      return productionUrl;
    },
  },
  ...authConfig,
});
