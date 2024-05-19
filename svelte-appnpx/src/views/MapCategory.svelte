<script>
    import { onMount } from 'svelte';
    import L from 'leaflet';
    import { db } from '../services/firebase.js';
    import Sidebar from './assets/SidebarCategory.svelte';
    import Footer from './assets/Footer.svelte';
    import { ref, onValue } from "firebase/database";

    let map;

    onMount(() => {
        initMap();
    });

    function initMap() {
        // Initialize the map
        map = L.map('map1').setView([0, 0], 3); 
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        // Subscribe to changes from Firebase to update the map with placemarks
        const catRef = ref(db, 'users');
        onValue(catRef, (snapshot) => {
            const data = snapshot.val();
            updateMapWithPlacemarks(data);
        });
    }

    function updateMapWithPlacemarks(data) {
        // Assuming data is structured to allow iterating over placemarks
        Object.values(data).forEach(user => {
            if (user.categories) {
                Object.values(user.categories).forEach(category => {
                    if (category.landmarks) {
                        Object.values(category.landmarks).forEach(landmark => {
                            if (!landmark.isPrivate && landmark.latitude && landmark.longitude) {
                                L.marker([landmark.latitude, landmark.longitude])
                                    .addTo(map)
                                    .bindPopup(landmark.name);
                            }
                        });
                    }
                });
            }
        });
    }
</script>

<style>
    @import "leaflet/dist/leaflet.css";

    .container {
        display: flex;
        height: 100vh;
    }

    .main {
        display: flex;
        height: 100vh;
        background: linear-gradient(-45deg, #4eb99f, #122f41, #ed563b, #f2b035);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
        max-width: 100% !important;
    }

    .map-container {
        height: 100%;
        width: 80%;
    }
</style>

<div class="container main">
    <div class="menu category-list" style="width: 20%;"><Sidebar /></div>
    
    <div id="map1" class="map-container" style="width: 80%;"></div>
</div>
<Footer />
