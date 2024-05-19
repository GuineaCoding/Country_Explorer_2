<script>
    import { navigate } from 'svelte-routing'; 

    import Footer from './assets/Footer.svelte';
    
    function goToLandmarkForm() {
        navigate('/add-landmark');
    }
    function goToCategoryLandmark() {
        navigate('/category');
    }
</script>

<main>
    <h1>Welcome Home2!</h1>
    <h2>weqwe</h2>
    <button on:click={goToCategoryLandmark}>Manage Categories</button>
</main>
<Footer />