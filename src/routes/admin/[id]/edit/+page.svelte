<script>
  import { doc, getDoc, updateDoc } from 'firebase/firestore';
  import { page } from '$app/stores';
  import { onMount } from 'svelte';
  import { db } from '../../../../firebase';

  let description = '';
  let buyerid = '';
  let status = 'pending';

  const { id } = $page.params;

  const STATUS_OPTIONS = [
    { value: 'pending', label: 'Pending' },
    { value: 'processing', label: 'Processing' },
    { value: 'completed', label: 'Completed' }
  ];

  onMount(async () => {
    const ref = doc(db, 'order', id);
    const snapshot = await getDoc(ref);

    if (snapshot.exists()) {
      const data = snapshot.data();
      description = data.description;
      buyerid = data.buyerid;
      status = data.status ?? 'pending';
    }
  });

  const handleUpdate = async () => {
    try {
      const ref = doc(db, 'order', id);
      await updateDoc(ref, {
        description,
        buyerid,
        status
      });

      alert('Item updated successfully!');
      window.location.href = '/admin';
    } catch (error) {
      console.error(error);
    }
  };
</script>
<div class="container mx-auto mt-8 max-w-[560px]">
  <div class="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
    <h1 class="text-3xl font-semibold">Edit Order</h1>
  </div>

  <div class="mb-4">
    <p>Description</p>
    <input
      bind:value={description}
      placeholder="Description"
      class="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
    />
  </div>

  <div class="mb-4">
    <p>Buyer ID</p>
    <input
      bind:value={buyerid}
      placeholder="Buyer ID"
      class="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
    />
  </div>

  <div class="mb-6">
    <p>Status</p>
    <select
      bind:value={status}
      class="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full bg-white"
    >
      {#each STATUS_OPTIONS as option}
        <option value={option.value}>{option.label}</option>
      {/each}
    </select>
  </div>

  <div class="flex w-full gap-2">
    <a
      href="/admin"
      class="text-center bg-gray-300 hover:bg-opacity-80 text-black rounded-lg px-4 py-2 duration-200 w-full"
    >
      Cancel
    </a>

    <button
      on:click={handleUpdate}
      class="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
    >
      Update Order
    </button>
  </div>
</div>