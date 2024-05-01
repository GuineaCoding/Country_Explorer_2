<script>
  import { createUser } from '../models/authModel';

  let email = '';
  let password = '';
  let error = '';

  async function signUp() {
    try {
      await createUser(email, password);
      console.log('Signup successful');
    } catch (e) {
      error = e.message;
    }
  }
</script>

<form on:submit|preventDefault={signUp}>
  <input type="email" bind:value={email} placeholder="Email" required>
  <input type="password" bind:value={password} placeholder="Password" required>
  <button type="submit">Sign Up</button>
  {#if error}
    <p style="color: red;">{error}</p>
  {/if}
</form>
