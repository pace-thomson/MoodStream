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
import { supabase } from './supabase';

// --- State Management ---
const currentPage = ref('login'); // Can be 'login' or 'register'

// --- Form Input Models ---
const email = ref('');
const password = ref('');
const firstName = ref('');
const lastName = ref('');

// --- Navigation ---
function navigateTo(page) {
  // Clear form fields when switching views
  email.value = '';
  password.value = '';
  firstName.value = '';
  lastName.value = '';
  currentPage.value = page;
}



// --- Form Handlers  ---

async function handleLogin() {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'valid.email@supabase.io',
    password: 'example-password',
  })
  console.log('Attempting to log in with:');
  console.log('Email:', email.value);
  console.log('Password:', password.value);
  //alert(`Logging in with ${email.value}`);
}

async function handleRegister() {
  const { data, error } = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
    // options: {
    //   emailRedirectTo: 'https://example.com/welcome',
    // },
  })
  // After a successful signup, you will also need to insert the
  // first_name and last_name into your 'profiles' table.
  console.log('Attempting to register with:');
  console.log('First Name:', firstName.value);
  console.log('Last Name:', lastName.value);
  console.log('Email:', email.value);
  console.log('Password:', password.value);

  //alert(`Registering ${firstName.value} ${lastName.value}`);
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