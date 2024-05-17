<script>
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import { ref, onValue } from "firebase/database";
    import { db } from '../services/firebase.js';
    import { writable } from 'svelte/store';
    import Footer from './assets/Footer.svelte';

    let categories = writable({});
    let activeCategory = writable(null);
    let map; 

    onMount(() => {
        const catRef = ref(db, 'users');
        onValue(catRef, (snapshot) => {
            const data = snapshot.val();
            let newCategories = {};
            for (let userId in data) {
                if (data[userId].categories) {
                    for (let categoryId in data[userId].categories) {
                        let categoryName = data[userId].categories[categoryId].name;
                        let landmarks = data[userId].categories[categoryId].landmarks || {};
                        newCategories[categoryName] = newCategories[categoryName] || [];

                        for (let landmarkId in landmarks) {
                            let landmark = landmarks[landmarkId];
                            if (!landmark.isPrivate) {
                                newCategories[categoryName].push({
                                    id: landmarkId,
                                    name: landmark.name,
                                    latitude: landmark.latitude,
                                    longitude: landmark.longitude
                                });
                            }
                        }
                    }
                }
            }
            categories.set(newCategories);
            initMap(); 
        });
    });

    function initMap() {
        map = L.map('map1').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        categories.subscribe(values => {
            Object.values(values).forEach(categories => {
                categories.forEach(landmark => {
                    if (landmark.latitude && landmark.longitude) {
                        L.marker([landmark.latitude, landmark.longitude]).addTo(map)
                          .bindPopup(landmark.name);
                    }
                });
            });
        });
    }

    function toggleCategory(categoryName) {
        activeCategory.update(current => current === categoryName ? null : categoryName);
    }
    function handleKeydown(event, categoryName) {
        if (event.key === 'Enter' || event.key === ' ') {
            toggleCategory(categoryName);
            event.preventDefault(); // Prevent the default action to avoid scrolling on space press
        }
    }
</script>

<style>
    @import "leaflet/dist/leaflet.css";

    .container {
        display: flex;
        height: 100vh;
    }

    .category-list {
        width: 20%;
        overflow-y: auto;
        padding: 0;
    }

    .map-container {
        height: 100%;
        width: 80%;
    }

    .landmarks {
        list-style-type: none;
        padding: 0;
        display: none;
    }

    .landmarks.open {
        display: block;
    }

    button {
        width: 100%;
        text-align: left;
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        cursor: pointer;
        padding: 0.75rem 1.25rem; /* Added padding for better spacing */
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    button:hover, button:focus {
        background-color: #f2f2f2;
    }

    .icon {
        margin-left: auto; /* Push the icon to the right */
    }
</style>

<div class="container">
    <aside class="menu category-list">
        <ul class="menu-list">
            {#each Object.entries($categories) as [categoryName, landmarks]}
                <li>
                    <button
                        class="category-item"
                        on:click={() => toggleCategory(categoryName)}
                        on:keydown={(event) => handleKeydown(event, categoryName)}
                    >
                        {categoryName}
                        <span class="icon">
                            {#if $activeCategory === categoryName}
                                <i class="fas fa-minus"></i> 
                            {:else}
                                <i class="fas fa-plus"></i> 
                            {/if}
                        </span>
                    </button>
                    {#if $activeCategory === categoryName}
                        <ul class="landmarks open">
                            {#each landmarks as { id, name }}
                                <li>{name}</li>
                            {/each}
                        </ul>
                    {/if}
                </li>
            {/each}
        </ul>
    </aside>

    <div id="map1" class="map-container"></div>
</div>
<Footer />