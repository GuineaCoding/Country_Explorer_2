<script>
    import { loginUser, signInWithGoogle } from '../models/authModel';
    import { navigate } from 'svelte-routing'; 
    import Footer from './assets/Footer.svelte';

    let email = '';
    let password = '';
    let error = '';

    // Function to map Firebase error codes to user-friendly messages
    function getFriendlyErrorMessage(firebaseErrorCode) {
        const errorMessages = {
            'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
            'auth/user-not-found': 'No account found for this email. Please sign up.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/too-many-requests': 'Too many failed attempts. Please try again later.',
            'auth/network-request-failed': 'Network error. Please check your internet connection.',
        };

        return errorMessages[firebaseErrorCode] || 'An unknown error occurred. Please try again.';
    }

    async function signIn() {
        try {
            const user = await loginUser(email, password);
            navigate('/home');
        } catch (e) {
            error = getFriendlyErrorMessage(e.code);
        }
    }

    function goToPasswordReset() {
        navigate('/password-reset');  // This route should match the one set up in your main router
    }

    async function signInWithGoogleAction() {
        try {
            const user = await signInWithGoogle();
            navigate('/home');
        } catch (e) {
            error = getFriendlyErrorMessage(e.code);
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
    .password-reset-button {
        background-color: #ed563b;
    }
</style>

<main>
    <form class="form-container" on:submit|preventDefault={signIn}>
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
                <button class="button" type="submit">Sign In</button>
            </div>
        </div>

        <div class="field">
            <div class="control">
                <button class="button google-button" on:click|preventDefault={signInWithGoogleAction} type="button">Sign In with Google</button>
            </div>
        </div>

        <div class="field">
            <div class="control">
                <button class="button password-reset-button" on:click|preventDefault={goToPasswordReset} type="button">Reset Password</button>
            </div>
        </div>

        {#if error}
            <div class="notification is-danger">
                {error}
            </div>
        {/if}
    </form>
</main>
<Footer />
