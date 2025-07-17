<template>
    <div class="account-page-container">
      <h1>Account Settings</h1>
  
      <!-- Section for updating user's name, now in its own styled container -->
      <div class="account-section">
        <h2>Update Your Profile</h2>
        <form @submit.prevent="handleNameUpdate" class="profile-form">
          <div class="input-group">
            <label for="first-name">First Name</label>
            <input type="text" id="first-name" v-model="firstName" required />
          </div>
          <div class="input-group">
            <label for="last-name">Last Name</label>
            <input type="text" id="last-name" v-model="lastName" required />
          </div>
          <div class="profile-form-footer">
          <button type="submit" class="submit-button">Save Name</button>
        </div>
        </form>
      </div>
  
      <!-- The AccountPreferences component is now a sibling, ensuring it appears as a separate card -->
      <AccountPreferences 
        :current-user-id="props.currentUserId"
        :current-page="props.currentPage" 
        :supabase="props.supabase"
      />
    </div>
  </template>
  
<script setup>
import { ref, onMounted } from 'vue';
// We need to import the new name update function and the preferences component
// import { updateUserName } from '../supabase.js';
import AccountPreferences from '../components/AccountPreferences.vue'; // Assuming the component is saved here
import { SupabaseClient } from '@supabase/supabase-js';

const props = defineProps({
  currentUserId:{
    type: String,
  },
  currentPage: {
    type: String,
  },
  supabase: {
    type: SupabaseClient
  },
});

const firstName = ref('');
const lastName = ref('');

// When the component loads, fetch the user's current name to pre-fill the form
//   onMounted(async () => {
//     try {
//       const { data, error } = await supabase
//         .from('profiles')
//         .select('first_name, last_name')
//         .eq('id', props.currentUser.id)
//         .single(); // .single() is used to get just one record
  
//       if (error) throw error;
  
//       if (data) {
//         firstName.value = data.first_name;
//         lastName.value = data.last_name;
//       }
//     } catch (error) {
//       console.error('Error fetching profile name:', error.message);
//     }
//   });
  
//   async function handleNameUpdate() {
//     try {
//       await updateUserName(props.currentUser.id, firstName.value, lastName.value);
//       alert('Your name has been updated successfully!');
//     } catch (error) {
//       console.error('Error updating name:', error.message);
//       alert('Failed to update your name.');
//     }
//   }
</script>

<style scoped>
.account-page-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  color: #e2e8f0;
  border-bottom: 2px solid #4a5568;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

/* This class styles the white card container for the profile section */
.account-section {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.account-section h2 {
  font-size: 1.75rem;
  color: #2c3e50; /* Dark text for white background */
  margin-top: 0;
  margin-bottom: 1.5rem;
}

/* The form now uses flexbox instead of grid */
.profile-form {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.input-group {
  flex: 1 1 calc(50% - 0.75rem); /* Allows two columns with a gap */
  min-width: 200px; /* Prevents inputs from getting too small */
}

.input-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #34495e; /* Dark text */
}

.input-group input {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  background-color: #f8f9fa; /* Light background for inputs */
  border: 2px solid #dfe4ea; /* Light border */
  color: #2c3e50; /* Dark text */
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.input-group input:focus {
  outline: none;
  border-color: #735CD1; /* Purple accent */
}

/* This footer now takes up the full width of the flex container */
.profile-form-footer {
  width: 100%;
  text-align: right; /* This pushes the content (the button) to the right */
  margin-top: 1rem;
}

.submit-button {
  padding: 0.85rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #735CD1; /* Purple accent */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.submit-button:hover {
  background-color: #624FAD; /* Darker purple */
}
</style>




<!-- <style scoped>
.account-page-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  font-size: 2.5rem;
  color: #2c3e50;
  border-bottom: 2px solid #ecf0f1;
  padding-bottom: 1rem;
  margin-bottom: 2rem;
}

.account-section {
  background-color: #ffffff;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 2rem;
}

.account-section h2 {
  font-size: 1.75rem;
  color: #2c3e50;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.profile-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  align-items: flex-end;
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
  padding: 0.85rem 2rem;
  font-size: 1rem;
  font-weight: bold;
  color: white;
  background-color: #42b983;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  white-space: nowrap;
}

.submit-button:hover {
  background-color: #3aa873;
}
</style> -->
