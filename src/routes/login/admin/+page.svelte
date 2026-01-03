<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let loading = false;
  let error: string | null = null;

  async function login() {
    loading = true;
    error = null;

    const { data, error: err } = await authClient.signIn.email({
      email,
      password
    });

    loading = false;

    if (err) {
      error = err.message ?? "Login failed";
      return;
    }

    // success
    goto("/admin");
  }
</script>

<form on:submit|preventDefault={login} class="login-form">
  <h1>Login</h1>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <input
    type="email"
    placeholder="Email"
    bind:value={email}
    required
  />

  <input
    type="password"
    placeholder="Password"
    bind:value={password}
    required
  />

  <button disabled={loading}>
    {loading ? "Loging in..." : "Log in"}
  </button>
</form>

<style>
  .login-form {
    max-width: 400px;
    margin: 4rem auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .error {
    color: red;
  }
</style>