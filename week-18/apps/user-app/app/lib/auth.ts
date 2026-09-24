import db from "@repo/db/client";
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcrypt";

export const authOptions = {
    providers: [
      CredentialsProvider({
          name: 'Credentials',
          credentials: {
            phone: { label: "Phone number", type: "text", placeholder: "1231231231" },
            password: { label: "Password", type: "password" }
          },
          // TODO: User credentials type from next-aut
          async authorize(credentials: any) {
            // Do zod validation, OTP validation here
            const existingUser = await db.user.findFirst({
                where: {
                    number: credentials.phone
                }
            });

            if (existingUser) {
                if (!existingUser.password) {
                    return null;
                }
                const passwordValidation = await bcrypt.compare(credentials.password, existingUser.password);
                if (passwordValidation) {
                    return {
                        id: existingUser.id.toString(),
                        name: existingUser.name,
                        email: existingUser.number
                    }
                }
                return null;
            }

            try {
                const hashedPassword = await bcrypt.hash(credentials.password, 10);
                const user = await db.user.create({
                    data: {
                        number: credentials.phone,
                        password: hashedPassword
                    }
                });
            
                return {
                    id: user.id.toString(),
                    name: user.name,
                    email: user.number
                }
            } catch(e) {
                console.error(e);
            }

            return null
          },
        }),
      GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID || "",
          clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
      })
    ],
    secret: process.env.JWT_SECRET || "secret",
    callbacks: {
        // Google sign-ins don't go through authorize(), so ensure a
        // User row exists for them here, matched by email.
        async signIn({ user, account }: any) {
            if (account?.provider === "google") {
                if (!user.email) {
                    return false;
                }
                await db.user.upsert({
                    where: { email: user.email },
                    update: {},
                    create: {
                        email: user.email,
                        name: user.name,
                    }
                });
            }
            return true;
        },
        // Make session.user.id the Postgres User.id for every
        // provider, not just credentials (Google's default id is its
        // own account id, not our row id).
        async jwt({ token, user, account }: any) {
            if (account?.provider === "google" && user?.email) {
                const dbUser = await db.user.findFirst({ where: { email: user.email } });
                if (dbUser) {
                    token.sub = dbUser.id.toString();
                }
            }
            return token;
        },
        // TODO: can u fix the type here? Using any is bad
        async session({ token, session }: any) {
            session.user.id = token.sub

            return session
        }
    }
  }
