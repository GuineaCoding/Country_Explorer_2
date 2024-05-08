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
    <h1>Welcome Home2!</h1>
    <h2>weqwe</h2>
    <button on:click={goToCategoryLandmark}>Manage Categories</button>
</main>