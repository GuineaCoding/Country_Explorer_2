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
    <div class="field">
        <label class="label" for="firstName">First Name</label>
        <div class="control">
            <input class="input" id="firstName" type="text" bind:value={firstName} placeholder="First Name" required>
        </div>
    </div>
  
    <div class="field">
        <label class="label" for="lastName">Last Name</label>
        <div class="control">
            <input class="input" id="lastName" type="text" bind:value={lastName} placeholder="Last Name" required>
        </div>
    </div>
  
    <div class="field">
        <label class="label" for="email">Email</label>
        <div class="control">
            <input class="input" id="email" type="email" bind:value={email} placeholder="Email" required>
        </div>
    </div>
  
    <div class="field">
        <label class="label" for="password">Password</label>
        <div class="control">
            <input class="input" id="password" type="password" bind:value={password} placeholder="Password" required>
        </div>
    </div>
  
    <div class="field">
        <div class="control">
            <button class="button is-primary" type="submit">Sign Up</button>
        </div>
    </div>
  
    {#if error}
      <div class="notification is-danger">
          {error}
      </div>
    {/if}
  </form>
  