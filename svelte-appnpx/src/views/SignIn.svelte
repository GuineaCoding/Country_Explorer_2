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
  <div class="field">
      <label class="label" for="email">Email:</label>
      <div class="control">
          <input class="input" id="email" type="email" bind:value={email} placeholder="Enter your email" required>
      </div>
  </div>

  <div class="field">
      <label class="label" for="password">Password:</label>
      <div class="control">
          <input class="input" id="password" type="password" bind:value={password} placeholder="Enter your password" required>
      </div>
  </div>

  <div class="field">
      <div class="control">
          <button class="button is-primary" type="submit">Sign In</button>
      </div>
  </div>

  <div class="field">
      <div class="control">
          <button class="button is-link" on:click|preventDefault={signInWithGoogleAction} type="button">Sign In with Google</button>
      </div>
  </div>

  {#if error}
      <div class="notification is-danger">
          {error}
      </div>
  {/if}
</form>
