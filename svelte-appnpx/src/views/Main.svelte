<script>
    import { onMount } from 'svelte';
    let slideIndex = 0;
  
    // A simple slideshow script
    function showSlides() {
      const slides = document.getElementsByClassName("slide");
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slideIndex++;
      if (slideIndex > slides.length) { slideIndex = 1; }
      slides[slideIndex - 1].style.display = "block";
      setTimeout(showSlides, 3000); // Change image every 3 seconds
    }
  
    // Start the slideshow on component mount
    onMount(() => {
      showSlides();
    });
  </script>
  
  <style>
    /* Example Bulma custom styles */
    .hero {
      background-color: #4a4e69;
      color: white;
    }
  
    .about-section, .more-about-section, .footer {
      background-color: #9a8c98;
      color: white;
      padding: 3rem 1.5rem;
    }
  
    .slide img {
      width: 100%;
      border-radius: 8px;
    }
  
    .footer {
      background-color: #22223b;
    }
  </style>
  
  <!-- Layout Begins -->
  
  <!-- Navbar -->
  <nav class="navbar is-dark">
    <div class="navbar-brand">
      <a class="navbar-item">Placemarks</a>
      <a role="button" class="navbar-burger">
        <span></span>
        <span></span>
        <span></span>
      </a>
    </div>
  
    <div class="navbar-menu">
      <div class="navbar-end">
        <a class="navbar-item">Home</a>
        <a class="navbar-item">About</a>
        <a class="navbar-item">Services</a>
        <a class="navbar-item">Contact</a>
      </div>
    </div>
  </nav>
  
  <!-- Hero Section -->
  <section class="hero is-medium">
    <div class="hero-body">
      <div class="container has-text-centered">
        <h1 class="title">Discover New Placemarks</h1>
        <h2 class="subtitle">Explore, share, and mark your favorite locations.</h2>
      </div>
    </div>
  </section>
  
  <!-- Slideshow Section -->
  <section class="section">
    <div class="container">
      <div class="columns">
        <div class="column is-12 ">
          <div class="slide">
            <img src="https://via.placeholder.com/800x400?text=First+Slide" alt="Slide 1">
          </div>
          <div class="slide">
            <img src="https://via.placeholder.com/800x400?text=Second+Slide" alt="Slide 2">
          </div>
          <div class="slide">
            <img src="https://via.placeholder.com/800x400?text=Third+Slide" alt="Slide 3">
          </div>
        </div>
      </div>
    </div>
  </section>
  
  <!-- About Section -->
  <section class="about-section">
    <div class="container">
      <h2 class="title has-text-centered">About Placemarks</h2>
      <div class="content has-text-centered">
        Placemarks is an innovative platform to explore, share, and create placemarks. Connect with travelers, adventure seekers, and explorers like you.
      </div>
    </div>
  </section>
  
  <!-- More About Us Section -->
  <section class="more-about-section">
    <div class="container">
      <h2 class="title has-text-centered">More About Us</h2>
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
  
  <!-- Footer -->
  <footer class="footer">
    <div class="content has-text-centered">
      <p>&copy; 2024 Placemarks. All rights reserved.</p>
      <div>
        <a href="#">Privacy</a> | <a href="#">Terms</a> | <a href="#">Contact Us</a>
      </div>
    </div>
  </footer>
  