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
    import LandmarkCategory from './views/LandmarkCategory.svelte';

    let isAuthenticated = false;
    $: user.subscribe(value => {
        isAuthenticated = !!value;
    });

    function requireAuth(details) {
        if (!isAuthenticated) {
            details.redirect('/signin');
        }
    }
</script>

<Router>
    <nav>
        <Link to="/">Main</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/signin">Sign In</Link>
        <Link to="/category-landmark">Manage Categories</Link>  // Add link to the new Category page
    </nav>
    <Route path="/" component={Main} />
    <Route path="/home" component={Home} onEnter={requireAuth} />
    <Route path="/signup" component={Signup} />
    <Route path="/signin" component={SignIn} />
    <Route path="/add-landmark" component={AddLandmark} />
    <Route path="/category-landmark" component={CategoryLandmark} />  
    <Route path="/landmark-category/:categoryId" component={LandmarkCategory} />
</Router>
