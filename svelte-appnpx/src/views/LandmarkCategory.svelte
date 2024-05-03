<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { db } from '../services/firebase';
    import { ref, onValue } from 'firebase/database';
    import { getAuth } from 'firebase/auth';

    export let params = {};

    let landmarks = [];
    const auth = getAuth();

    let user = null; 

    onMount(() => {
        user = auth.currentUser; 
        if (!user) {
            console.error("User not logged in");
            navigate('/signin'); 
            return; 
        }

        const categoryId = params.categoryId;
        const landmarksRef = ref(db, `users/${user.uid}/categories/${categoryId}/landmarks`);

        onValue(landmarksRef, (snapshot) => {
            const data = snapshot.val();
            landmarks = data ? Object.values(data) : [];
        }, {
            onlyOnce: true
        });
    });
</script>

<main>
    <h1>Landmarks in Category</h1>
    <ul>
        {#each landmarks as landmark}
            <li>{landmark.name} - {landmark.description}</li>
        {/each}
    </ul>
</main>
