<script>
    import { onMount } from 'svelte';
    import { getLandmarkDetails, updateLandmarkDetails } from '../controllers/landmarkController';
    import { user } from '../stores/authStore';
    import { navigate } from 'svelte-routing';

    export let categoryId;
    export let landmarkId;

    let landmark = {
        name: '',
        description: '',
        latitude: '',
        longitude: ''
    };
    let error = '';
    let loading = true;
    let saveError = '';

    // Reactive statement to monitor authentication state
    $: $user, checkAuthState();

    function checkAuthState() {
        if ($user === undefined) {
            loading = true;
            error = '';
        } else if ($user) {
            initializeLandmark();
        } else {
            error = "User not logged in. Please sign in.";
            loading = false;
            navigate('/signin');
        }
    }

    async function initializeLandmark() {
        if (categoryId && landmarkId) {
            try {
                const fetchedLandmark = await getLandmarkDetails(categoryId, landmarkId);
                landmark = { ...fetchedLandmark }; // Spread properties into our editable object
                console.log("Landmark details fetched:", landmark);
            } catch (err) {
                console.error("Failed to load landmark details:", err);
                error = "Failed to load landmark details.";
            }
            loading = false;
        } else {
            error = "Required IDs not provided.";
            loading = false;
        }
    }

    // Function to update and save landmark details
    async function saveLandmarkDetails() {
    saveError = '';
    loading = true;
    console.log("Saving details for:", landmark);
    try {
        await updateLandmarkDetails(categoryId, landmarkId, landmark);
        console.log("Redirecting to category page.");
        navigate(`/landmark-category/${categoryId}`);
    } catch (err) {
        console.error("Failed to update landmark details:", err);
        saveError = "Failed to update landmark details.";
        loading = false;
    }
}
</script>

<main class="container">
    <h1 class="title">Edit Landmark Details</h1>
    {#if loading}
        <progress class="progress is-small is-primary" max="100">Loading...</progress>
    {:else if error}
        <p class="notification is-danger">{error}</p>
    {:else}
        <div class="box">
            <div class="field">
                <label class="label">Name:</label>
                <div class="control">
                    <input class="input" type="text" bind:value={landmark.name}>
                </div>
            </div>
            <div class="field">
                <label class="label">Description:</label>
                <div class="control">
                    <textarea class="textarea" bind:value={landmark.description}></textarea>
                </div>
            </div>
            <div class="field">
                <label class="label">Latitude:</label>
                <div class="control">
                    <input class="input" type="number" step="0.0001" bind:value={landmark.latitude}>
                </div>
            </div>
            <div class="field">
                <label class="label">Longitude:</label>
                <div class="control">
                    <input class="input" type="number" step="0.0001" bind:value={landmark.longitude}>
                </div>
            </div>
            {#if saveError}
                <p class="notification is-danger">{saveError}</p>
            {/if}
            <div class="control">
                <button class="button is-success" on:click={saveLandmarkDetails}>Save</button>
            </div>
        </div>
    {/if}
</main>
