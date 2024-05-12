<script>
    import { onMount } from 'svelte';
    import { ref, onValue, update } from 'firebase/database';
    import { db } from '../services/firebase';
    import { getAuth, onAuthStateChanged } from 'firebase/auth';
    import Footer from './assets/Footer.svelte';

    let userData = null;
    let userId = null;
    let firstName = '';
    let lastName = '';

    onMount(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, user => {
        if (user) {
          userId = user.uid;
          fetchUserData();
        } else {
          console.log("No user is signed in.");
          userData = null;
        }
      });
    });

    function fetchUserData() {
      const userRef = ref(db, 'users/' + userId);
      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          userData = snapshot.val();
          firstName = userData.firstName || '';
          lastName = userData.lastName || '';
        } else {
          console.log("No data available for user", userId);
          userData = null;
        }
      }, {
        onlyOnce: true
      });
    }

    async function updateUserProfile(event) {
  event.preventDefault();
  if (userId) {
    const updates = {
      firstName,
      lastName
    };
    try {
      await update(ref(db, 'users/' + userId), updates);
      console.log('Profile updated successfully.');
      fetchUserData(); 
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  }
}
</script>

<style>
    main {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      background: linear-gradient(-45deg, #4eb99f, #122f41, #ed563b, #f2b035);
      background-size: 400% 400%;
      animation: gradient 15s ease infinite;
      color: white;
      padding: 20px;
    }
  
    .user-info, .edit-form {
      margin: 20px;
      padding: 20px;
      border: 1px solid rgba(255, 255, 255, 0.2); 
      border-radius: 8px;
      background-color: rgba(0, 0, 0, 0.5); 
      width: 80%; 
      max-width: 500px; 
    }
  
    .edit-form input, .edit-form button {
      width: 100%;
      padding: 8px;
      margin-bottom: 10px;
      border-radius: 4px;
      border: none;
    }
  
    .edit-form button {
      background-color: #f2b035; /* Button color */
      color: white;
      cursor: pointer;
      font-size: 1rem;
      transition: background-color 0.2s ease;
    }
  
    .edit-form button:hover {
      background-color: #ed563b; /* Button hover effect */
    }
  
    label {
      display: block;
      margin-bottom: 5px;
    }
  
    @keyframes gradient {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  </style>
  
  <main>
    {#if userData}
      <div class="user-info">
        <h1>User Profile</h1>
        <p ><strong class="has-text-white">First Name:</strong> {userData.firstName}</p>
        <p><strong class="has-text-white">Last Name:</strong> {userData.lastName}</p>
        <p><strong class="has-text-white">Email:</strong> {userData.email}</p>
      </div>
  
      <form class="edit-form" on:submit={updateUserProfile}>
        <h2>Edit Profile (Only alphabetic letters)</h2>
        <label>
          First Name:
          <input type="text" bind:value={firstName} required pattern="[A-Za-z]+">
        </label>
        <label>
          Last Name:
          <input type="text" bind:value={lastName} required pattern="[A-Za-z]+">
        </label>
        <button type="submit">Save Changes</button>
      </form>
    {:else}
      <p>Loading user data...</p>
    {/if}
  </main>
  <Footer />