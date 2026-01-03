<script lang="ts">
  import { onMount } from 'svelte';
  import { authClient } from '$lib/auth-client';

  let name = '';
  let email = '';
  let password = '';
  let role = 'user'; // optional, e.g., user/admin
  let error = '';
  let success = '';

  const ROLE_OPTIONS = [
    { value: 'user', label: 'User' },
    { value: 'admin', label: 'Admin' }
  ];

  const handleCreate = async () => {
    error = '';
    success = '';

    if (!name || !email || !password) {
      error = 'Name, email, and password are required.';
      return;
    }

    try {
      const { data, error: errordata } = await authClient.admin.createUser({
          name,
          email,
          password,
          role
      });

      if (errordata) throw new Error(errordata.message || 'Unknown error');

      success = `User created successfully!`;

      // Reset form
      name = '';
      email = '';
      password = '';
      role = 'user';
      window.location.href = '/admin/buyer';
    } catch (e: any) {
      console.error(e);
      error = e.message || 'Failed to create user';
    }
  };
</script>

<div class="container mx-auto mt-8 max-w-[560px]">
  <div class="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
    <h1 class="text-3xl font-semibold">Create User</h1>
  </div>

  {#if error}
    <p class="text-red-600 mb-4">{error}</p>
  {/if}

  {#if success}
    <p class="text-green-600 mb-4">{success}</p>
  {/if}

  <div class="mb-4">
    <p>Name</p>
    <input
      bind:value={name}
      placeholder="Full Name"
      class="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
    />
  </div>

  <div class="mb-4">
    <p>Email</p>
    <input
      bind:value={email}
      placeholder="Email"
      type="email"
      class="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
    />
  </div>

  <div class="mb-4">
    <p>Password</p>
    <input
      bind:value={password}
      placeholder="Password"
      type="password"
      class="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
    />
  </div>

  <div class="mb-6">
    <p>Role</p>
    <select
      bind:value={role}
      class="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full bg-white"
    >
      {#each ROLE_OPTIONS as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <button
    on:click={handleCreate}
    class="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
  >
    Create User
  </button>
</div>