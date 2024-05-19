<script>
    import "../styles/LandmarkCategory.css";
    import { navigate } from "svelte-routing";
    import {
        fetchLandmarks,
        removeLandmark,
        createLandmark,
    } from "../controllers/landmarkController";
    import { user } from "../stores/authStore";
    import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
    import { storage } from "../services/firebase";

    import Footer from "./assets/Footer.svelte";

    export let categoryId = "";
    export let categoryName = "";
    let selectedFiles;

    let landmarks = [];
    let error = "";
    let loading = true;
    let newLandmark = {
        name: "",
        description: "",
        latitude: null,
        longitude: null,
        isPrivate: false,
    };

    $: console.log(`Current category name: ${categoryName}`);

    $: $user, checkAuthState();

    function checkAuthState() {
        if ($user === undefined) {
            loading = true;
            error = "";
        } else if ($user) {
            initializeLandmarks();
        } else {
            error = "User not logged in. Please sign in.";
            loading = false;
            navigate("/signin");
        }
    }

    async function uploadFiles() {
        if (!selectedFiles) return;

        const uploads = [];
        for (const file of selectedFiles) {
            const storageRef = ref(storage, `landmarks/${file.name}`);
            const uploadTask = uploadBytes(storageRef, file).then((snapshot) =>
                getDownloadURL(snapshot.ref),
            );
            uploads.push(uploadTask);
        }

        try {
            const imageUrls = await Promise.all(uploads);
            console.log("Uploaded files and their URLs:", imageUrls);
            return imageUrls;
        } catch (error) {
            console.error("Error uploading files:", error);
        }
    }

    function initializeLandmarks() {
        loading = true;
        fetchLandmarks(categoryId)
            .then((fetchedLandmarks) => {
                landmarks = fetchedLandmarks.map((landmark, index) => {
                    if (!landmark.id) {
                        landmark.id = `fallback-${index}`;
                    }
                    return {
                        ...landmark,
                        uniqueKey: landmark.id,
                    };
                });
                loading = false;
            })
            .catch((err) => {
                error = "Failed to fetch landmarks. Please try again.";
                loading = false;
            });
    }

    async function addNewLandmark() {
        const { name, description, latitude, longitude, isPrivate } =
            newLandmark;

        // Perform validation on the inputs
        if (
            name.length > 30 ||
            description.length > 1000 ||
            !isValidCoordinates(latitude, longitude)
        ) {
            error =
                "Validation failed. Check name, description length, and coordinates.";
            return;
        }

        // Upload files and get URLs
        const imageUrls = await uploadFiles();

        // Prepare the complete landmark data including the image URLs
        const newLandmarkData = {
            name,
            description,
            latitude,
            longitude,
            imageUrls,
            isPrivate,
        };

        // Attempt to create the landmark in Firebase
        if (await createLandmark(newLandmarkData, categoryId)) {
            newLandmark = {
                name: "",
                description: "",
                latitude: null,
                longitude: null,
                isPrivate: false,
            };
            initializeLandmarks(); // Refresh the list of landmarks
        } else {
            error =
                "Failed to add landmark. Please check the data and try again.";
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
                landmarks = landmarks.filter(
                    (landmark) => landmark.id !== landmarkId,
                );
            } else {
                error = "Failed to delete the landmark. Please try again.";
            }
        } catch (err) {
            error = "Failed to delete the landmark. Please try again.";
        }
    }

    function viewLandmark(landmarkId) {
        if (landmarkId) {
            navigate(`/landmark/${categoryId}/${landmarkId}`);
        }
    }
</script>

<main class="">
    <h1 class="title has-text-centered has-text-white">
        Landmarks in "{categoryName}" Category
    </h1>

    {#if loading}
        <p class="notification is-info has-text-centered">
            Loading landmarks...
        </p>
    {:else if error}
        <p class="notification is-danger has-text-centered">{error}</p>
    {:else}
        <div class="box">
            <ul class="landmark-list">
                {#each landmarks as landmark (landmark.uniqueKey)}
                    <li class="landmark-item">
                        <div class="content">
                            <p class="title is-5 has-text-white">
                                {landmark.name}
                            </p>
                            <p class="subtitle is-6 has-text-white">
                                {landmark.description}
                            </p>
                            <p class="has-text-white">
                                Latitude: {landmark.latitude}, Longitude: {landmark.longitude}
                            </p>
                            <p class="privacy-status has-text-white">
                                {#if landmark.isPrivate}
                                    <span class="tag is-danger">Private</span>
                                {:else}
                                    <span class="tag is-success">Public</span>
                                {/if}
                            </p>
                            {#if landmark.imageUrls}
                                {#each landmark.imageUrls as url}
                                    <img
                                        src={url}
                                        alt={`Image of ${landmark.name}`}
                                        style="width: 100px; height: auto;"
                                    />
                                {/each}
                            {/if}
                            <div class="buttons">
                                <button
                                    on:click={() => viewLandmark(landmark.id)}
                                >
                                    View {landmark.name}
                                </button>
                                <button
                                    class="button is-small is-danger"
                                    on:click={() => deleteLandmark(landmark.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </li>
                {/each}
            </ul>
        </div>

        <form on:submit|preventDefault={addNewLandmark}>
            <input
                class="input"
                type="text"
                placeholder="Name"
                bind:value={newLandmark.name}
                maxlength="30"
                required
            />
            <textarea
                class="textarea"
                placeholder="Description"
                bind:value={newLandmark.description}
                maxlength="1000"
                required
            ></textarea>
            <input
                class="input"
                type="number"
                step="0.000001"
                placeholder="Latitude"
                bind:value={newLandmark.latitude}
                required
            />
            <input
                class="input"
                type="number"
                step="0.000001"
                placeholder="Longitude"
                bind:value={newLandmark.longitude}
                required
            />
            <input type="file" multiple bind:files={selectedFiles} />

            <label class="switch">
                <input type="checkbox" bind:checked={newLandmark.isPrivate} />
                <span class="slider round"></span>
            </label>
            <br />
            <button class="button is-primary" type="submit">Add Landmark</button
            >
        </form>
    {/if}
</main>
<Footer />

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

    .notification,
    .box {
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

    input,
    textarea,
    select {
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

    .switch {
        position: relative;
        width: 100px;
        height: 34px;
    }

    .switch input {
        display: none;
    }

    .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.4s;
        border-radius: 34px;
    }

    .slider:before {
        position: absolute;
        content: "";
        height: 26px;
        width: 26px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        transition: 0.4s;
        border-radius: 50%;
    }

    input:checked + .slider {
        background-color: #2196f3;
    }

    input:checked + .slider:before {
        transform: translateX(65px);
    }

    .slider:after {
        content: "Public";
        color: white;
        display: block;
        position: absolute;
        transform: translate(-50%, -50%);
        top: 50%;
        left: 75%;
        font-size: 10px;
        font-family: Verdana, sans-serif;
    }

    input:checked + .slider:after {
        content: "Private";
        left: 25%;
    }
    .tag {
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        color: white;
        margin-right: 5px;
        display: inline-block;
    }

    .is-danger {
        background-color: #f14668;
    }

    .is-success {
        background-color: #48c774;
    }
</style>
