<script>
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from '../../firebase';
  import { onMount } from 'svelte';
  import { authClient } from '$lib/auth-client';
  import { goto } from "$app/navigation";

  let orders = [];
  let totalOrders = 0;
  let completedOrders = 0;
  let pendingOrders = 0;
  let userName = 'Guest';
  let email = 'GuestEmail'
  let role = 'user'

  onMount(async () => {
    const ref = collection(db, 'order');
    const snapshot = await getDocs(ref);
    const { data: session } = await authClient.getSession()
        if (session?.user) {
      userName = session.user.name;
      email = session.user.email
      role = session.user.role
      if (role !== 'admin'){
      alert("This user do not have permission as admin")
      goto("/");
    }
    }else{
      alert("Please Login again")
      goto("/");
    }
    orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    totalOrders = orders.length;
    completedOrders = orders.filter(o => o.status === 'completed').length;
    pendingOrders = orders.filter(o => o.status !== 'completed').length;
  });
      const handleLogout = async () => {
      await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          goto('/');
        },
      },
    });
  }
  
</script>

<div class="min-h-screen bg-gray-100 p-6">
  <!-- Header -->
  <h1 class="text-3xl font-bold">Hello {userName}</h1>
  <button
  on:click={handleLogout}
  class="bg-red-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200"
  >Log out</button
  >
  <hr>
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Admin Order Dashboard</h1>

    <a
      href="admin/buyer"
      class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition"
    >
      User Dashboard
    </a>

    <a
      href="admin/create"
      class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-500 transition"
    >
      + Create Order
    </a>
  </div>

  <!-- Stats -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
    <div class="bg-white p-4 rounded-xl shadow">
      <p class="text-gray-500 text-sm">Total Orders</p>
      <p class="text-2xl font-bold">{totalOrders}</p>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
      <p class="text-gray-500 text-sm">Completed</p>
      <p class="text-2xl font-bold text-green-600">{completedOrders}</p>
    </div>

    <div class="bg-white p-4 rounded-xl shadow">
      <p class="text-gray-500 text-sm">Pending</p>
      <p class="text-2xl font-bold text-yellow-600">{pendingOrders}</p>
    </div>
  </div>

  <!-- Orders Table -->
  <div class="bg-white rounded-xl shadow overflow-hidden">
    <table class="w-full text-left">
      <thead class="bg-gray-50 border-b">
        <tr>
          <th class="px-4 py-3">Buyer Name</th>
          <th class="px-4 py-3">Buyer Email</th>
          <th class="px-4 py-3">Description</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each orders as order}
          <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-3">{order.userName}</td>
            <td class="px-4 py-3">{order.email}</td>
            <td class="px-4 py-3 text-gray-600">{order.description}</td>
            <td class="px-4 py-3">
              <span
                class="px-2 py-1 rounded-full text-xs font-semibold
                  {order.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'}"
              >
                {order.status}
              </span>
            </td>
            <td class="px-4 py-3 text-right space-x-3">
              <a
                href={`/admin/${order.id}/edit`}
                class="text-blue-600 hover:underline"
              >
                Edit
              </a>
              <a
                href={`/admin/${order.id}/delete`}
                class="text-red-600 hover:underline"
              >
                Delete
              </a>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>

    {#if orders.length === 0}
      <p class="p-6 text-center text-gray-500">No orders found</p>
    {/if}
  </div>
</div>