import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Invalid credentials');
                }

                await dbConnect();
                const user = await User.findOne({ email: credentials.email });

                if (!user || !user.password) {
                    throw new Error('User not found or uses social login');
                }

                const isCorrectPassword = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isCorrectPassword) {
                    throw new Error('Invalid credentials');
                }

                return user;
            }
        })
    ],
    pages: {
        signIn: '/login',
    },
    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                // @ts-ignore
                session.user.id = token.sub;
                // @ts-ignore
                session.user.role = token.role;
            }
            return session;
        },
        async jwt({ token, user }) {
            if (user) {
                token.sub = user.id;
                // Fetch role from DB on sign-in
                await dbConnect();
                // @ts-ignore
                const dbUser = await User.findOne({ email: user.email || token.email });
                if (dbUser) token.role = dbUser.role;
            }
            return token;
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};
