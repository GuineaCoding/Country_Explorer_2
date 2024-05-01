<!-- src/App.svelte -->
<script>
	import { Router, Route, Link } from 'svelte-routing';
	import Signup from './views/Signup.svelte';
	import Home from './views/Home.svelte';
  </script>
  
  <Router>
	<nav>
	  <Link to="/">Home</Link>
	  <Link to="/signup">Signup</Link>
	</nav>
	<Route path="/" component={Home} />
	<Route path="/signup" component={Signup} />
  </Router>
  