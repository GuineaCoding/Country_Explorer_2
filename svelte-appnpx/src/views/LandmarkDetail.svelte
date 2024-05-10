<script>
    import { onMount } from 'svelte';
    import { getLandmarkDetails } from '../controllers/landmarkController';
    import { user } from '../stores/authStore'; 
    import { navigate } from 'svelte-routing';

    export let categoryId;
    export let landmarkId;

    let landmark = {};
    let error = '';
    let loading = true;

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
                landmark = await getLandmarkDetails(categoryId, landmarkId);
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
</script>

<main>
    <h1>{landmark.name || 'Landmark Name Not Available'}</h1>
    {#if loading}
        <p>Loading...</p>
    {:else if error}
        <p class="error">{error}</p>
    {:else}
        <div>
            <p>Description: {landmark.description || 'No Description'}</p>
            <p>Latitude: {landmark.latitude || 'No Latitude'}</p>
            <p>Longitude: {landmark.longitude || 'No Longitude'}</p>
        </div>
    {/if}
</main>

<style>
    .error {
        color: red;
    }
</style>
