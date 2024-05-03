<script>
    import { navigate } from 'svelte-routing';
    let categories = ['Park', 'Trails', 'Museum', 'Historic Site', 'Art Gallery', 'Garden', 'Beach'];

    function goToAddCategory() {
        navigate('/add-category');
    }
</script>

<main>
    <h1>Landmark Details</h1>
    
    <div>
        <label for="category">Categories:</label>
        <select id="category">
            <option disabled selected>Select a category</option>
            {#each categories as category}
                <option value={category}>{category}</option>
            {/each}
        </select>
        <button on:click={goToAddCategory}>Add New Category</button>
    </div>
</main>

<style>
    /* existing styles */
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
