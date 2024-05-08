<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { db } from '../services/firebase';
    import { ref, set, push, onValue } from 'firebase/database';
    import { user } from '../stores/authStore'; 

    let categories = [];
    let newCategoryName = '';
    let error = '';
    let loading = true; 

    $: if ($user === null && !loading) {
        navigate('/signin'); 
        loading = false; 
        initializeCategories();
    }

    function initializeCategories() {
        const categoriesRef = ref(db, `users/${$user.uid}/categories`);
        onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            categories = data ? Object.entries(data).map(([key, value]) => ({
                id: key,
                name: value.name
            })) : [];
        });
    }

    async function addCategory() {
        if (newCategoryName.trim() === '') {
            error = 'Please enter a category name.';
            return;
        }

        if (!$user) return; 

        const categoriesRef = ref(db, `users/${$user.uid}/categories`);
        const newCategoryRef = push(categoriesRef);
        await set(newCategoryRef, { name: newCategoryName });
        categories.push({ id: newCategoryRef.key, name: newCategoryName });
        newCategoryName = '';
    }

    function viewLandmarks(categoryId) {
        navigate(`/landmark-category/${categoryId}`);
    }
</script>

<main class="section">
    <h1 class="title">Category Management</h1>
    {#if loading}
        <p>Loading...</p> <!-- Display loading message -->
    {:else}
        {#if error}
            <p class="notification is-danger">{error}</p>
        {/if}
        <ul>
            {#each categories as category}
                <li class="mb-2">
                    <span>{category.name}</span>
                    <button class="button is-small is-info" on:click={() => viewLandmarks(category.id)}>View Landmarks</button>
                </li>
            {/each}
        </ul>
        <div class="field has-addons">
            <div class="control is-expanded">
                <input class="input" type="text" bind:value={newCategoryName} placeholder="Add new category" />
            </div>
            <div class="control">
                <button class="button is-primary" on:click={addCategory}>Add</button>
            </div>
        </div>
    {/if}
</main>
