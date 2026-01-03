import { createAuthClient } from "better-auth/client";
export const authClient = createAuthClient({
  	baseURL: "http://localhost:5173",
});
export const { signIn, signUp, useSession } = authClient;