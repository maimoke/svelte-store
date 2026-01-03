<script lang="ts">
  import { authClient } from "$lib/auth-client";
  import { goto } from "$app/navigation";

  let name = "";
  let email = "";
  let password = "";
  let confirmPassword = "";
  let loading = false;
  let error: string | null = null;

  async function register() {
    error = null;

    if (password !== confirmPassword) {
      error = "Passwords do not match";
      return;
    }

    loading = true;

    const { data, error: err } = await authClient.signUp.email({
      email,
      password,
      name
    });

    loading = false;

    if (err) {
      error = err.message ?? "Registration failed";
      return;
    }

    goto("/buyer");
  }
</script>

<form on:submit|preventDefault={register} class="register-form">
  <h1>Create Account</h1>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <input
    type="text"
    placeholder="Full name"
    bind:value={name}
    required
  />

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

  <input
    type="password"
    placeholder="Confirm password"
    bind:value={confirmPassword}
    required
  />

  <button disabled={loading}>
    {loading ? "Creating account..." : "Register"}
  </button>
</form>

<style>
  .register-form {
    max-width: 420px;
    margin: 4rem auto;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .error {
    color: red;
  }
</style>