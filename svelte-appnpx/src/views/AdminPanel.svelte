<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { db } from '../services/firebase';
    import { ref, get } from 'firebase/database';

    let users = [];

    onMount(async () => {
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        if (snapshot.exists()) {
            users = Object.entries(snapshot.val()).map(([key, value]) => ({
                id: key,
                email: value.email,
                loginCount: value.loginCount,
                detailsPage: `/user-details/${key}`
            }));
        }
    });

    function goToUserPage(page) {
        navigate(page);
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
    }

    table {
        width: 90%;
        margin-top: 20px;
        background-color: rgba(255, 255, 255, 0.1); 
        border-radius: 8px;
        overflow: hidden;
    }
    th, td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid rgba(255, 255, 255, 0.25);
    }
    th {
        background-color: rgba(0, 0, 0, 0.3);
    }
    tr:last-child td {
        border-bottom: none;
    }
    button {
        cursor: pointer;
        background-color: #f2b035; 
        color: white;
        border: none;
        padding: 10px 20px;
        border-radius: 4px;
        transition: background-color 0.2s ease;
        margin-top: 5px;
    }
    button:hover {
        background-color: #ed563b;
    }
</style>

<main>
    <h1>Admin Panel</h1>
    <table>
        <thead>
            <tr>
                <th>Email</th>
                <th>Login Count</th>
                <th>Action</th>
            </tr>
        </thead>
        <tbody>
            {#each users as user}
                <tr>
                    <td>{user.email}</td>
                    <td>{user.loginCount}</td>
                    <td><button on:click={() => goToUserPage(user.detailsPage)}>View Details</button></td>
                </tr>
            {/each}
        </tbody>
    </table>
</main>
