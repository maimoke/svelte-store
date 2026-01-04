<script lang="ts">
  import { page } from "$app/stores";
  import { get } from "svelte/store";
  import { onMount } from "svelte";
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";

  let user = { id: "", name: "", email: "", role: "user" };
  let error = "";
  let success = "";
  let loading = true;

  const ROLE_OPTIONS = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  const id = get(page).params.id;

  // Fetch user info on mount
  onMount(async () => {
    try {
      const { data: usersdata, error: errordata } =
        await authClient.admin.listUsers({ query: {} });
      if (errordata)
        throw new Error(errordata.message || "Failed to fetch users");

      const users = usersdata?.users || [];
      const target = users.find((u) => u.id === id);

      if (!target) throw new Error("User not found");

      user = { ...target };
    } catch (e: any) {
      console.error(e);
      error = e.message || "Unknown error";
    } finally {
      loading = false;
    }
  });

  const handleUpdate = async () => {
    error = "";
    success = "";

    try {
      const { data, error: updateError } = await authClient.admin.updateUser({
        userId: id,
        data: {
          name: user.name,
          email: user.email,
          role: user.role,
        },
      });

      if (updateError)
        throw new Error(updateError.message || "Failed to update user");

      success = `User ${data.name} updated successfully!`;
      goto('/admin/buyer');
    } catch (e: any) {
      console.error(e);
      error = e.message || "Unknown error";
    }
  };
</script>

<div class="container mx-auto mt-8 max-w-[560px]">
  <div
    class="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4"
  >
    <h1 class="text-3xl font-semibold">Edit User</h1>
  </div>

  {#if loading}
    <p>Loading user info...</p>
  {:else if error}
    <p class="text-red-600">{error}</p>
  {/if}

  {#if !loading && !error}
    {#if success}
      <p class="text-green-600 mb-4">{success}</p>
    {/if}

    <div class="mb-4">
      <p>Name</p>
      <input
        bind:value={user.name}
        placeholder="Full Name"
        class="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
      />
    </div>

    <div class="mb-4">
      <p>Email</p>
      <input
        bind:value={user.email}
        placeholder="Email"
        type="email"
        class="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
      />
    </div>

    <div class="mb-6">
      <p>Role</p>
      <select
        bind:value={user.role}
        class="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full bg-white"
      >
        {#each ROLE_OPTIONS as option}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>

    <button
      on:click={handleUpdate}
      class="bg-blue-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
    >
      Update User
    </button>
  {/if}
</div>
