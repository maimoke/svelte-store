<script lang="ts">
  import { onMount } from 'svelte';
  import { authClient } from '$lib/auth-client';

  interface User {
    id: string;
    name: string;
    email: string;
    role: string;
  }

  let users: User[] = [];
  let totalUsers = 0;
  let error = '';

  onMount(async () => {
    try {

      const { data: usersdata, error: errordata } = await authClient.admin.listUsers({
        query: {}
      });

      if (errordata) throw new Error(errordata.message || 'Unknown error');

      users = usersdata?.users || [];
      totalUsers = users.length;
    } catch (e: any) {
      console.error(e);
      error = e.message || 'Failed to fetch users';
    }
  });
</script>

<div class="min-h-screen bg-gray-100 p-6">
  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Admin Users Dashboard</h1>

    <a
      href="/admin"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
    >
      Order Dashboard
    </a>
    <a
      href="/admin/buyer/create-user"
      class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
    >
      + Create User
    </a>
  </div>

  <!-- Stats -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="bg-white p-4 rounded-xl shadow">
      <p class="text-gray-500 text-sm">Total Users</p>
      <p class="text-2xl font-bold">{totalUsers}</p>
    </div>
  </div>

  {#if error}
    <p class="text-red-600">{error}</p>
  {:else}
    <!-- Users Table -->
    <div class="bg-white rounded-xl shadow overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50 border-b">
          <tr>
            <th class="px-4 py-3">Name</th>
            <th class="px-4 py-3">Email</th>
            <th class="px-4 py-3">Role</th>          
            <th class="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each users as user}
            <tr class="border-b hover:bg-gray-50">
              <td class="px-4 py-3">{user.name}</td>
              <td class="px-4 py-3">{user.email}</td>
              <td class="px-4 py-3">{user.role}</td>
              <td class="px-4 py-3 text-right space-x-3">
                <a href={`/admin/buyer/${user.id}/edit`} class="text-blue-600 hover:underline">Edit</a>
                <a href={`/admin/buyer/${user.id}/delete`} class="text-red-600 hover:underline">Delete</a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>

      {#if users.length === 0}
        <p class="p-6 text-center text-gray-500">No users found</p>
      {/if}
    </div>
  {/if}
</div>