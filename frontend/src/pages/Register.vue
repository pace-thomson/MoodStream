<script setup>
import { ref } from 'vue';
import { SupabaseClient } from '@supabase/supabase-js';

let currentPage = defineModel("current-page"); 
let currentUserId = defineModel("current-user-id"); 


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
    currentUserId.value = authData.user.id;

  } catch (error) {
    alert(error.message);
    console.error('Error during registration:', error);
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="form-card">
      <div class="form-header">
        <h1>Create Account</h1>
        <p>Join moodstream to get started</p>
      </div>
      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="input-group">
          <label for="first-name">First Name</label>
          <input type="text" id="first-name" v-model="firstName" required />
        </div>
        <div class="input-group">
          <label for="last-name">Last Name</label>
          <input type="text" id="last-name" v-model="lastName" required />
        </div>
        <div class="input-group">
          <label for="email-register">Email</label>
          <input type="email" id="email-register" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password-register">Password</label>
          <input type="password" id="password-register" v-model="password" required />
        </div>
        <button type="submit" class="submit-button">Register</button>
      </form>
      <div class="switch-form">
        <p>
          Already have an account?
      <button @click="currentPage = 'login'" class="switch-form-link">Login here</button>
    </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles for the auth components */
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1a202c;
}

.form-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background-color: #2d3748;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
}

.form-header p {
  font-size: 1rem;
  color: #a0aec0;
  margin-top: 0.5rem;
}

.auth-form .input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #cbd5e0;
}

.input-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background-color: #1a202c;
  border: 2px solid #4a5568;
  color: #e2e8f0;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #735CD1; /* Purple accent on focus */
}

.submit-button {
  width: 100%;
  padding: 0.85rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background-color: #735CD1; /* Purple accent */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.submit-button:hover {
  background-color: #624FAD; /* Darker purple */
}

.switch-form {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #a0aec0;
}

.switch-form-link {
  background: none;
  border: none;
  color: #b6aae8; /* Purple accent */
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.switch-form-link:hover {
  text-decoration: underline;
}
</style>



<!-- <style scoped>
/* These styles are identical to Login.vue for consistency  LIGHT THEME */  
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f4f6f9;
}

.form-card {
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
}

.form-header p {
  font-size: 1rem;
  color: #7f8c8d;
  margin-top: 0.5rem;
}

.auth-form .input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #34495e;
}

.input-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 2px solid #dfe4ea;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #42b983;
}

.submit-button {
  width: 100%;
  padding: 0.85rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background-color: #42b983;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-top: 1rem;
}

.submit-button:hover {
  background-color: #3aa873;
}

.switch-form {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #7f8c8d;
}

.switch-form-link {
  background: none;
  border: none;
  color: #42b983;
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.switch-form-link:hover {
  text-decoration: underline;
}
</style> -->
