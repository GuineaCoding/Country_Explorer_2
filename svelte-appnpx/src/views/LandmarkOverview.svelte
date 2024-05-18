<script>
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import { ref, onValue } from 'firebase/database';
    import { db } from '../services/firebase.js'; 

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
            createMap(mapContainer3, coordinates, 'https://{s}.googleapis.com/vt?lyrs=s&x={x}&y={y}&z={z}', '© Google Earth');
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
</script>


<style>
    .landmark-details, .weather-details {
        padding: 20px;
        border: 1px solid #ccc;
        border-radius: 8px;
        margin: 20px;
        background-color: #f9f9f9;
    }

    img {
        width: 100%; 
        max-width: 400px; 
        margin-bottom: 10px; 
        border-radius: 4px; 
    }

    p {
        font-size: 16px; 
    }

    .map-container {
        height: 300px;
        width: 100%;
        margin-bottom: 20px;
    }
</style>

{#if loading}
    <p>Loading...</p>
{:else if error}
    <p>{error}</p>
{:else if landmarkData}
    <div class="landmark-details">
        <h1>{landmarkData.name || 'No Name Provided'}</h1>
        <p>{landmarkData.description || 'No description available'}</p>
        {#if landmarkData.imageUrls && landmarkData.imageUrls.length > 0}
            {#each landmarkData.imageUrls as imageUrl}
                <img src={imageUrl} alt="Image of landmark" />
            {/each}
        {:else}
            <p>No images available.</p>
        {/if}
        <div bind:this={mapContainer1} class="map-container"></div>
        <div bind:this={mapContainer2} class="map-container"></div>
        <div bind:this={mapContainer3} class="map-container"></div>
        {#if weatherData}
            <div class="weather-details">
                <h2>Weather Details</h2>
                <p>Temperature: {weatherData.main.temp} °C</p>
                <p>Weather: {weatherData.weather[0].description}</p>
                <p>Humidity: {weatherData.main.humidity}%</p>
                <p>Wind Speed: {weatherData.wind.speed} m/s</p>
            </div>
        {/if}
    </div>
{:else}
    <p>Landmark details could not be loaded. Please check the ID or data source.</p>
{/if}
