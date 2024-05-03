<script>
    import { navigate } from 'svelte-routing';

    let categoryName = '';

    async function addCategory() {
       
        console.log(`Adding category: ${categoryName}`);
      
        navigate('/landmark'); 
    }
</script>

<main>
    <h1>Add a New Landmark Category</h1>
    <form on:submit|preventDefault={addCategory}>
        <input type="text" bind:value={categoryName} placeholder="Enter category name" />
        <button type="submit">Add Category</button>
    </form>
</main>

<style>
    main {
        padding: 20px;
    }
    input, button {
        display: block;
        margin-top: 20px;
        width: 100%;
        padding: 10px;
    }
</style>
