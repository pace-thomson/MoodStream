<template>
    <div class="account-container">
      <div class="account-preferences">
        <div class="catalog-preferences">
          <h2>Your Streaming Services</h2>
          <p>Select the services you subscribe to for tailored recommendations.</p>
          <div class="catalog-buttons">
            <button
              v-for="catalog in catalogs"
              :key="catalog.name"
              @click="selectCatalog(catalog.name)"
              :class="{ selected: catalog.subscribed }"
              class="catalog-button"
            >
              <img
                :src="catalog.logo"
                :alt="`Logo of ${catalog.name}`"
                class="catalog-logo"
              />
            </button>
          </div>
        </div>
    
        <div class="genre-preferences">
          <h2>Your Preferred Genres</h2>
          <p>Choose your favorite genres to help us find movies you'll love.</p>
          <div class="genre-buttons">
            <button
              v-for="genre in genres"
              :key="genre.name"
              @click="selectGenre(genre.name)"
              :class="{ selected: genre.selected }"
              class="genre-button"
            >
              {{ genre.name }}
            </button>
          </div>
        </div>
    
        <div class="submit-button-container">
          <!-- This button uses the "delete-then-insert" method -->
          <button @click="updatePreferences" class="submit-button">Update Preferences</button>
        </div>
      </div>
    </div>
  </template>
    
  <script setup>
  import { ref, onMounted } from 'vue';
  // You'll need to import your supabase client and the new update functions
  import { supabase, updateUserPreferences } from '../supabase.js';
  
  const props = defineProps({
    currentUserId: {
      type: String,
      required: true
    },
  });
  
  // --- Local State for UI ---
  const catalogs = ref([
      { name: 'netflix', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
      { name: 'prime', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg' },
      { name: 'disney', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
      // ... add all other catalogs here
  ]);
  
  const genres = ref([
      { id: 'action', name: 'Action', selected: false },
      { id: 'comedy', name: 'Comedy', selected: false },
      { id: 'drama', name: 'Drama', selected: false },
      // ... add all other genres here
  ]);
  
  // --- Lifecycle Hook ---
  // When the component is loaded, fetch the user's current preferences
  onMounted(async () => {
    if (props.currentUserId) {
      await fetchUserPreferences();
    }
  });
  
  // --- Data Fetching ---
  async function fetchUserPreferences() {
    try {
      // Fetch currently saved catalogs
      const { data: savedCatalogs, error: catalogError } = await supabase
        .from('user_catalogs')
        .select('service')
        .eq('user_id', props.currentUserId);
      
      if (catalogError) throw catalogError;
  
      // Update the local state to reflect saved catalogs
      const savedCatalogNames = savedCatalogs.map(c => c.service);
      catalogs.value.forEach(catalog => {
        if (savedCatalogNames.includes(catalog.name)) {
          catalog.subscribed = true;
        }
      });
  
      // Fetch currently saved genres
      const { data: savedGenres, error: genreError } = await supabase
        .from('user_genres')
        .select('genre')
        .eq('user_id', props.currentUserId);
  
      if (genreError) throw genreError;
  
      // Update the local state to reflect saved genres
      const savedGenreIds = savedGenres.map(g => g.genre);
      genres.value.forEach(genre => {
        if (savedGenreIds.includes(genre.id)) {
          genre.selected = true;
        }
      });
  
    } catch (error) {
      console.error('Error fetching user preferences:', error.message);
      alert('Could not load your preferences.');
    }
  }
  
  
  // --- UI Interaction ---
  function selectCatalog(catalogName) {
    const catalog = catalogs.value.find(c => c.name === catalogName);
    if (catalog) {
      catalog.subscribed = !catalog.subscribed;
    }
  }
  
  function selectGenre(genreName) {
    const genre = genres.value.find(g => g.name === genreName);
    if (genre) {
      genre.selected = !genre.selected;
    }
  }
  
  // --- Data Submission ---
  async function updatePreferences() {
    const selectedCatalogs = catalogs.value.filter(c => c.subscribed).map(c => c.name);
    const selectedGenres = genres.value.filter(g => g.selected).map(g => g.id);
  
    try {
      // This single function will handle the delete-then-insert logic
      await updateUserPreferences(props.currentUserId, selectedCatalogs, selectedGenres);
      alert('Preferences updated successfully!');
    } catch (error) {
      console.error('Failed to update preferences:', error);
      alert('There was an error saving your preferences.');
    }
  }
  </script>
  
  <style scoped>
  .account-container {
    padding: 2rem;
    max-width: 1200px;
    margin: 2rem auto;
  }
  
  .account-preferences {
    background-color: #ffffff;
    padding: 2.5rem;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  }
  
  .catalog-preferences, .genre-preferences {
    margin-bottom: 3rem;
  }
  
  h2 {
    font-size: 1.75rem;
    color: #2c3e50;
    border-bottom: 2px solid #ecf0f1;
    padding-bottom: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  p {
    color: #7f8c8d;
    margin-top: 0;
    margin-bottom: 1.5rem;
  }
  
  .catalog-buttons, .genre-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .catalog-button {
    background-color: #f8f9fa;
    border: 2px solid #dfe4ea;
    border-radius: 8px;
    padding: 0.5rem;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }
  
  .catalog-button.selected {
    border-color: #42b983;
    box-shadow: 0 0 10px rgba(66, 185, 131, 0.5);
  }
  
  .catalog-logo {
    height: 40px;
    width: auto;
    max-width: 100px;
  }
  
  .genre-button {
    background-color: #f8f9fa;
    border: 2px solid #dfe4ea;
    color: #34495e;
    padding: 0.75rem 1.5rem;
    border-radius: 20px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }
  
  .genre-button.selected {
    background-color: #2c3e50;
    color: white;
    border-color: #2c3e50;
  }
  
  .submit-button-container {
    text-align: right;
    margin-top: 2rem;
  }
  
  .submit-button {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
    font-weight: bold;
    color: white;
    background-color: #42b983;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .submit-button:hover {
    background-color: #3aa873;
  }
  </style>
  