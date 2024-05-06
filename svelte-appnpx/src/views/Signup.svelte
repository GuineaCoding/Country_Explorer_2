<script>
  import { createUser } from '../models/authModel';

  let email = '';
  let password = '';
  let firstName = '';
  let lastName = '';
  let error = '';

  async function signUp() {
      try {
          await createUser(email, password, firstName, lastName);
          console.log('Signup successful');
      } catch (e) {
          error = e.message;
      }
  }
</script>

<form on:submit|preventDefault={signUp}>
  <input type="text" bind:value={firstName} placeholder="First Name" required>
  <input type="text" bind:value={lastName} placeholder="Last Name" required>
  <input type="email" bind:value={email} placeholder="Email" required>
  <input type="password" bind:value={password} placeholder="Password" required>
  <button type="submit">Sign Up</button>
  {#if error}
      <p style="color: red;">{error}</p>
  {/if}
</form>

<style>
  input {
      display: block;
      margin-bottom: 10px;
      padding: 10px;
      width: 100%;
      box-sizing: border-box;
  }

  button {
      padding: 10px 15px;
      background-color: #007BFF;
      color: white;
      border: none;
      cursor: pointer;
      width: 100%;
  }

  button:hover {
      background-color: #0056b3;
  }

  p {
      color: red;
  }
</style>
