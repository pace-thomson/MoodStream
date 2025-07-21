<template>
  <!-- Nav Bar -->
  <nav class="navbar" v-if="currentPage !== 'landing' && currentPage !== 'login' && currentPage !== 'register'">
    <div class="navbar-left">
      <a href="/">
        <img src="./assets/images/moodstreamlogo/moodstream_logo.png" alt="Moodstream Logo" class="brand" />
      </a>
    </div>
    <div class="navbar-center">
      <button @click="currentPage = 'history'" class="nav-button">My Moods</button>
      <button @click="currentPage = 'watchlist'" class="nav-button">My Watchlist</button>
    </div>
    <div class="navbar-right">
      <button @click="currentPage = 'account'" class="nav-button account-button">Account</button>
      <button class="nav-button logout-button" @click="handleLogout">Logout</button>

    </div>
  </nav>
  <!-- Landing Page -->
  <Landing 
  v-if="currentPage === 'landing'"
  @go-to-login="currentPage = 'login'"
  @go-to-register="currentPage = 'register'"
/>
  
  <!-- Login/Register area -->
  <div v-if="currentPage === 'login' || currentPage === 'register'" id="login-register">
          
    <Login 
      v-if="currentPage === 'login'"
      v-model:current-page="currentPage"  
      v-model:current-user-id="currentUserId"
      :supabase="supabase"
    />
    
    <Register 
      v-else-if="currentPage === 'register'"
      v-model:current-page="currentPage"  
      v-model:current-user-id="currentUserId"  
      :supabase="supabase"
    />
  </div>

  <div v-else id="main-page">
    <Home 
      v-if="currentPage == 'home'"
      v-model:show-preferences-modal="showPreferencesModal" 
      :current-user-id="currentUserId"
      :supabase="supabase"
      :catalogs="userCatalogs"
      :genres="userGenres"
    />

    <Watchlist
      v-if="currentPage == 'watchlist'"
      :current-user-id="currentUserId"
      :supabase="supabase"
      :catalogs="userCatalogs"
    />

    <History
      v-if="currentPage == 'history'"
      :current-user-id="currentUserId"
      :supabase="supabase"
    />

    <Account 
      v-if="currentPage == 'account'"
      :currentPage="currentPage"
      :currentUserId="currentUserId"
      :supabase="supabase"
    />

  </div>
    
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey, getUserInfo, logout } from './supabase.js';

import Landing from './pages/Landing.vue';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import Home from './pages/Home.vue';
import Account from './pages/Account.vue';
import Watchlist from './pages/Watchlist.vue';
import History from './pages/History.vue';



// --- State Management ---
let currentPage = ref('landing'); // Default to 'landing' page
const showPreferencesModal = ref(false);

// -- Ref variables --
const currentUserId = ref(null);
const userCatalogs = ref([]);
const userGenres = ref([]);
const userWatchlist = ref([]); // uses the Imdb Id that was added in the  '+' button on the title card
const userMoodHistory = ref([]);

const supabase = ref(createClient(supabaseUrl, supabaseAnonKey));

onMounted(async () => {
  const { data: { session } } = await supabase.value.auth.getSession();


  if (session) {
    console.log('Current user:', session.user);
    currentPage.value = 'home';
    currentUserId.value = session.user.id;

    await fetchUserInfo();  //should this happen? 

    // console.log('Access token:', session.access_token);
   } //else {
  //   console.log('No active session.');
  //   currentPage.value = 'login';
  // }
})

async function fetchUserInfo() {
  if (currentUserId.value) {
    [userCatalogs.value, userGenres.value] = await getUserInfo(supabase.value, currentUserId.value);
    console.log('Fetched user info:', currentUserId.value, userCatalogs.value, userGenres.value);
    if (userCatalogs.value.length === 0) {
      showPreferencesModal.value = true;
    } else {
      showPreferencesModal.value = false;
    }
  } 
}

watch(showPreferencesModal, (isVisible, wasVisible) => {
  if (!isVisible && wasVisible) {
    fetchUserInfo();
  }
});

watch(currentPage, async (newPage, oldPage) => {
  if (newPage == 'home' && (oldPage == 'register' || oldPage == 'login')) {
    //[userCatalogs.value, userGenres.value] = await getUserInfo(supabase.value, currentUserId.value);
    await fetchUserInfo();
    console.log('currentuserstuff:', currentUserId.value, userCatalogs.value, userGenres.value);
  }
});

// function navigateToPage(newPage) {
//   currentPage.value = newPage;
// }

// --- Functions ---

async function handleLogout() {
  try {
    await logout(supabase.value);
  } catch (err) {
    console.error('Logout failed:', err.message);
    alert('Logout failed. Please try again.');
  } finally {
    currentUserId.value = null;
    userCatalogs.value = [];
    userGenres.value = [];
    currentPage.value = 'login';
  }
};

</script>

<style>
/* Global styles for the entire application */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  margin: 0;
  background-color: #1a202c; /* Dark background */
  color: #e2e8f0; /* Light text */
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  text-decoration: none;
  color: #735CD1; /* Purple accent for links */
}

/* --- Nav Bar Styling --- */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 2rem; /* Reduced vertical padding */
  background-color: #2d3748;
  color: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.navbar-left a {
  display: flex; /* Helps with vertical alignment */
  align-items: center;
}

/* Updated .brand class to style the image */
.brand {
  height: 35px; /* Set a fixed height for the logo */
  width: auto; /* Maintain aspect ratio */
}

.navbar-center {
  display: flex;
  gap: 1rem;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.nav-button {
  background: none;
  border: 1px solid transparent;
  color: #a0aec0;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s;
}

.nav-button:hover {
  background-color: rgba(74, 85, 104, 0.5);
  color: #ffffff;
}

.account-button {
  background-color: #735CD1;
  color: white;
  border-color: #735CD1;
}

.account-button:hover {
  background-color: #624FAD;
  border-color: #624FAD;
}

.logout-button {
  background-color: transparent;
  color: #a0aec0;
  border: 1px solid #4a5568;
}

.logout-button:hover {
  background-color: #c0392b;
  border-color: #c0392b;
  color: white;
}
</style>


<!-- <style>
/* Global styles for the entire application */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  margin: 0;
  background-color: #f4f6f9; /* A light grey background for the app */
  color: #333;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  text-decoration: none;
  color: white;
}

/* --- Nav Bar Styling --- */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(90deg, #2c3e50, #34495e);
  color: white;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.brand {
  font-size: 1.75rem;
  font-weight: 600;
  letter-spacing: -1px;
}

.navbar-center {
  display: flex;
  gap: 1rem;
}

/* This container now uses flexbox to space out the buttons */
.navbar-right {
  display: flex;
  align-items: center;
  gap: 0.75rem; /* This adds space between the buttons */
}

.nav-button {
  background: none;
  border: 1px solid transparent; /* Set border to transparent by default */
  color: #bdc3c7;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;
}

.nav-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
  color: #fff;
}

/* Primary button style (solid fill) */
.account-button {
  background-color: #42b983;
  color: white;
  border-color: #42b983; /* Match border to background */
}

.account-button:hover {
  background-color: #3aa873;
  border-color: #3aa873;
  color: white;
}

/* Secondary button style (outline) */
.logout-button {
  background-color: transparent;
  color: #95a5a6;
  border: 1px solid #7f8c8d;
}

.logout-button:hover {
  background-color: #c0392b;
  border-color: #c0392b;
  color: white;
}
</style> -->


<!-- DELETE ME IM FOR TESTING 
<div>
  <button @click="getUserInfoClicked(); console.log('clicked in thins');">Get User Info</button>
  <p>
    {{ userInfo.user_id }}
  </p>
  <p>
    {{ userInfo.catalogs }}
  </p>
  <p>
    {{ userInfo.genres }}
    </p>
  </div>
-->

<!-- // const userInfo = ref({});
// async function getUserInfoClicked() {
  //   console.log('clicked');
//   userInfo.value = await getUserInfo(supabase.value, '6cfbbf15-e66c-4e33-b2e5-f2db9c0cdae8');
//   console.log("userInfo", userInfo);
//   return;
// } -->



<!-- <script setup>
</script>

<template>
  <div class="container">
    <p>moodstream</p>
  </div>
</template>

<style scoped>
p {
  font-size: 20px;
  color: #333;
}

.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
}
</style> -->