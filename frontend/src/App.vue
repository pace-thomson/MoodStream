<template>
  <!-- Nav Bar -->
  <nav class="navbar" v-if="currentPage !== 'login' && currentPage !== 'register'">
    <div class="navbar-left">
      <span class="brand">moodstream</span>
    </div>
    <div class="navbar-center">
      <button class="nav-button">My Moods</button>
      <button class="nav-button">My Watchlist</button>
    </div>
    <div class="navbar-right">
      <button class="nav-button account-button">Account</button>
      <button class="nav-button logout-button" @click="handleLogout">Logout</button>

    </div>
  </nav>
  
  <!-- Login/Register area -->
  <div v-if="currentPage === 'login' || currentPage === 'register'" id="login-register">
          
    <Login 
      v-if="currentPage === 'login'"
      v-model="currentPage"  
      :supabase="supabase"
    />
    
    <Register 
      v-else-if="currentPage === 'register'"
      v-model="currentPage"  
      :supabase="supabase"
    />
  </div>

  <div v-else-if="currentPage == 'home'" id="main-page">
    <Home v-model="currentPage" />
  </div>
    
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey, getUserInfo, logout } from './supabase.js';

import Login from './components/Login.vue';
import Register from './components/Register.vue';
import Home from './components/Home.vue';



// --- State Management ---
let currentPage = ref('login'); // Default to 'login' page

// -- Ref variables --
const currentUser = ref(null);
const userCatalogs = ref([]);
const userGenres = ref([]);
const userWatchlist = ref([]);
const userMoodHistory = ref([]);//this array has the imdb id of the movie or show(and all its details), but we can change this if one of the other ids is better, but imdb is the universal one that can link to both movie of the night or tmdb if needed.

const supabase = ref(createClient(supabaseUrl, supabaseAnonKey));

// --- Functions ---
async function loadUserData(user) {
  try {
    currentUser.value = user;

    const info = await getUserInfo(supabase.value, user.id);
    userCatalogs.value = info.catalogs;
    userGenres.value = info.genres;

    currentPage.value = 'home';
  } catch (err) {
    console.error('Error loading user data:', err.message);
    alert('Failed to load user data.');
  }
};

async function handleLogout() {
  try {
    await logout(supabase.value);
  } catch (err) {
    console.error('Logout failed:', err.message);
    alert('Logout failed. Please try again.');
  } finally {
    currentUser.value = null;
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
  background-color: #f4f6f9; /* A light grey background for the app */
  color: #333;
}

#app {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
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
</style>


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