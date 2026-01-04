<script lang="ts">
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { get } from 'svelte/store';
  import { authClient } from '$lib/auth-client';
  import { goto } from '$app/navigation';

  let user = { name: '', email: '' };
  const id = get(page).params.id;
  let error = '';
  let loading = true;

  onMount(async () => {
    try {
      const { data: usersdata, error: errordata } = await authClient.admin.listUsers({query:{}});
      if (errordata) throw new Error(errordata.message || 'Failed to fetch users');

      const users = usersdata?.users || [];
      user = users.find(u => u.id === id) || { name: '', email: '', id };
    } catch (e: any) {
      console.error(e);
      error = e.message || 'Unknown error';
    } finally {
      loading = false;
    }
  });

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

    try {
        const { data: deletedUser, error } = await authClient.admin.removeUser({
        userId: id, 
        });
      goto('/admin/buyer');
    } catch (e: any) {
      console.error(e);
      error = e.message;
    }
  };
</script>

<div class="container mx-auto mt-8 max-w-[560px]">
  <div class="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
    <h1 class="text-3xl font-semibold">Delete User</h1>
  </div>

  {#if loading}
    <p>Loading user info...</p>
  {:else if error}
    <p class="text-red-600">{error}</p>
  {:else}
    <div class="my-12">
      Are you sure you want to delete <strong>{user.name}</strong> ({user.email})?
    </div>

    <div class="flex w-full gap-2">
      <a
        href="/admin/buyer"
        class="text-center bg-gray-300 hover:bg-opacity-80 text-black rounded-lg px-4 py-2 duration-200 w-full"
      >
        Cancel
      </a>
      <button
        class="bg-red-500 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
        type="button"
        on:click={handleDelete}
      >
        Delete
      </button>
    </div>
  {/if}
</div>