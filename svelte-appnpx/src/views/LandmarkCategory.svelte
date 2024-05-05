<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { fetchLandmarks, createLandmark, modifyLandmark } from '../controllers/landmarkController';
    import { getAuth } from 'firebase/auth';

    export let categoryId = '';
    export let categoryName = '';

    let landmarks = [];
    let landmarkName = '';
    let description = '';
    let latitude = '';
    let longitude = '';
    let error = '';

    let editMode = false;
    let editLandmarkId = null;
    let editLandmarkName = '';
    let editDescription = '';
    let editLatitude = '';
    let editLongitude = '';

    const auth = getAuth();
    let user = auth.currentUser;

    onMount(async () => {
        user = auth.currentUser;
        if (!user) {
            console.error("User not logged in");
            navigate('/signin');
            return;
        }

        landmarks = await fetchLandmarks(categoryId);
    });

    async function handleSubmit() {
        if (!landmarkName || !description || !latitude || !longitude) {
            error = 'All fields must be filled!';
            return;
        }

        const landmark = { name: landmarkName, description, latitude, longitude };
        const result = await createLandmark(landmark, categoryId);

        if (result) {
            alert('Landmark added successfully!');
            landmarks = await fetchLandmarks(categoryId); // Refresh landmarks list
            resetForm();
        } else {
            error = 'Failed to add landmark. Please try again.';
        }
    }

    async function handleEditSubmit() {
        if (!editLandmarkName || !editDescription || !editLatitude || !editLongitude) {
            error = 'All fields must be filled!';
            return;
        }

        const updatedLandmark = { name: editLandmarkName, description: editDescription, latitude: editLatitude, longitude: editLongitude };
        const result = await modifyLandmark(editLandmarkId, updatedLandmark, categoryId);

        if (result) {
            alert('Landmark updated successfully!');
            landmarks = await fetchLandmarks(categoryId); // Refresh landmarks list
            resetEditForm();
        } else {
            error = 'Failed to update landmark. Please try again.';
        }
    }

    function resetForm() {
        landmarkName = '';
        description = '';
        latitude = '';
        longitude = '';
        error = '';
    }

    function resetEditForm() {
        editMode = false;
        editLandmarkId = null;
        editLandmarkName = '';
        editDescription = '';
        editLatitude = '';
        editLongitude = '';
        error = '';
    }

    function startEditLandmark(landmark) {
        editMode = true;
        editLandmarkId = landmark.id;
        editLandmarkName = landmark.name;
        editDescription = landmark.description;
        editLatitude = landmark.latitude;
        editLongitude = landmark.longitude;
    }
</script>

<main>
    <h1>{categoryName}</h1>

    <ul>
        {#each landmarks as landmark}
            <li>
                {#if editMode && editLandmarkId === landmark.id}
                    <!-- Edit Landmark -->
                    <form on:submit|preventDefault={handleEditSubmit}>
                        <label for="editName">Landmark Name:</label>
                        <input id="editName" type="text" bind:value={editLandmarkName} />

                        <label for="editDescription">Description:</label>
                        <textarea id="editDescription" bind:value={editDescription}></textarea>

                        <label for="editLatitude">Latitude:</label>
                        <input id="editLatitude" type="text" bind:value={editLatitude} />

                        <label for="editLongitude">Longitude:</label>
                        <input id="editLongitude" type="text" bind:value={editLongitude} />

                        <button type="submit">Save</button>
                        <button type="button" on:click={resetEditForm}>Cancel</button>
                    </form>
                {:else}
                    <!-- Display Landmark -->
                    {landmark.name} - {landmark.description}
                    <br />
                    Latitude: {landmark.latitude}, Longitude: {landmark.longitude}
                    <button on:click={() => startEditLandmark(landmark)}>Edit</button>
                {/if}
            </li>
        {/each}
    </ul>

    <h2>Add New Landmark</h2>
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
