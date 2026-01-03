import { betterAuth } from "better-auth";
import { Pool } from "pg";
import { sveltekitCookies } from "better-auth/svelte-kit";
import { getRequestEvent } from "$app/server";
export const auth = betterAuth({
    database: new Pool({
        // connection options
         connectionString: "postgres://postgres:example@localhost:5432/postgres",
    }),
    emailAndPassword: { 
    enabled: true, 
    }, 
    socialProviders: { 
        google: { 
            prompt: "select_account",
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
        }, 
    },
    user: {
        additionalFields: {
            name: {
            type: "string",
            required: false
            }
        }
    },
    plugins: [sveltekitCookies(getRequestEvent)], // make sure this is the last plugin in the array 
})