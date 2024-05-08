<script>
    import { Router, Route, Link } from 'svelte-routing';
    import Home from './views/Home.svelte';
    import Signup from './views/Signup.svelte';
    import SignIn from './views/SignIn.svelte';
    import Main from './views/Main.svelte';
    import AddLandmark from './views/LandmarkCategory.svelte';
    import CategoryLandmark from './views/CategoryLandmark.svelte';
    import { user } from './stores/authStore';
    import { onMount } from 'svelte';
    import { logoutUser } from './models/authModel.js';
    import { navigate } from 'svelte-routing';

    const logoUrl = '/assets/logo.png'; 

    let isAuthenticated = false;
    $: user.subscribe(value => {
        isAuthenticated = !!value;
    });

    function requireAuth(details) {
        if (!isAuthenticated) {
            details.redirect('/signin');
        }
    }

    async function handleLogout() {
        try {
            await logoutUser();
            user.set(null);
            navigate('/signin'); 
        } catch (error) {
            console.error("Failed to logout", error);
        }
    }
</script>

<!-- Import Bulma in the <style> tag or via an external CSS file -->
<style>
    .navbar-logo {
        width: 150px; /* Adjust logo size as required */
    }
</style>

<Router>
    <!-- Navigation bar -->
    <nav class="navbar is-light">
        <div class="navbar-brand">
            <img class="navbar-logo" src="/path/to/logo.png" alt="Logo">
        </div>
        <div class="navbar-menu">
            <div class="navbar-end">
                {#if $user}
                    <Link to="/manage-categories" class="navbar-item">Manage Categories</Link>
                    <button class="button is-light" on:click={handleLogout}>Logout</button>
                {:else}
                    <Link to="/signup" class="navbar-item">Sign Up</Link>
                    <Link to="/signin" class="navbar-item">Sign In</Link>
                {/if}
            </div>
        </div>
    </nav>

    <!-- Define routes here -->
    <Route path="/" component={Main} />
    <Route path="/home" component={Home} onEnter={requireAuth} />
    <Route path="/signup" component={Signup} />
    <Route path="/signin" component={SignIn} />
    <Route path="/add-landmark" component={AddLandmark} />
    <Route path="/category-landmark" component={CategoryLandmark} />
</Router>

