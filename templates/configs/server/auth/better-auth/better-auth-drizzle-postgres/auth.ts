import { accounts, db, sessions, users, verifications } from "@repo/database";
import { type BetterAuthOptions, betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
    database: drizzleAdapter(db, {
        provider: "pg",
        schema: {
            user: users,
            session: sessions,
            account: accounts,
            verification: verifications,
        },
    }),
    socialProviders: {
        github: {
            clientId: process.env.GITHUB_ID as string,
            clientSecret: process.env.GITHUB_SECRET as string,
            scope: ["read:user", "user:email"],
            mapProfileToUser(profile) {
                return {
                    name: profile.name,
                    email: profile.email,
                    username: profile.login,
                    avatar: profile.avatar_url,
                };
            },
        },
    },
    user: {
        additionalFields: {
            username: {
                type: "string",
                unique: true,
            },
        },
    },
} satisfies BetterAuthOptions);

export type Session = typeof auth.$Infer.Session;
