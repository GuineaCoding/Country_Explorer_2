<script>
    import { createUser, signInWithGoogle } from '../models/authModel';
    import { navigate } from 'svelte-routing'; 
    import Footer from './assets/Footer.svelte';

    let email = '';
    let password = '';
    let firstName = '';
    let lastName = '';
    let error = '';
    let successMessage = '';
    let userType = 'user';

    // Function to create a user account via email and password
    async function signUp() {
        try {
            // Password must be at least 6 characters long
            if (password.length < 6) {
                throw new Error("Password should have at least 6 characters.");
            }

            // Create the user account
            await createUser(email, password, firstName, lastName, userType);
            successMessage = 'Signup successful. Redirecting to sign-in page...';

            // Redirect after a brief delay to allow user to read the message
            setTimeout(() => {
                navigate('/signin');
            }, 3000);
        } catch (e) {
            // User-friendly error messages
            if (e.code === "auth/email-already-in-use") {
                error = "This email is already registered. Please use another email.";
            } else if (e.code === "auth/weak-password") {
                error = "The password is too weak. Please use a stronger password.";
            } else {
                error = e.message;
            }
        }
    }

    // Function to sign up using Google authentication
    async function signUpWithGoogle() {
        try {
            await signInWithGoogle();
            successMessage = 'Google Signup successful. Redirecting to home page';

            // Redirect after a brief delay to allow user to read the message
            setTimeout(() => {
                navigate('/home');
            }, 3000);
        } catch (e) {
            // Display a general error message for Google sign-up errors
            error = "An error occurred during Google signup. Please try again.";
        }
    }
</script>

<style>
    @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    main {
        display: flex;
        flex-direction: column;
        overflow: auto;
        min-height: 100vh;
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        background: linear-gradient(-45deg, #4eb99f, #122f41, #ed563b, #f2b035);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
    }

    .form-container {
        background: rgba(0, 0, 0, 0.7);
        border-radius: 8px;
        padding: 3rem;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
        width: 90%;
        max-width: 400px;
    }

    .label, .button, .input {
        color: white;
    }

    .input {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
    }

    .button {
        background-color: #f2b035;
        margin-top: 1rem;
        width: 100%;
    }

    .notification {
        margin-top: 1rem;
    }

    .google-button {
        background-color: #4eb99f;
    }
</style>

<main>
    <form class="form-container" on:submit|preventDefault={signUp}>
        <div class="field">
            <label class="label" for="firstName">First Name</label>
            <div class="control">
                <input class="input" id="firstName" type="text" bind:value={firstName} placeholder="First Name" pattern="[A-Za-z]+" required>
            </div>
        </div>

        <div class="field">
            <label class="label" for="lastName">Last Name</label>
            <div class="control">
                <input class="input" id="lastName" type="text" bind:value={lastName} placeholder="Last Name" pattern="[A-Za-z]+" required>
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
                <input class="input" id="password" type="password" bind:value={password} placeholder="Password" minlength="6" required>
            </div>
        </div>

        <div class="field">
            <div class="control">
                <button class="button" type="submit">Sign Up</button>
            </div>
        </div>

        <div class="field">
            <div class="control">
                <button class="button google-button" type="button" on:click={signUpWithGoogle}>Sign Up with Google</button>
            </div>
        </div>

        {#if error}
            <div class="notification is-danger">
                {error}
            </div>
        {/if}

        {#if successMessage}
            <div class="notification is-success">
                {successMessage}
            </div>
        {/if}
    </form>
</main>
<Footer />