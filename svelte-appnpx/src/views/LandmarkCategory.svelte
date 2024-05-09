<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { fetchLandmarks, createLandmark } from '../controllers/landmarkController';
    import { getAuth } from 'firebase/auth';

    // Passed-in properties
    export let categoryId = '';
    export let categoryName = '';

    // State variables
    let landmarks = [];
    let landmarkName = '';
    let description = '';
    let latitude = '';
    let longitude = '';
    let error = '';

    // Get the current authenticated user
    const auth = getAuth();
    let user = auth.currentUser;

    // Fetch landmarks on mount
    onMount(async () => {
        user = auth.currentUser;
        if (!user) {
            console.error("User not logged in");
            navigate('/signin');
            return;
        }

        if (!categoryId) {
            console.error("Category ID is not specified");
            return;
        }

        await fetchAndSetLandmarks();
    });

    // Fetch landmarks and ensure unique entries
    async function fetchAndSetLandmarks() {
        try {
            const fetchedLandmarks = await fetchLandmarks(categoryId);
            const uniqueLandmarks = fetchedLandmarks.reduce((acc, current) => {
                if (!acc.some(item => item.id === current.id)) {
                    acc.push(current);
                }
                return acc;
            }, []);
            landmarks = uniqueLandmarks;
        } catch (err) {
            console.error('Failed to fetch landmarks:', err);
            error = 'Failed to fetch landmarks. Please try again.';
        }
    }

    // Handle new landmark submission
    async function handleSubmit() {
        if (!landmarkName || !description || !latitude || !longitude) {
            error = 'All fields must be filled!';
            return;
        }

        const landmark = { name: landmarkName, description, latitude, longitude };
        try {
            const result = await createLandmark(landmark, categoryId);
            if (result) {
                alert('Landmark added successfully!');
                await fetchAndSetLandmarks(); // Refresh landmarks list
                resetForm();
            } else {
                error = 'Failed to add landmark. Please try again.';
            }
        } catch (err) {
            console.error('Error adding landmark:', err);
            error = 'Error occurred while adding landmark. Please try again.';
        }
    }

    // Reset form inputs
    function resetForm() {
        landmarkName = '';
        description = '';
        latitude = '';
        longitude = '';
        error = '';
    }
</script>

<main class="container">
    <h1 class="title">{categoryName}</h1>

    <ul>
        {#each landmarks as landmark (landmark.id)}
            <li>
                <!-- Display Landmark -->
                <div class="content">
                    {landmark.name} - {landmark.description}
                    <br />
                    Latitude: {landmark.latitude}, Longitude: {landmark.longitude}
                    <button class="button is-small is-info" on:click={() => navigate(`/landmark-details/${landmark.id}`)}>Open Landmark</button>
                </div>
            </li>
        {/each}
    </ul>

    <h2 class="subtitle">Add New Landmark</h2>
    <form on:submit|preventDefault={handleSubmit}>
        {#if error}
            <p class="notification is-danger">{error}</p>
        {/if}

        <div class="field">
            <label class="label" for="name">Landmark Name:</label>
            <input class="input" id="name" type="text" bind:value={landmarkName} />
        </div>

        <div class="field">
            <label class="label" for="description">Description:</label>
            <textarea class="textarea" id="description" bind:value={description}></textarea>
        </div>

        <div class="field">
            <label class="label" for="latitude">Latitude:</label>
            <input class="input" id="latitude" type="text" bind:value={latitude} />
        </div>

        <div class="field">
            <label class="label" for="longitude">Longitude:</label>
            <input class="input" id="longitude" type="text" bind:value={longitude} />
        </div>

        <div class="buttons">
            <button class="button is-link" type="submit">Add Landmark</button>
        </div>
    </form>
</main>
