<script>
    // Import resetPassword function from authModel
    import { resetPassword } from '../models/authModel';

    // Import Footer component
    import Footer from './assets/Footer.svelte';

    let email = '';

    // Function to handle password reset
    async function handlePasswordReset(event) {
        event.preventDefault();  
        if (email) { 
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


<form on:submit|preventDefault={handlePasswordReset}>
    <input type="email" bind:value={email} placeholder="Enter your email" required>
    <button type="submit">Reset Password</button>
</form>
<Footer />