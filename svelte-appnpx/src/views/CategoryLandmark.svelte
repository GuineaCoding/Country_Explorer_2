<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { getAuth } from 'firebase/auth';
    import { db } from '../services/firebase';
    import { ref, set, push, onValue } from 'firebase/database';

    let categories = [];
    let newCategoryName = '';
    let error = '';

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
        navigate('/signin');
    }
    function viewLandmarks(categoryId) {
        navigate(`/landmark-category/${categoryId}`);
    }

    const categoriesRef = ref(db, `users/${user.uid}/categories`);

    onMount(() => {
        onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            categories = data ? Object.entries(data).map(([key, value]) => ({
                id: key,
                name: value.name
            })) : [];
        });
    });

    async function addCategory() {
        if (newCategoryName.trim() === '') {
            error = 'Please enter a category name.';
            return;
        }

        const newCategoryRef = push(categoriesRef);
        await set(newCategoryRef, { name: newCategoryName });
        categories.push({ id: newCategoryRef.key, name: newCategoryName }); 
        newCategoryName = '';  
    }
</script>

<main>
    <h1>Category Management</h1>
    {#if error}
        <p class="error">{error}</p>
    {/if}
    <ul>
        {#each categories as category}
            <li>
                {category.name}
                <button on:click={() => viewLandmarks(category.id)}>View Landmarks</button>
            </li>
        {/each}
    </ul>
    <div>
        <input type="text" bind:value={newCategoryName} placeholder="Add new category" />
        <button on:click={addCategory}>Add</button>
    </div>
</main>

<style>
    .error {
        color: red;
        margin-bottom: 10px;
    }
    ul {
        list-style-type: none;
        padding: 0;
    }
    li {
        padding: 5px 0;
    }
    input, button {
        margin-top: 10px;
    }
    button {
        padding: 5px 10px;
        background-color: #007BFF;
        color: white;
        border: none;
        cursor: pointer;
    }
    button:hover {
        background-color: #0056b3;
    }
</style>
