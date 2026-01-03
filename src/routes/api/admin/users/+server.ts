import { createAuthClient } from 'better-auth/client';
import type { RequestHandler } from '@sveltejs/kit';
import { adminClient } from 'better-auth/client/plugins';

const adminAuthClient = createAuthClient({
  	baseURL: "http://localhost:5173",
	plugins: [adminClient()],
});

export const GET: RequestHandler = async () => {
  const { data: users, error } = await adminAuthClient.admin.listUsers({
    query:{},
  });
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify(users), { status: 200 });
};