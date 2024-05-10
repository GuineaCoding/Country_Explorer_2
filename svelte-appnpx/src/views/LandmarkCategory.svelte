<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { fetchLandmarks, removeLandmark } from '../controllers/landmarkController';
    import { user } from '../stores/authStore';

    export let categoryId = '';
    export let categoryName = '';

    let landmarks = [];
    let error = '';
    let loading = true;

    $: $user, checkAuthState();

    function checkAuthState() {
        if ($user === undefined) {
            loading = true;
            error = '';
        } else if ($user) {
            console.log("User is logged in, initializing landmarks...");
            initializeLandmarks();
        } else {
            console.log("No user logged in, redirecting...");
            error = "User not logged in. Please sign in.";
            loading = false;
            navigate('/signin');
        }
    }

    function initializeLandmarks() {
        console.log("Fetching landmarks for categoryId:", categoryId);
        loading = true;
        fetchLandmarks(categoryId).then(fetchedLandmarks => {
            console.log("Fetched landmarks:", fetchedLandmarks);
            landmarks = fetchedLandmarks.map((landmark, index) => {
                if (!landmark.id) {
                    console.error('No ID found for landmark:', landmark);
                    landmark.id = `fallback-${index}`;
                }
                return {
                    ...landmark,
                    uniqueKey: landmark.id
                };
            });
            console.log("Processed landmarks:", landmarks);
            loading = false;
        }).catch(err => {
            console.error('Failed to fetch landmarks:', err);
            error = 'Failed to fetch landmarks. Please try again.';
            loading = false;
        });
    }

    async function deleteLandmark(landmarkId) {
        console.log("Attempting to delete landmark with ID:", landmarkId);
        if (!landmarkId) {
            console.error("Invalid or missing landmark ID.");
            return;
        }
        try {
            const success = await removeLandmark(landmarkId, categoryId);
            if (success) {
                console.log("Landmark deleted successfully");
                landmarks = landmarks.filter(landmark => landmark.id !== landmarkId);
            } else {
                error = 'Failed to delete the landmark. Please try again.';
            }
        } catch (err) {
            console.error('Error during deletion:', err);
            error = 'Failed to delete the landmark. Please try again.';
        }
    }
</script>


<main class="container">
    <h1 class="title has-text-centered">{categoryName}</h1>

    {#if loading}
        <p class="notification is-info has-text-centered">Loading landmarks...</p>
    {:else if error}
        <p class="notification is-danger has-text-centered">{error}</p>
    {:else}
        <div class="box">
            <ul class="landmark-list">
                {#each landmarks as landmark (landmark.uniqueKey)}
                    <li class="landmark-item">
                        <div class="content">
                            <p class="title is-5">{landmark.name}</p>
                            <p class="subtitle is-6">{landmark.description}</p>
                            <p>Latitude: {landmark.latitude}, Longitude: {landmark.longitude}</p>
                            <div class="buttons">
                                <button class="button is-small is-danger" on:click={() => deleteLandmark(landmark.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>
    {/if}
</main>
