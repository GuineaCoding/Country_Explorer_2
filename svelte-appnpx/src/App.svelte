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
    import UserProfile from './views/UserProfile.svelte';
    import PasswordReset from './views/PasswordReset.svelte';
    

    const logoUrl = './logo.svg'; 

    let isAuthenticated = false;
    $: user.subscribe(value => {
        isAuthenticated = !!value;
    });

    function requireAuth(details) {
        if (!isAuthenticated) {
            navigate('/signin');
        }
    }

    async function handleLogout(event) {
        event.preventDefault(); 
        await logoutUser();
        user.set(null);
        navigate('/signin'); 
    }
    
</script>

<style>
.navbar {
    background-color: #122f41; 
    padding: 1rem;
}

.navbar-logo {
    height: 50px;
    margin-right: 1rem;
}

.navbar-menu {
    display: flex;
    align-items: center;
}

.navbar-link, .logout-link {
    color: white;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 4px;
    transition: background-color 0.2s;
}

.navbar-link:hover, .logout-link:hover {
    background-color: #f2b035;
}

.navbar-burger {
    background: none;
    border: none;
    color: white;
    cursor: pointer;
}
</style>

<Router>
    <!-- Navigation bar -->
    <nav class="navbar">
        <div class="navbar-brand">
            <img class="navbar-logo" src={logoUrl} alt="Logo">
            <button class="navbar-burger" aria-label="menu">
                <span style="background-color: white;"></span>
                <span style="background-color: white;"></span>
                <span style="background-color: white;"></span>
            </button>
        </div>
        <div class="navbar-menu">
            <div class="navbar-end">
                {#if $user}
                    <Link to="/category" class="navbar-link">Manage Categories</Link>
                    <Link to="/profile" class="navbar-link">Profile</Link>
                    <a href="javascript:void(0);" class="logout-link" on:click={handleLogout}>Logout</a>
                {:else}
                    <Link to="/signup" class="navbar-link">Sign Up</Link>
                    <Link to="/signin" class="navbar-link">Sign In</Link>
                {/if}
            </div>
        </div>
    </nav>

    <!-- Routes -->
    <Route path="/" component={Main} />
    <Route path="/home" component={Home} />
    <Route path="/signup" component={Signup} />
    <Route path="/signin" component={SignIn} />
    <Route path="/category" component={Category} />
    <Route path="/landmark-category/:categoryId" component={LandmarkCategory} />
    <Route path="/landmark/:categoryId/:landmarkId" component={LandmarkDetail} />
    <Route path="/profile" component={UserProfile} onEnter={requireAuth} />
    <Route path="/password-reset" component={PasswordReset} /> 
</Router>

