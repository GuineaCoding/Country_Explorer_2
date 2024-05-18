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
    import UserDetails from './views/UserDetails.svelte';
    import MapCategory from './views/MapCategory.svelte';
    import LandmarkOverview from './views/LandmarkOverview.svelte';
    import { user } from './stores/authStore';
    import { logoutUser } from './models/authModel.js';

    const logoUrl = './logo.svg';

    let currentUser;
    user.subscribe(value => {
        currentUser = value;
        // Redirect from Login/Signup if already logged in
        if (currentUser && (location.pathname === '/signin' || location.pathname === '/signup')) {
            navigate('/home');
        }
    });

    function redirectToHomeIfLoggedIn() {
        if (currentUser) {
            navigate('/home');
        }
    }

    function requireAuth(next) {
        if (!currentUser) {
            navigate('/signin');
        } else {
            next();
        }
    }

    function handleLogout(event) {
        event.preventDefault(); 
        logoutUser();
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
    <Route path="/signup" component={Signup} onEnter={redirectToHomeIfLoggedIn} />
    <Route path="/signin" component={SignIn} onEnter={redirectToHomeIfLoggedIn} />
    <Route path="/category" component={Category} onEnter={requireAuth} />
    <Route path="/landmark-category/:categoryId/:categoryName" component={LandmarkCategory} onEnter={requireAuth} />
    <Route path="/landmark/:categoryId/:landmarkId" component={LandmarkDetail} onEnter={requireAuth} />
    <Route path="/profile" component={UserProfile} onEnter={requireAuth} />
    <Route path="/password-reset" component={PasswordReset} onEnter={requireAuth} />
    <Route path="/admin" component={AdminPanel} onEnter={requireAuth} />
    <Route path="/user-details/:key" component={UserDetails} onEnter={requireAuth} />
    <Route path="/map-category" component={MapCategory} onEnter={requireAuth} />
    <Route path="/landmark-overview/:userId/:categoryId/:landmarkId" component={LandmarkOverview} onEnter={requireAuth} />
</Router>
