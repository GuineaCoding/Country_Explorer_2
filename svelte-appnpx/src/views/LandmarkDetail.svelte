<script>
    import { onMount } from 'svelte';
    import { getLandmarkDetails, updateLandmarkDetails } from '../controllers/landmarkController';
    import { user } from '../stores/authStore';
    import { navigate } from 'svelte-routing';
    import { ref, deleteObject } from 'firebase/storage';
    import { storage } from '../services/firebase';

    export let categoryId;
    export let landmarkId;

    let landmark = {
        name: '',
        description: '',
        latitude: '',
        longitude: '',
        imageUrls: [],
        isPrivate: false
    };
    let error = '';
    let loading = true;
    let saveError = '';

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
                landmark = {
                    ...fetchedLandmark,
                    imageUrls: fetchedLandmark.imageUrls || [],
                    isPrivate: fetchedLandmark.isPrivate || false
                };
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

    async function saveLandmarkDetails() {
        saveError = '';
        loading = true;
        try {
            await updateLandmarkDetails(categoryId, landmarkId, landmark);
            console.log("Details updated successfully, redirecting to category page.");
            navigate(`/category`);
        } catch (err) {
            console.error("Failed to update landmark details:", err);
            saveError = "Failed to update landmark details.";
            loading = false;
        }
    }

    async function deleteImage(imageUrl) {
        const imageRef = ref(storage, imageUrl);
        try {
            await deleteObject(imageRef);
            console.log('File deleted successfully');
            landmark.imageUrls = landmark.imageUrls.filter(url => url !== imageUrl);
            await updateLandmarkDetails(categoryId, landmarkId, { ...landmark, imageUrls: landmark.imageUrls });
        } catch (error) {
            console.error('Error removing file:', error);
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
        padding: 20px;
        color: white;
        width: 100%;
        box-sizing: border-box;
    }

    .box {
        width: 80%;
        max-width: 800px;
        background-color: rgba(0, 0, 0, 0.6);
        padding: 20px;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .input, .textarea {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: white;
    }

    .button {
        background-color: #f2b035;
        color: white;
        cursor: pointer;
        padding: 10px 20px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
    }

    .button:hover {
        background-color: #ed563b;
    }

    .images-container {
        display: flex;
        flex-wrap: wrap;
        gap: 10px;
        margin-top: 10px;
    }

    .image-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100px;
    }

    .image-wrapper img {
        width: 100%;
        height: auto;
        border-radius: 4px;
    }

    .delete-button {
        background-color: #ff4d4d;
        color: white;
        border: none;
        padding: 5px 10px;
        border-radius: 4px;
        margin-top: 5px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    .delete-button:hover {
        background-color: #ff3333;
    }

    .toggle-control {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 10px;
    }

    .toggle {
        display: none;
    }

    .toggle + .toggle-label {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 24px;
        background-color: #ccc;
        border-radius: 30px;
        padding: 2px;
        transition: background-color 0.3s;
    }

    .toggle:checked + .toggle-label {
        background-color: #48c774;
    }

    .toggle-label::after {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background-color: white;
        border-radius: 50%;
        transition: transform 0.3s;
    }

    .toggle:checked + .toggle-label::after {
        transform: translateX(36px);
    }

    .notification {
        background-color: rgba(0, 0, 0, 0.5);
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        padding: 10px;
        width: 80%;
    }
</style>

<main>
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
            <div class="field">
                <label class="label">Privacy:</label>
                <div class="toggle-control">
                    <input id="privacyToggle" type="checkbox" class="toggle" bind:checked={landmark.isPrivate}>
                    <label for="privacyToggle" class="toggle-label"></label>
                </div>
            </div>
            
            {#if Array.isArray(landmark.imageUrls) && landmark.imageUrls.length > 0}
            <div class="field">
                <label class="label">Images:</label>
                <div class="control images-container">
                    {#each landmark.imageUrls as url (url)}
                        <div class="image-wrapper">
                            <img src={url} alt="Landmark Image">
                            <button class="delete-button" on:click={() => deleteImage(url)}>Delete</button>
                        </div>
                    {/each}
                </div>
            </div>
            {/if}
            {#if saveError}
                <p class="notification is-danger">{saveError}</p>
            {/if}
            <div class="control">
                <button class="button is-success" on:click={saveLandmarkDetails}>Save</button>
            </div>
        </div>
    {/if}
</main>
