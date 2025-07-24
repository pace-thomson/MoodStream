<template>

  <CustomAlert 
      v-if="alertIsVisible"
      :message="alertMessage"
      :type="alertType"
      @close="hideAlert" 
  />

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
      <button @click="currentPage = 'search'" class="nav-button">Search</button>
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
      :current-page="currentPage"
    />

    <Watchlist
      v-if="currentPage == 'watchlist'"
      :current-user-id="currentUserId"
      :supabase="supabase"
      :catalogs="userCatalogs"
      :current-page="currentPage"
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

    <Search
      v-if="currentPage == 'search'"
      :current-user-id="currentUserId"
      :supabase="supabase"
      :catalogs="userCatalogs"
      :current-page="currentPage"
    />

  </div>
    
</template>

<script setup>
import { ref, watch, onMounted, provide } from 'vue';
import { createClient } from '@supabase/supabase-js';
import { supabaseUrl, supabaseAnonKey, getUserInfo, logout } from './supabase.js';

import CustomAlert from './components/CustomAlert.vue';
import Landing from './pages/Landing.vue';
import Login from './pages/Login.vue';
import Register from './pages/Register.vue';
import Home from './pages/Home.vue';
import Account from './pages/Account.vue';
import Watchlist from './pages/Watchlist.vue';
import History from './pages/History.vue';
import Search from './pages/Search.vue';


// --- State Management ---
let currentPage = ref('landing'); // Default to 'landing' page
const showPreferencesModal = ref(false);

// -- Ref variables --
const currentUserId = ref(null);
const userCatalogs = ref([]);
const userGenres = ref([]);
const alertIsVisible = ref(false);
const alertMessage = ref('');
const alertType = ref('info'); // 'info', 'success', 'error'

const supabase = ref(createClient(supabaseUrl, supabaseAnonKey));

onMounted(async () => {
  const { data: { session } } = await supabase.value.auth.getSession();

  if (session) {
    currentPage.value = 'home';
    currentUserId.value = session.user.id;

    await fetchUserInfo(); 
  } 
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
    await fetchUserInfo();
    console.log('currentuserstuff:', currentUserId.value, userCatalogs.value, userGenres.value);
  }
});

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

// Function to SHOW the alert
function showAlert(message, type = 'info') {
  alertMessage.value = message;
  alertType.value = type;
  alertIsVisible.value = true;
}

// Function to HIDE the alert
function hideAlert() {
  alertIsVisible.value = false;
}

// Provide the showAlert function to all child components
provide('showAlert', showAlert);

</script>

<style>
/* Global styles for the entire application */
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  margin: 0;
  background-color: #1a202c; /* Dark background */
  color: #e2e8f0; /* Light text */
  -webkit-touch-callout: none; /* iOS Safari */
  -webkit-user-select: none; /* Safari */
  -khtml-user-select: none; /* Konqueror HTML */
  -moz-user-select: none; /* Old versions of Firefox */
  -ms-user-select: none; /* Internet Explorer/Edge */
  user-select: none; /* Non-prefixed version, currently */
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
  /* background-color: rgba(74, 85, 104, 0.5); */
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
