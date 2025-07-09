<template>
  <div>
    <!-- LOGIN VIEW -->
    <div v-if="currentPage === 'login'">
      <h1>Moodstream</h1>
      <h2>Login</h2>
      <form @submit.prevent="handleLogin">
        <div>
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div>
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account?
        <button @click="navigateTo('register')">Register here</button>
      </p>

<!-- DELETE ME IM FOR TESTING -->
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


    </div>

    <!-- REGISTRATION VIEW -->
    <div v-else>
      <h1>Create Account</h1>
      <form @submit.prevent="handleRegister">
        <div>
          <label for="first-name">First Name:</label>
          <input type="text" id="first-name" v-model="firstName" required />
        </div>
        <div>
          <label for="last-name">Last Name:</label>
          <input type="text" id="last-name" v-model="lastName" required />
        </div>
        <div>
          <label for="email-register">Email:</label>
          <input type="email" id="email-register" v-model="email" required />
        </div>
        <div>
          <label for="password-register">Password:</label>
          <input type="password" id="password-register" v-model="password" required />
        </div>
        <button type="submit">Register</button>
      </form>
      <p>
        Already have an account?
        <button @click="navigateTo('login')">Login here</button>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { supabaseAnonKey, supabaseUrl, getUserInfo } from './supabase'; 
import { createClient } from '@supabase/supabase-js'


// --- State Management ---
const currentPage = ref('login'); // Can be 'login' or 'register'

// --- Form Input Models ---
const email = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');

const userInfo = ref({});

const supabase = ref(createClient(supabaseUrl, supabaseAnonKey));

// --- Navigation ---
function navigateTo(page) {
  // Clear form fields when switching views
  email.value = '';
  password.value = '';
  firstName.value = '';
  lastName.value = '';
  currentPage.value = page;
}

async function getUserInfoClicked() {
  console.log('clicked');
  userInfo.value = await getUserInfo(supabase.value, '6cfbbf15-e66c-4e33-b2e5-f2db9c0cdae8');
  console.log("userInfo", userInfo);
  return;
}

// --- Form Handlers (with Supabase) ---

async function handleLogin() {
  try {
    const { data, error } = await supabase.value.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;
    
    alert('Login successful!');
    console.log('Logged in user:', data.user);
    // You can navigate to another page or update the UI here

  } catch (error) {
    alert(error.message);
    console.error('Error logging in:', error);
  }
}

async function handleRegister() {
  try {
    // Step 1: Sign up the user in the auth.users table
    const { data: authData, error: authError } = await supabase.value.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Registration failed, no user returned.");

    // Step 2: Insert the user's profile information into the public.profiles table
    const { error: profileError } = await supabase.value
      .from('profiles')
      .insert({ 
        id: authData.user.id, // The user's ID from the auth table
        first_name: firstName.value, 
        last_name: lastName.value 
      });

    if (profileError) throw profileError;

    alert('Registration successful! Please check your email for verification.');
    console.log('Registered user:', authData.user);

  } catch (error) {
    alert(error.message);
    console.error('Error during registration:', error);
  }
}
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