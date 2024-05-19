<script>
    import { onMount } from 'svelte';
    import { ref, get } from 'firebase/database';
    import { db } from '../services/firebase';
    import { navigate } from 'svelte-routing';
    import Footer from './assets/Footer.svelte';
    export let key; 

    let user = null;
    let logins = [];

    onMount(async () => {
        const userRef = ref(db, `users/${key}`);
        const snapshot = await get(userRef);
        if (snapshot.exists()) {
            user = snapshot.val();
            if (user.analytics && user.analytics.logins) {
                logins = Object.entries(user.analytics.logins).map(([id, login]) => ({
                    id,
                    date: formatDate(login.date),
                    device: parseBrowser(login.device),
                    ip: login.ip
                }));
            }
        } else {
            console.error("User not found");
        }
    });

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    }

    function parseBrowser(userAgentString) {
        if (/chrome|chromium|crios/i.test(userAgentString)) {
            return 'Chrome';
        } else if (/firefox|fxios/i.test(userAgentString)) {
            return 'Firefox';
        } else if (/safari/i.test(userAgentString)) {
            return 'Safari';
        } else if (/edg/i.test(userAgentString)) {
            return 'Edge';
        } else {
            return 'Other';
        }
    }

    function goBack() {
        navigate('/admin');
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
        padding: 20px;
        color: white;
        text-align: center;
    }

    ul {
        list-style: none;
        padding: 0;
    }

    li {
        background-color: rgba(0, 0, 0, 0.5);
        padding: 10px;
        border-radius: 4px;
        margin-bottom: 5px;
    }

    button {
        background-color: #f2b035;
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        cursor: pointer;
        transition: background-color 0.2s;
    }

    button:hover {
        background-color: #ed563b;
    }
</style>

<main>
    <h1>User Details</h1>
    {#if user}
        <p>Email: {user.email || 'No email registered'}</p>
        <p>Name: {`${user.firstName || ''} ${user.lastName || ''}`.trim() || 'No name provided'}</p>
        <h2>Login Activity</h2>
        <ul>
            {#each logins as login}
                <li>{login.date} - {login.device} at {login.ip}</li>
            {/each}
        </ul>
        <button on:click={goBack}>Back</button>
    {:else}
        <p>User data not found.</p>
    {/if}
</main>
<Footer />