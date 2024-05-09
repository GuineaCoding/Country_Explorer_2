<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { db } from '../services/firebase';
    import { ref, set, push, remove, onValue } from 'firebase/database';
    import { user } from '../stores/authStore';

    let categories = [];
    let newCategoryName = '';
    let error = '';
    let loading = true;

    $: $user, checkAuthState(); 

    function checkAuthState() {
        if ($user === undefined) {
            // Auth state still loading
        } else if ($user) {
            // User is logged in
            initializeCategories();
        } else {
            // User is not logged in
            loading = false;
            navigate('/signin');
        }
    }

    function initializeCategories() {
        console.log('Initializing categories...');
        const categoriesRef = ref(db, `users/${$user.uid}/categories`);
        onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                categories = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    name: value.name
                }));
            } else {
                console.error('No categories found.');
                error = 'No categories found.';
            }
            loading = false;
        }, (error) => {
            console.error('Firebase data fetch error:', error);
            error = 'Failed to load data.';
            loading = false;
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

    async function deleteCategory(categoryId) {
        if (!$user) return;

        const categoryRef = ref(db, `users/${$user.uid}/categories/${categoryId}`);
        await remove(categoryRef);
        categories = categories.filter(category => category.id !== categoryId);
    }

    function viewLandmarks(categoryId) {
        navigate(`/landmark-category/${categoryId}`);
    }
</script>

<main class="section">
    <h1 class="title">Category Management</h1>
    {#if loading}
        <p>Loading...</p>
    {:else}
        {#if error}
            <p class="notification is-danger">{error}</p>
        {/if}
        <ul>
            {#each categories as category}
                <li class="mb-2">
                    <span>{category.name}</span>
                    <button class="button is-small is-info" on:click={() => viewLandmarks(category.id)}>View Landmarks</button>
                    <button class="button is-small is-danger ml-2" on:click={() => deleteCategory(category.id)}>Delete</button>
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
