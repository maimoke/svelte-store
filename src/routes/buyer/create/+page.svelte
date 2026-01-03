<script>
  import { addDoc, collection } from 'firebase/firestore';
  import { db } from '../../../firebase';
  import { onMount } from 'svelte';
  import { authClient } from "$lib/auth-client";
let description = '';
let buyerid = 'buyerID'; //buyerID from auth
let status = 'pending';
let userName = 'Guest';
let email = 'GuestEmail'
const STATUS_OPTIONS = [
{ value: 'pending', label: 'Pending' },
{ value: 'processing', label: 'Processing' },
{ value: 'completed', label: 'Completed' }
];
 const handleCreate = async () => {
  const col = collection(db, 'order');
  await addDoc(col, {
   description,
   userName,
   email,
   status,
  });
  description = '';
  alert('Order added successfully!');
  window.location.href = '/buyer';
 };

  onMount(async () => {
    const { data: session } = await authClient.getSession()
      if (session?.user) {
    userName = session.user.name;
    email = session.user.email;
  }
  });
</script>

<div class="container mx-auto mt-8 max-w-[560px]">
 <div class="flex justify-between items-center pb-4 border-b border-dashed border-gray-900 mb-4">
  <h1 class="text-3xl font-semibold">Create Order</h1>
 </div>

  <div class="mb-4">
    <p>Description</p>
    <input
      bind:value={description}
      placeholder="Description"
      class="mt-1 px-4 py-2 border border-gray-300 rounded-md block w-full"
    />
  </div>

 <button
  on:click={handleCreate}
  class="bg-green-600 hover:bg-opacity-80 text-white rounded-lg px-4 py-2 duration-200 w-full"
  >Create Task</button
 >
</div>