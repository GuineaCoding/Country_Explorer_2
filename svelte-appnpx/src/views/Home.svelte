<script>
    import { onMount } from 'svelte';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import { getDatabase, ref, get } from 'firebase/database';
    import { navigate } from 'svelte-routing';
    import L from 'leaflet';
    import 'leaflet/dist/leaflet.css';
    import Footer from "./assets/Footer.svelte";

    let map;
    let landmarks = [];
    let landmarkCount = 0;
    let latestLogin = '';

    onMount(() => {
        const auth = getAuth();
        const db = getDatabase();

    
        onAuthStateChanged(auth, user => {
            if (user) {
                fetchLandmarks(db, user.uid);
                latestLogin = 'Last login: ' + new Date(user.metadata.lastSignInTime).toLocaleString();
            } else {
                console.log('No user is logged in.');
                navigate('/signin');
            }
        });

       
        map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);
    });

    async function fetchLandmarks(db, userId) {
        const categoriesRef = ref(db, `users/${userId}/categories`);
        const snapshot = await get(categoriesRef);

        if (snapshot.exists()) {
            const categories = snapshot.val();
            landmarks = [];
            Object.keys(categories).forEach(categoryId => {
                const categoryLandmarks = categories[categoryId].landmarks || {};
                Object.values(categoryLandmarks).forEach(landmark => {
                    landmarks.push(landmark);
                    L.marker([landmark.latitude, landmark.longitude])
                        .addTo(map)
                        .bindPopup(landmark.name);
                });
            });
            landmarkCount = landmarks.length;
            if (landmarks.length > 0) {
                map.setView([landmarks[0].latitude, landmarks[0].longitude], 10);
            }
        } else {
            console.log('No categories found for user ID ' + userId);
        }
    }
</script>

<style>
    main {
        display: flex;
        flex-direction: column;
        align-items: center;
        min-height: 100vh;
        background: linear-gradient(-45deg, #4eb99f, #122f41, #ed563b, #f2b035);
        background-size: 400% 400%;
        animation: gradient 15s ease infinite;
        color: white;
        padding: 20px; 
        font-size: 18px; 
    }

    #map {
        height: 300px;
        width: 100%;
        margin: 8px;
    }

    section {
        width: 100%; 
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px; 
    }

    @keyframes moveNeon {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    .neonBox {
        padding: 0px -1px;
        margin: 10px;
        border-radius: 15px; 
        background: linear-gradient(270deg, rgba(85, 255, 225, 0.8), rgba(73, 77, 139, 0.8), rgba(255, 255, 85, 0.8));
        background-size: 400% 400%;
        animation: moveNeon 8s ease infinite; 
        color: white;
        font-size: 16px;
        border: none;
    }


    .column {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 300px;
    }

    .buttonHome {
        padding: 12px 24px; 
        background-color: #32a852; 
        color: white;
        border: none;
        cursor: pointer;
        transition: background-color 0.3s; 
        font-size: 16px;
    }

    .buttonHome:hover {
        background-color: #278a40 !important; 
    }

</style>

<main>
    <h1>Welcome to Country Explorer 2</h1>
    <section>
        <div class="column" id="map"></div>
        <div class="column neonBox">
            <h2>Total Landmarks: {landmarkCount}</h2>
        </div>
    </section>
    <section>
        <div class="column neonBox">
            <p>{latestLogin}</p>
        </div>
        <div class="column neonBox">
            <button class="buttonHome" on:click={() => navigate('/map-category')}>Explore Landmarks</button>
        </div>
    </section>
</main>
<Footer />