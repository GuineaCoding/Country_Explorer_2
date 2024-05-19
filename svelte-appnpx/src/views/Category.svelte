<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { db } from '../services/firebase';
    import { ref, set, push, remove, onValue } from 'firebase/database';
    import { user } from '../stores/authStore';
    import Footer from './assets/Footer.svelte';

    let categories = [];
    let newCategoryType = '';
    let error = '';
    let loading = true;

    const categoryTypes = [
        "Mountain",
        "Museum",
        "Beach",
        "Park",
        "Historical Site",
        "Restaurant",
        "Shopping Mall",
        "Art Gallery"
    ];

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
        const categoriesRef = ref(db, `users/${$user.uid}/categories`);
        onValue(categoriesRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                categories = Object.entries(data).map(([key, value]) => ({
                    id: key,
                    name: value.name
                }));
            } else {
                categories = [];
                error = 'No categories found.';
            }
            loading = false;
        }, (error) => {
            error = 'Failed to load data.';
            loading = false;
        });
    }

    async function addCategory() {
        if (newCategoryType.trim() === '') {
            error = 'Please select a category type.';
            return;
        }

        if (!$user) return;

        const categoriesRef = ref(db, `users/${$user.uid}/categories`);
        const newCategoryRef = push(categoriesRef);
        await set(newCategoryRef, { name: newCategoryType });
        categories.push({ id: newCategoryRef.key, name: newCategoryType });
        newCategoryType = '';

        
        window.location.reload();
    }

    async function deleteCategory(categoryId) {
        if (!$user) return;

        const categoryRef = ref(db, `users/${$user.uid}/categories/${categoryId}`);
        await remove(categoryRef);
        categories = categories.filter(category => category.id !== categoryId);
    }

    function viewLandmarks(categoryId, categoryName) {
        navigate(`/landmark-category/${categoryId}/${encodeURIComponent(categoryName)}`);
    }

    
    $: availableCategoryTypes = categoryTypes.filter(type => !categories.some(category => category.name === type));
</script>


<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(-45deg, #4eb99f, #122f41, #ed563b, #f2b035);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
    color: white; 
    padding: 20px;
  }

  .user-info, .edit-form {
    margin: 20px;
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2); 
    border-radius: 8px;
    background-color: rgba(0, 0, 0, 0.5); 
    width: 80%; 
  }

  .edit-form input, .edit-form select, .edit-form button {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 4px;
    border: none;
  }

  .edit-form button {
    background-color: #f2b035; 
    color: white;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
  }

  .edit-form button:hover {
    background-color: #ed563b;
  }

  .description {
    margin-bottom: 20px;
    text-align: center;
    font-size: 1.2rem;
  }

  label {
    display: block;
    margin-bottom: 5px;
  }

  .category-list {
    margin-bottom: 40px;
    width: 80%; 
    background-color: rgba(0, 0, 0, 0.5); 
    padding: 20px;
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
  }

  .category-list li {
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .category-list .button {
    background-color: #f2b035; /* Button color */
    color: white;
    cursor: pointer;
    font-size: 1rem;
    transition: background-color 0.2s ease;
    margin-left: 10px;
  }

  .category-list .button:hover {
    background-color: #ed563b; /* Button hover effect */
  }

  .dropdown {
    margin: 20px 0;
  }

  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
</style>

<main class="section">
    <h1 class="title has-text-white">Category Management</h1>
    <p class="description">
        Choose a category to add from the dropdown below. Engage with adding content to enhance your experience and share your adventures with others. Make it awesome!
    </p>
    {#if loading}
        <p>Loading...</p>
    {:else}
        {#if error}
            <p class="notification is-danger">{error}</p>
        {/if}
        {#if categories.length > 0}
            <div class="category-list">
                <ul>
                    {#each categories as category}
                        <li class="mb-2">
                            <span>{category.name}</span>
                            <div>
                                <button class="button is-info" on:click={() => viewLandmarks(category.id, category.name)}>View Landmarks</button>
                                <button class="button is-danger" on:click={() => deleteCategory(category.id)}>Delete</button>
                            </div>
                        </li>
                    {/each}
                </ul>
            </div>
        {/if}
        <div class="edit-form">
            <label for="categoryType">Add new category:</label>
            <select id="categoryType" class="dropdown" bind:value={newCategoryType} required>
                <option value="" disabled selected>Select a category type</option>
                {#each availableCategoryTypes as categoryType}
                    <option value={categoryType}>{categoryType}</option>
                {/each}
            </select>
            <button class="button is-primary" on:click={addCategory}>Add</button>
        </div>
    {/if}
</main>
<Footer />