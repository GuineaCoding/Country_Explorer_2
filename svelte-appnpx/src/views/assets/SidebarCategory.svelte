<script>
    import { writable } from 'svelte/store';
    import { onMount } from 'svelte';
    import { ref, onValue } from 'firebase/database';
    import { db } from '../../services/firebase';
    import { navigate } from 'svelte-routing';

    let categories = writable({});
    let activeCategory = writable(null);

    function toggleCategory(categoryName) {
        activeCategory.update(current => current === categoryName ? null : categoryName);
    }

    function handleKeydown(event, categoryName) {
        if (event.key === 'Enter' || event.key === ' ') {
            toggleCategory(categoryName);
            event.preventDefault();
        }
    }

    function goToLandmarkDetails(userId, categoryId, landmarkId) {
        navigate(`/landmark-overview/${userId}/${categoryId}/${landmarkId}`);
    }

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
