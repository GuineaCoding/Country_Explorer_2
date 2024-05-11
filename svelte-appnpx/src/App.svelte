<script>
    import { Router, Route, Link } from 'svelte-routing';
    import Home from './views/Home.svelte';
    import Signup from './views/Signup.svelte';
    import SignIn from './views/SignIn.svelte';
    import Main from './views/Main.svelte';
    import LandmarkCategory from './views/LandmarkCategory.svelte';
    import Category from './views/Category.svelte';
    import LandmarkDetail from './views/LandmarkDetail.svelte'; 
    import { user } from './stores/authStore';
    import { logoutUser } from './models/authModel.js';
    import { navigate } from 'svelte-routing';

    const logoUrl = '/assets/logo.png'; 

    let isAuthenticated = false;
    $: user.subscribe(value => {
        isAuthenticated = !!value;
    });

    function requireAuth(details) {
        if (!isAuthenticated) {
            navigate('/signin');
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

<Router>
    <!-- Navigation bar -->
    <nav class="navbar is-light">
        <div class="navbar-brand">
            <img class="navbar-logo" src="/path/to/logo.png" alt="Logo">
        </div>
        <div class="navbar-menu">
            <div class="navbar-end">
                {#if $user}
                    <Link to="/category" class="navbar-item">Manage Categories</Link>
                    <button class="button is-light" on:click={handleLogout}>Logout</button>
                {:else}
                    <Link to="/signup" class="navbar-item">Sign Up</Link>
                    <Link to="/signin" class="navbar-item">Sign In</Link>
                {/if}
            </div>
        </div>
    </nav>

    <!-- Define routes here -->

        <!-- Define routes here -->
        <Route path="/" component={Main} />
        <Route path="/home" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/signin" component={SignIn} />
        <Route path="/category" component={Category} />
        <Route path="/landmark-category/:categoryId" component={LandmarkCategory} />
        <Route path="/landmark/:categoryId/:landmarkId" component={LandmarkDetail} />
</Router>
