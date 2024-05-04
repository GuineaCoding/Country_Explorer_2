<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { db } from '../services/firebase';
    import { ref, onValue, push, set } from 'firebase/database';
    import { getAuth } from 'firebase/auth';
    import { addLandmark } from '../models/landmarkModel';

    export let params = {};

    let landmarks = [];
    let landmarkName = '';
    let description = '';
    let latitude = '';
    let longitude = '';
    let error = '';

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
        });
    });

    async function handleSubmit() {
      

        const landmark = { name: landmarkName, description, latitude, longitude };
        const result = await addLandmark(landmark, params.categoryId);

        if (result) {
            alert('Landmark added successfully!');
            resetForm();
        } else {
            error = 'Failed to add landmark. Please try again.';
        }
    }

    function resetForm() {
        landmarkName = '';
        description = '';
        latitude = '';
        longitude = '';
        error = ''; 
    }
</script>

<main>
    <h1>Landmarks in Category</h1>
    <ul>
        {#each landmarks as landmark}
            <li>{landmark.name} - {landmark.description}</li>
        {/each}
    </ul>

    <form on:submit|preventDefault={handleSubmit}>
        {#if error}
            <p class="error">{error}</p>
        {/if}

        <label for="name">Landmark Name:</label>
        <input id="name" type="text" bind:value={landmarkName} />

        <label for="description">Description:</label>
        <textarea id="description" bind:value={description}></textarea>

        <label for="latitude">Latitude:</label>
        <input id="latitude" type="text" bind:value={latitude} />

        <label for="longitude">Longitude:</label>
        <input id="longitude" type="text" bind:value={longitude} />

        <button type="submit">Add Landmark</button>
    </form>
</main>

<style>
    .error {
        color: red;
        margin-bottom: 10px;
    }
    label, input, textarea, button {
        display: block;
        width: 100%;
        margin-top: 10px;
    }
    button {
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
