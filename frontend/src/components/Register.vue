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
const firstName = ref('');
const lastName = ref('');

async function handleRegister() {
  try {
    // Step 1: Sign up the user in the auth.users table
    const { data: authData, error: authError } = await props.supabase.auth.signUp({
      email: email.value,
      password: password.value,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error("Registration failed, no user returned.");

    // Step 2: Insert the user's profile information into the public.profiles table
    const { error: profileError } = await props.supabase
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

<template>
  <div>
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
      <button @click="currentPage = 'login'">Login here</button>
    </p>
  </div>
</template>

<style>
</style>