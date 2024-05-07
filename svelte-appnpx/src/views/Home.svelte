<script>
    import { navigate } from 'svelte-routing'; 

    function goToLandmarkForm() {
        navigate('/add-landmark');
    }
    function goToCategoryLandmark() {
        navigate('/category-landmark');
    }
</script>

<main>
    <h1>Welcome Home!</h1>
    <button on:click={goToCategoryLandmark}>Manage Categories</button>
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
