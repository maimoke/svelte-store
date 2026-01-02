<script>
  import { collection, getDocs } from 'firebase/firestore';
  import { db } from '../../firebase';
  import { onMount } from 'svelte';

  let orders = [];
  let totalOrders = 0;
  let completedOrders = 0;
  let pendingOrders = 0;

  onMount(async () => {
    const ref = collection(db, 'order');
    const snapshot = await getDocs(ref);

    orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    totalOrders = orders.length;
    completedOrders = orders.filter(o => o.status === 'completed').length;
    pendingOrders = orders.filter(o => o.status !== 'completed').length;
  });
</script>

<div class="min-h-screen bg-gray-100 p-6">
  <!-- Header -->
  <div class="flex justify-between items-center mb-6">
    <h1 class="text-3xl font-bold">Order Dashboard</h1>
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
          <th class="px-4 py-3">Buyer ID</th>
          <th class="px-4 py-3">Description</th>
          <th class="px-4 py-3">Status</th>
          <th class="px-4 py-3 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#each orders as order}
          <tr class="border-b hover:bg-gray-50">
            <td class="px-4 py-3">{order.buyerid}</td>
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