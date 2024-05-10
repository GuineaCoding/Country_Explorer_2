<script>
    import { navigate } from 'svelte-routing';
    import { fetchLandmarks, removeLandmark } from '../controllers/landmarkController';
    import { user } from '../stores/authStore';

    export let categoryId = '';
    export let categoryName = '';

    let landmarks = [];
    let error = '';
    let loading = true;

    // Check authentication state
    $: $user, checkAuthState();

    function checkAuthState() {
        if ($user === undefined) {
            loading = true;
            error = '';
        } else if ($user) {
            initializeLandmarks();
        } else {
            error = "User not logged in. Please sign in.";
            loading = false;
            navigate('/signin');
        }
    }

    function initializeLandmarks() {
        loading = true;
        fetchLandmarks(categoryId).then(fetchedLandmarks => {
            landmarks = fetchedLandmarks.map((landmark, index) => {
                if (!landmark.id) {
                    landmark.id = `fallback-${index}`;
                }
                return {
                    ...landmark,
                    uniqueKey: landmark.id
                };
            });
            loading = false;
        }).catch(err => {
            error = 'Failed to fetch landmarks. Please try again.';
            loading = false;
        });
    }

    // Delete a landmark
    async function deleteLandmark(landmarkId) {
        if (!landmarkId) {
            return;
        }
        try {
            const success = await removeLandmark(landmarkId, categoryId);
            if (success) {
                landmarks = landmarks.filter(landmark => landmark.id !== landmarkId);
            } else {
                error = 'Failed to delete the landmark. Please try again.';
            }
        } catch (err) {
            error = 'Failed to delete the landmark. Please try again.';
        }
    }

    // View a landmark detail
    function viewLandmark(landmarkId) {
        if (landmarkId) {
            navigate(`/landmark/${landmarkId}`);
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
                                <button on:click={() => navigate(`/landmark/${categoryId}/${landmark.id}`)}>
                                    View {landmark.name}
                                </button>
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
