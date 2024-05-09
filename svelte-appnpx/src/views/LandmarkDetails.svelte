<script>
    import { onMount } from 'svelte';
    import { params } from 'svelte-routing';
    import { fetchLandmarkDetails } from '../controllers/landmarkController';

    let landmark = {};
    let error = '';

    let landmarkId;
    let categoryId;  

    $: params.subscribe($params => {
        landmarkId = $params.landmarkId;
        categoryId = $params.categoryId; 
        if (landmarkId && categoryId) {
            fetchLandmarkData();
        }
    });

    async function fetchLandmarkData() {
        try {
            landmark = await fetchLandmarkDetails(landmarkId, categoryId);
            if (!landmark) {
                error = 'No landmark details found.';
            }
        } catch (err) {
            error = 'Failed to fetch landmark details.';
            console.error(err);
        }
    }
</script>


<main class="container">
    <h1 class="title">Landmark Details</h1>
    {#if error}
        <p class="notification is-danger">{error}</p>
    {:else}
        <div>
            <h2>{landmark.name}</h2>
            <p>{landmark.description}</p>
            <p>Latitude: {landmark.latitude}</p>
            <p>Longitude: {landmark.longitude}</p>
        </div>
    {/if}
</main>
