<script>
    import { onMount } from 'svelte';
    import { ref, onValue } from "firebase/database";
    import { db } from '../services/firebase.js'; // corrected import
    import { writable } from 'svelte/store';

    let categories = writable(new Set());

    onMount(() => {
        const catRef = ref(db, 'users');
        onValue(catRef, (snapshot) => {
            const data = snapshot.val();
            let categorySet = new Set();
            for (let userId in data) {
                if (data[userId].categories) {
                    for (let categoryId in data[userId].categories) {
                        categorySet.add(data[userId].categories[categoryId].name);
                    }
                }
            }
            categories.set(categorySet);
        });
    });
</script>

<ul class="category-list">
    {#each Array.from($categories) as category}
        <li class="category-item">{category}</li>
    {/each}
</ul>