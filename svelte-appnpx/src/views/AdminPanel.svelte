<script>
    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { db } from '../services/firebase';
    import { ref, get, child } from 'firebase/database';

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
    table {
        width: 100%;
        border-collapse: collapse;
    }
    th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
    }
    th {
        background-color: #eee;
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
