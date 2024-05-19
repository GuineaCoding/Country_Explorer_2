<script>
    // Import writable store from svelte
    import { writable } from 'svelte/store';

    // Import onMount lifecycle function from svelte
    import { onMount } from 'svelte';

    // Import firebase database functions
    import { ref, onValue } from 'firebase/database';

    // Import firebase database instance
    import { db } from '../../services/firebase';

    // Import navigate function from svelte-routing
    import { navigate } from 'svelte-routing';

    let categories = writable({});
    let activeCategory = writable(null);

    // Function to toggle the active category
    function toggleCategory(categoryName) {
        activeCategory.update(current => current === categoryName ? null : categoryName);
    }

    // Function to handle keydown event for category toggle
    function handleKeydown(event, categoryName) {
        if (event.key === 'Enter' || event.key === ' ') {
            toggleCategory(categoryName);
            event.preventDefault();
        }
    }

    // Function to navigate to landmark details
    function goToLandmarkDetails(userId, categoryId, landmarkId) {
        navigate(`/landmark-overview/${userId}/${categoryId}/${landmarkId}`);
    }

    // Fetch categories and landmarks on component mount
    onMount(() => {
        const catRef = ref(db, 'users');
        onValue(catRef, (snapshot) => {
            const data = snapshot.val();
            let newCategories = {};
            for (let userId in data) {
                if (data[userId].categories) {
                    for (let categoryId in data[userId].categories) {
                        let categoryName = data[userId].categories[categoryId].name;
                        let landmarks = data[userId].categories[categoryId].landmarks || {};
                        newCategories[categoryName] = newCategories[categoryName] || [];
                        
                        for (let landmarkId in landmarks) {
                            let landmark = {...landmarks[landmarkId], userId, categoryId, id: landmarkId};
                            if (!landmark.isPrivate) {
                                newCategories[categoryName].push(landmark);
                            }
                        }
                    }
                }
            }
            categories.set(newCategories);
        });
    });
</script>


<style>
    .category-list {
        width: 100%;
        overflow-y: auto;
        padding: 0;
    }
    .landmarks {
        list-style-type: none;
        padding: 0;
        display: none;
    }
    .landmarks.open {
        display: block;
    }
    button {
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
        padding: 0.75rem 1.25rem;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    button:hover, button:focus {
        background-color: #f2f2f2;
    }
    .icon {
        margin-left: auto;
    }
</style>

<ul class="menu-list">
    {#each Object.entries($categories) as [categoryName, landmarks]}
        <li>
            <button class="category-item" on:click={() => toggleCategory(categoryName)} on:keydown={(event) => handleKeydown(event, categoryName)}>
                {categoryName}
                <span class="icon">
                    {#if $activeCategory === categoryName}
                        <i class="fas fa-minus"></i>
                    {:else}
                        <i class="fas fa-plus"></i>
                    {/if}
                </span>
            </button>
            {#if $activeCategory === categoryName}
                <ul class="landmarks open">
                    {#each landmarks as landmark}
                        <li>
                            <button on:click={() => goToLandmarkDetails(landmark.userId, landmark.categoryId, landmark.id)}>
                                {landmark.name}
                            </button>
                        </li>
                    {/each}
                </ul>
            {/if}
        </li>
    {/each}
</ul>
