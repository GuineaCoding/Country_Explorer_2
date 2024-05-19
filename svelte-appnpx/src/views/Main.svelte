<script>
  import { onMount } from 'svelte';
  import Footer from './assets/Footer.svelte';

  let slideIndex = 0;

  // Slideshow functionality
  function showSlides() {
    const slides = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
    slideIndex++;
    if (slideIndex > slides.length) { slideIndex = 1; }
    slides[slideIndex - 1].style.display = "block";
    setTimeout(showSlides, 3000); 
  }

  onMount(() => {
    showSlides();
  });
</script>

<style>
  .hero {
    background-color: #4eb99f; /* Light green */
    color: white;
  }

  @keyframes gradient {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }

  .gradient {
    display: flex;
    flex-direction: column;
    overflow: auto;
    min-height: 100vh;
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(-45deg, #4eb99f, #122f41, #ed563b, #f2b035);
    background-size: 400% 400%;
    animation: gradient 15s ease infinite;
  }

  .about-section {
    background-color: #122f41; /* Dark blue */
    color: white;
    padding: 3rem 1.5rem;
  }

  .more-about-section {
    background-color: #ed563b; /* Bright red */
    color: white;
    padding: 3rem 1.5rem;
  }

  .footer {
    background-color: #f2b035; /* Mustard yellow */
    color: white;
    padding: 1.5rem;
  }

  .slide img {
    width: 100%;
    border-radius: 8px;
  }

  /* New styles for the hero section content */
  .hero-paragraph {
    margin: 1rem auto;
    max-width: 800px;
    font-size: 1.2rem;
    line-height: 1.6;
  }

  .container.has-text-centered h1, .container.has-text-centered h2 {
    margin-bottom: 1.5rem;
  }
  .padding-style {
    padding: 20px !important;
  }
</style>

<!-- Slideshow Section -->
<section class="section gradient">
  <h1 class="title has-text-white">Country Explorer</h1>
  <div class="container">
    <div class="columns">
      <div class="column is-12">
        <div class="slide">
          <img src="https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Slide 1">
        </div>
        <div class="slide">
          <img src="https://images.pexels.com/photos/21014/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Slide 2">
        </div>
        <div class="slide">
          <img src="https://images.pexels.com/photos/2859169/pexels-photo-2859169.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="Slide 3">
        </div>
      </div>
    </div>
  </div>
</section>

<!-- Hero Section -->
<section class="hero is-medium">
  <div class="hero-body padding-style">
    <div class="container has-text-centered">
      <h1 class="title has-text-white">Discover New Placemarks</h1>
      <h2 class="subtitle">Explore, share, and mark your favorite locations.</h2>
      <p class="hero-paragraph">
        Ready to uncover the hidden gems of the world? Our platform empowers you to capture the beauty of the world through your lens.
        Upload photos, add precise geographic coordinates, and share those memorable spots on an interactive map.
      </p>
      <p class="hero-paragraph">
        Whether it's a scenic lookout, a tranquil lakeside retreat, or an exciting urban destination, you can easily mark your favorite 
        locations and revisit them anytime. Leave footprints across continents or find inspiration for your next journey.
      </p>
      <p class="hero-paragraph">
        Join a thriving community of explorers, travelers, and adventurers who are passionate about showcasing the world's wonders. 
        Connect with like-minded individuals, exchange travel tips, and build a network of fellow wanderers.
      </p>
      <p class="hero-paragraph">
        Wherever your journey takes you, let <strong>Discover New Placemarks</strong> be your gateway to new adventures and lifelong memories.
        Start sharing your journey today!
      </p>
    </div>
  </div>
</section>  




<!-- About Section -->
<section class="about-section">
  <div class="container">
    <h2 class="title has-text-centered has-text-white">About Placemarks</h2>
    <div class="content has-text-centered">
      Placemarks is an innovative platform to explore, share, and create placemarks. Connect with travelers, adventure seekers, and explorers like you.
    </div>
  </div>
</section>

<!-- More About Us Section -->
<section class="more-about-section">
  <div class="container">
    <h2 class="title has-text-centered has-text-white">More About Us</h2>
    <div class="columns">
      <div class="column">
        <h3 class="subtitle">Our Vision</h3>
        <p>To connect the world through a shared love of exploration and travel.</p>
      </div>
      <div class="column">
        <h3 class="subtitle">Our Mission</h3>
        <p>To provide a platform where adventurers can share their discoveries and find new ones.</p>
      </div>
      <div class="column">
        <h3 class="subtitle">Get Involved</h3>
        <p>Join our community, contribute, and help shape the future of Placemarks.</p>
      </div>
    </div>
  </div>
</section>

  <Footer /> 
