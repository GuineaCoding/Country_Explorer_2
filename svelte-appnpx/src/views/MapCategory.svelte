<script>
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import { ref, onValue } from "firebase/database";
    import { db } from '../services/firebase.js';
    import { writable } from 'svelte/store';

    let categories = writable(new Set());
    let map1, map2, map3;

    onMount(() => {
        const catRef = ref(db, 'users');
        onValue(catRef, (snapshot) => {
            const data = snapshot.val();
            let categorySet = new Set();
            for (let userId in data) {
                if (data[userId].categories) {
                    for (let categoryId in data[userId].categories) {
                        categorySet.add(data[userId].categories[categoryId].name);
                    }
                }
            }
            categories.set(categorySet);
        });

        setTimeout(() => {
            map1 = L.map('map1').setView([51.505, -0.09], 13);
            map2 = L.map('map2').setView([48.8566, 2.3522], 13); 
            map3 = L.map('map3').setView([34.0522, -118.2437], 13); 

            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map1);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map2);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(map3);
        }, 0);
    });
</script>

<style>
    @import "leaflet/dist/leaflet.css";

    .maps-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px; 
    }

    .map-container {
        height: 300px;
        width: 100%; 
        max-width: 600px;
    }

    .category-list { list-style-type: none; padding: 0; }
    .category-item { padding: 10px; border-bottom: 1px solid #ccc; }
</style>

<ul class="category-list">
    {#each Array.from($categories) as category}
        <li class="category-item">{category}</li>
    {/each}
</ul>

<div class="maps-container">
    <div id="map1" class="map-container"></div>
</div>
    <div id="map2" class="map-container">
        
    </div>

    <div class="maps-container">
    <div id="map3" class="map-container"></div>
</div>
