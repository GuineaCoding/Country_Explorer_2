<script>
    import { resetPassword } from '../models/authModel';
    let email = '';

    async function handlePasswordReset(event) {
        event.preventDefault();  // Stop the form from submitting normally
        if (email) { // Check if email is not empty
            try {
                const message = await resetPassword(email.trim());
                console.log(message);
            } catch (error) {
                console.error("Reset password error:", error.message);
            }
        } else {
            console.error("Email field is empty");
        }
    }
</script>

<!-- Form in your Svelte component -->
<form on:submit|preventDefault={handlePasswordReset}>
    <input type="email" bind:value={email} placeholder="Enter your email" required>
    <button type="submit">Reset Password</button>
</form>
