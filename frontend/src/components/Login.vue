<script setup>
import { ref } from 'vue';
import { SupabaseClient } from '@supabase/supabase-js';

let currentPage = defineModel(); 

const props = defineProps({
  supabase: {
    type: SupabaseClient
  },
});


const email = ref('');
const password = ref('');

async function handleLogin() {
  try {
    console.log("object", props.supabase);
    const { data, error } = await props.supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    console.log('Logged in user:', data.user);
    currentPage.value = 'home';
    
  } catch (error) {
    alert(error.message);
    console.error('Error logging in:', error);
  }
}
</script>

<template>
  <div>
    <h1>Moodstream</h1>
    <h2>Login</h2>
    <form @submit.prevent>
      <div>
        <label for="email">Email:</label>
        <input type="email" id="email" v-model="email" required />
      </div>
      <div>
        <label for="password">Password:</label>
        <input type="password" id="password" v-model="password" required />
      </div>
      <button @click="handleLogin()" type="submit">Login</button>
    </form>
    <p>
      Don't have an account?
      <button @click="currentPage = 'register'">Register here</button>
    </p>
  </div>
</template>

<style>

</style>