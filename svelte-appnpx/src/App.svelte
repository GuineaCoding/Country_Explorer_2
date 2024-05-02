<!-- src/App.svelte -->
<script>
	import { Router, Route, Link } from 'svelte-routing';
	import Home from './views/Home.svelte';
	import Signup from './views/Signup.svelte';
	import SignIn from './views/SignIn.svelte';
</script>

<Router>
	<nav>
		<Link to="/">Home</Link>
		<Link to="/signup">Signup</Link>
		<Link to="/signin">Sign In</Link>
	</nav>
	<Route path="/" component={Home} />
	<Route path="/signup" component={Signup} />
	<Route path="/signin" component={SignIn} />
</Router>
