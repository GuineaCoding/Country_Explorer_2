<script>
    import { Router, Route, Link, navigate } from 'svelte-routing';
    import Home from './views/Home.svelte';
    import Signup from './views/Signup.svelte';
    import SignIn from './views/SignIn.svelte';
    import Main from './views/Main.svelte';
    import LandmarkCategory from './views/LandmarkCategory.svelte';
    import Category from './views/Category.svelte';
    import LandmarkDetail from './views/LandmarkDetail.svelte';
    import UserProfile from './views/UserProfile.svelte';
    import PasswordReset from './views/PasswordReset.svelte';
    import AdminPanel from './views/AdminPanel.svelte';
    import { user } from './stores/authStore';
    import { logoutUser } from './models/authModel.js';
    import UserDetails from './views/UserDetails.svelte';
    import MapCategory from './views/MapCategory.svelte';
    
    const logoUrl = './logo.svg'; 

    // This subscription now holds the complete user object
    let currentUser;
    user.subscribe(value => {
        currentUser = value;
    });

    // Protect routes that require admin access
    function requireAuth() {
        if (!currentUser || currentUser.userType !== 'admin') {
            console.log("Access denied. Redirecting to sign-in.");
            navigate('/signin');
        } else {
            console.log("Access granted to admin panel.");
        }
    }

    // Handle logout
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
                {#if currentUser}
                    <Link to="/category" class="navbar-link">Manage Categories</Link>
                    <Link to="/profile" class="navbar-link">Profile</Link>
                    {#if currentUser.userType === 'admin'}
                        <Link to="/admin" class="navbar-link">Admin Panel</Link>
                    {/if}
                    <a href="javascript:void(0);" class="logout-link" on:click={handleLogout}>Logout</a>
                {:else}
                    <Link to="/signup" class="navbar-link">Sign Up</Link>
                    <Link to="/signin" class="navbar-link">Sign In</Link>
                {/if}
            </div>
        </div>
    </nav>

    <Route path="/" component={Main} />
    <Route path="/home" component={Home} />
    <Route path="/signup" component={Signup} />
    <Route path="/signin" component={SignIn} />
    <Route path="/category" component={Category} />
    <Route path="/landmark-category/:categoryId/:categoryName" component={LandmarkCategory} />
    <Route path="/landmark/:categoryId/:landmarkId" component={LandmarkDetail} />
    <Route path="/profile" component={UserProfile} onEnter={requireAuth} />
    <Route path="/password-reset" component={PasswordReset} />
    <Route path="/admin" component={AdminPanel} onEnter={requireAuth} />
    <Route path="/user-details/:key" component={UserDetails} />
    <Route path="/map-category" component={MapCategory} />
</Router>
