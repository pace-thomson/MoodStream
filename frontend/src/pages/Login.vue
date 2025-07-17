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

async function handleLogin() {
  try {
    console.log("object", props.supabase);
    const { data, error } = await props.supabase.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    });

    if (error) throw error;

    console.log('Logged in user:', data.user);
    currentUserId.value = data.user.id;
    currentPage.value = 'home';
    
  } catch (error) {
    alert(error.message);
    console.error('Error logging in:', error);
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="form-card">
      <div class="form-header">
        <h1>moodstream</h1>
        <p>Streaming just for you.</p>
      </div>
      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="input-group">
          <label for="email">Email</label>
          <input type="email" id="email" v-model="email" required />
        </div>
        <div class="input-group">
          <label for="password">Password</label>
          <input type="password" id="password" v-model="password" required />
        </div>
        <button type="submit" class="submit-button">Login</button>
      </form>
      <div class="switch-form">
        <p>
          Don't have an account?
          <button @click="currentPage = 'register'" class="switch-form-link">Register here</button>
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
  color: #735CD1; /* Purple accent */
  font-weight: 600;
  cursor: pointer;
  padding: 0;
}

.switch-form-link:hover {
  text-decoration: underline;
}
</style>



<!-- <style scoped>
/* Scoped styles for the Login component */  LIGHT THEME
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
