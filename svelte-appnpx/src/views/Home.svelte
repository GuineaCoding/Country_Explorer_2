<script>
    import { navigate } from 'svelte-routing'; // Import navigate for programmatic navigation

    function goToLandmarkForm() {
        navigate('/add-landmark'); // Navigate to the Add Landmark form
    }
</script>

<main>
    <h1>Welcome Home!</h1>
    <button on:click={goToLandmarkForm}>Add Landmark</button> // Button to navigate to the form
</main>

<style>
    button {
        margin-top: 20px;
        padding: 10px 15px;
        background-color: #007BFF;
        color: white;
        border: none;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
</style>
