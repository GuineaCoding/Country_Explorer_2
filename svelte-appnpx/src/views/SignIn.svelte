<script>
    import { loginUser, signInWithGoogle } from '../models/authModel';
    import { navigate } from 'svelte-routing'; 
  
    let email = '';
    let password = '';
    let error = '';
  
    async function signIn() {
      try {
        const user = await loginUser(email, password);
        console.log('Login successful', user);
        navigate('/home');   
      } catch (e) {
        error = e.message;
        console.error('Login failed:', e);
      }
    }
  
    async function signInWithGoogleAction() {
      try {
        const user = await signInWithGoogle();
        console.log('Google sign-in successful', user);
        navigate('/home');  
      } catch (e) {
        error = e.message;
        console.error('Google sign-in failed:', e);
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
    <button on:click|preventDefault={signInWithGoogleAction} type="button">Sign In with Google</button>
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
    input, button {
      width: 100%;
      padding: 0.8em;
      margin-top: 0.2em;
      font-size: 1em;
    }
    button {
      background-color: #007BFF;
      color: white;
      border: none;
      cursor: pointer;
    }
    button:hover {
      background-color: #0056b3;
    }
</style>
