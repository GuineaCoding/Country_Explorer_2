<script>
    import { Router, Route, Link } from 'svelte-routing';
    import Home from './views/Home.svelte';
    import LandMark from './views/LandMark.svelte';
</script>

<Router>
    <nav>
        <Link to="/">Home</Link>
        <Link to="/landmark">Landmark</Link>
        // other navigation links
    </nav>
    <Route path="/" component={Home} />
    <Route path="/landmark" component={LandMark} />
    // other routes
</Router>
