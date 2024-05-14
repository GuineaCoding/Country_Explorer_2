<script>
    import { navigate } from 'svelte-routing';
    import { fetchLandmarks, removeLandmark, createLandmark } from '../controllers/landmarkController';
    import { user } from '../stores/authStore';

    export let categoryId = '';
    export let categoryName = '';

    let landmarks = [];
    let error = '';
    let loading = true;
    let newLandmark = {
        name: '',
        description: '',
        latitude: null,
        longitude: null
    };

    $: console.log(`Current category name: ${categoryName}`);

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

    async function addNewLandmark() {
        const { name, description, latitude, longitude } = newLandmark;
        if (name.length > 30 || description.length > 1000 || !isValidCoordinates(latitude, longitude)) {
            error = 'Validation failed. Check name, description length, and coordinates.';
            return;
        }

        if (await createLandmark(newLandmark, categoryId)) {
            newLandmark = { name: '', description: '', latitude: null, longitude: null };
            initializeLandmarks(); // Refresh the list of landmarks
        } else {
            error = 'Failed to add landmark. Please check the data and try again.';
        }
    }

    function isValidCoordinates(lat, lon) {
        return lat >= -90 && lat <= 90 && lon >= -180 && lon <= 180;
    }

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

    function viewLandmark(landmarkId) {
        if (landmarkId) {
            navigate(`/landmark/${categoryId}/${landmarkId}`);
        }
    }
</script>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(-45deg, #4eb99f, #122f41, #ed563b, #f2b035);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
        color: white;
        padding: 20px;
    }

    .notification, .box {
        width: 80%;
        background-color: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 20px;
    }

    .landmark-list {
        list-style: none;
        padding: 0;
    }

    .landmark-item {
        margin-bottom: 10px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        padding-bottom: 10px;
    }

    .buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 10px;
    }

    button {
        background-color: #f2b035;
        color: white;
        border: none;
        border-radius: 4px;
        padding: 10px 20px;
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    button:hover {
        background-color: #ed563b;
    }

    input, textarea, select {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
        border-radius: 4px;
        border: 1px solid #ddd;
    }

    form {
        width: 80%;
        background-color: rgba(0, 0, 0, 0.5);
        padding: 20px;
        border-radius: 8px;
    }
</style>

<main class="">
    <h1 class="title has-text-centered">Landmarks in "{categoryName}" Category</h1>

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
                                <button on:click={() => viewLandmark(landmark.id)}>
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

        <form on:submit|preventDefault={addNewLandmark}>
            <input class="input" type="text" placeholder="Name" bind:value={newLandmark.name} maxlength="30" required>
            <textarea class="textarea" placeholder="Description" bind:value={newLandmark.description} maxlength="1000" required></textarea>
            <input class="input" type="number" step="0.000001" placeholder="Latitude" bind:value={newLandmark.latitude} required>
            <input class="input" type="number" step="0.000001" placeholder="Longitude" bind:value={newLandmark.longitude} required>
            <button class="button is-primary" type="submit">Add Landmark</button>
        </form>
    {/if}
</main>
