<script>
  const goAdmin = () => {
    window.location.href = '/admin';
  };

  const goBuyer = () => {
    window.location.href = '/login/buyer';
  };
</script>

<div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
  <div class="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
    <h1 class="text-3xl font-bold mb-2">Welcome</h1>
    <p class="text-gray-500 mb-8">Choose how you want to log in</p>

    <div class="space-y-4">
      <!-- Admin -->
      <button
        on:click={goAdmin}
        class="w-full py-3 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-500 transition"
      >
        Login as Admin
      </button>

      <!-- Buyer -->
      <button
        on:click={goBuyer}
        class="w-full py-3 rounded-xl bg-green-600 text-white text-lg font-semibold hover:bg-green-500 transition"
      >
        Login as Buyer
      </button>
    </div>
  </div>
</div>