<script>
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import { ref, onValue } from 'firebase/database';
    import { db } from '../services/firebase.js'; 
    import { API_KEY } from '../services/firebase.js'; 
    import { writable } from 'svelte/store';

    export let userId;
    export let categoryId;
    export let landmarkId;

    let landmarkData = {};
    let weatherData = null;   
    let loading = true;
    let error = '';
    let mapContainer1, mapContainer2, mapContainer3;

    onMount(() => {
        if (userId && categoryId && landmarkId) {
            const landmarkRef = ref(db, `users/${userId}/categories/${categoryId}/landmarks/${landmarkId}`);
            onValue(landmarkRef, (snapshot) => {
                if (snapshot.exists()) {
                    landmarkData = snapshot.val();
                    loading = false;
                    if (landmarkData.latitude && landmarkData.longitude) {
                        fetchWeather(landmarkData.latitude, landmarkData.longitude);
                    }
                    setTimeout(initMaps, 0); // Ensures map containers are available
                } else {
                    error = "Landmark not found.";
                    loading = false;
                }
            }, {
                onlyOnce: true
            });
        } else {
            error = 'All parameters (userId, categoryId, and landmarkId) must be provided.';
            loading = false;
        }
    });

    function initMaps() {
        if (landmarkData.latitude && landmarkData.longitude) {
            const coordinates = [landmarkData.latitude, landmarkData.longitude];
            createMap(mapContainer1, coordinates, 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', '© OpenStreetMap contributors');
            createMap(mapContainer2, coordinates, 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 'Map data © OpenTopoMap contributors');
            createMap(mapContainer3, coordinates, 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 'Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community');
        }
    }

    function createMap(container, coordinates, tilesURL, attribution) {
        if (container) {
            const map = L.map(container).setView(coordinates, 13);
            L.tileLayer(tilesURL, { attribution }).addTo(map);
            L.marker(coordinates).addTo(map);
        }
    }

    async function fetchWeather(lat, lon) {
        try {
            const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
            if (response.ok) {
                weatherData = await response.json();
            } else {
                throw new Error("Failed to fetch weather data.");
            }
        } catch (err) {
            error = err.message;
        }
    }
    let selectedImage = writable(null);

function openModal(imageUrl) {
    selectedImage.set(imageUrl);
}

function closeModal() {
    selectedImage.set(null);
}
</script>

<style>
    .main {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        background: linear-gradient(-45deg, #4eb99f, #122f41, #ed563b, #f2b035);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
        color: white;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
    }

    .map-container {
        height: 300px;
    }

    .details-container {
        display: flex;
        width: 100%;
        max-width: 1200px;
        margin-bottom: 20px;
    }

    .text-section {
        flex: 1;
        padding: 20px;
        background-color: rgba(0, 0, 0, 0.5); 
        border-radius: 8px;
    }

    .map-section {
        flex: 2;
        display: flex;
        flex-direction: column;
    }

    .single-map {
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); 
        border-radius: 8px;
        padding: 10px;
    }
    .gallery-image {
        cursor: pointer;
        transition: transform 0.2s;
    }
    .gallery-image:hover {
        transform: scale(1.05);
    }
    .modal-background {
        background-color: rgba(10, 10, 10, 0.86); /* Dark semi-transparent background */
        z-index: 2000;
    }
    .modal {
        z-index: 2000;
    }
    .modal-content {
        z-index: 2001;
        max-width: 80%; 
        width: auto; 
        margin: auto; 
        padding: 20px; 
    }
    .modal-content img {
        width: 100%; 
        height: auto;   
        max-height: 80vh; 
    }
    .modal-close {
        z-index: 2002;
    }
</style>
<section class="main">
{#if loading}
    <p>Loading...</p>
{:else if error}
    <p>{error}</p>
{:else if landmarkData}
<h1 class="is-size-1">Location Details</h1>
    <div class="details-container">
        <div class="text-section">
            <h1 class="is-size-3">{landmarkData.name || 'No Name Provided'}</h1>
            <p>{landmarkData.description || 'No description available'}</p>
            {#if weatherData}
                <div>
                    <h2 class="is-size-3">Weather Details</h2>
                    <p>Temperature: {weatherData.main.temp} °C</p>
                    <p>Weather: {weatherData.weather[0].description}</p>
                    <p>Humidity: {weatherData.main.humidity}%</p>
                    <p>Wind Speed: {weatherData.wind.speed} m/s</p>
                </div>
            {/if}
        </div>
        <div class="map-section">
            <div class="single-map"><div bind:this={mapContainer3} class="map-container"></div></div>
            <div class="single-map"><div bind:this={mapContainer2} class="map-container"></div></div>
        </div>
    </div>
    <h1 class="is-size-1">Gallery</h1>
    <div class="columns is-multiline">
        {#if landmarkData.imageUrls && landmarkData.imageUrls.length > 0}
            {#each landmarkData.imageUrls as imageUrl}
                <div class="column is-one-quarter">
                    <img class="gallery-image" src={imageUrl} alt="Gallery image" on:click={() => openModal(imageUrl)} />
                </div>
            {/each}
        {:else}
            <p>No images available.</p>
        {/if}
    </div>
    
    {#if $selectedImage}
        <div class="modal is-active">
            <div class="modal-background" on:click={closeModal}></div>
            <div class="modal-content">
                <p class="image">
                    <img src={$selectedImage} alt="Selected image">
                </p>
            </div>
            <button class="modal-close is-large" aria-label="close" on:click={closeModal}></button>
        </div>
    {/if}
    <div class="single-map">
        <div bind:this={mapContainer1} class="map-container"></div>
    </div>

{:else}
    <p>Landmark details could not be loaded. Please check the ID or data source.</p>
{/if}
</section>