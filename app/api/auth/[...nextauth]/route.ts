import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth"; // path to your options

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };