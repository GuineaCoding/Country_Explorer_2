<script>
    import { loginUser } from '../models/authModel';
  
    let email = '';
    let password = '';
    let error = '';
  
    async function signIn() {
      try {
        const user = await loginUser(email, password);
        console.log('Login successful', user);
        // Redirect or perform some action upon successful login
      } catch (e) {
        error = e.message;
        console.error('Login failed:', e);
      }
    }
  </script>
  
  <form on:submit|preventDefault={signIn}>
    <div>
      <label for="email">Email:</label>
      <input id="email" type="email" bind:value={email} placeholder="Enter your email" required>
    </div>
    <div>
      <label for="password">Password:</label>
      <input id="password" type="password" bind:value={password} placeholder="Enter your password" required>
    </div>
    <button type="submit">Sign In</button>
    {#if error}
      <p style="color: red;">{error}</p>
    {/if}
  </form>
  
  <style>
    form > div {
      margin-bottom: 1em;
    }
    label {
      display: block;
      margin-bottom: 0.5em;
    }
    input {
      width: 100%;
      padding: 0.8em;
      font-size: 1em;
      margin-top: 0.2em;
    }
    button {
      width: 100%;
      padding: 1em;
      background-color: #007BFF;
      color: white;
      border: none;
      cursor: pointer;
      font-size: 1em;
    }
    button:hover {
      background-color: #0056b3;
    }
  </style>
  