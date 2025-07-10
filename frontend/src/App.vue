        
<template>
  
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
import { ref } from 'vue';
import { supabaseAnonKey, supabaseUrl } from './supabase'; 
import { createClient } from '@supabase/supabase-js';
import Login  from './components/Login.vue';
import Register from './components/Register.vue';
import Home from './components/Home.vue';


// --- State Management ---
let currentPage = ref('login'); // Can be 'login' or 'register' (for now)

const supabase = ref(createClient(supabaseUrl, supabaseAnonKey));

</script>

<style>
/* Basic styling for readability */
body {
  font-family: sans-serif;
  padding: 2em;
}
div {
  margin-bottom: 1em;
}
input {
  margin-left: 0.5em;
  padding: 0.5em;
}
button {
  margin-top: 1em;
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