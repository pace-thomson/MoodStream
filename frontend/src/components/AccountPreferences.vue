<template>
  <div class="account-container">
    <div class="account-preferences">
      <div class="catalog-preferences">
        <!-- Titles can also be conditional based on the page -->
        <h2 v-if="isAccountPage">Update Your Streaming Services</h2>
        <h2 v-else>Select Your Streaming Services</h2>
        <p>Select the services you subscribe to for tailored recommendations. We will automatically include tubi and PlutoTV's free streaming services in your recommendations.</p>
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
        <h2 v-if="isAccountPage">Update Your Preferred Genres</h2>
        <h2 v-else>Select Your Preferred Genres</h2>
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
        <!-- The button's text and action are now conditional -->
        <button v-if="isAccountPage" @click="handleSubmit" class="submit-button">Update Preferences</button>
        <button v-else @click="handleSubmit" class="submit-button">Save Preferences</button>
      </div>
    </div>
  </div>
</template>
    
<script setup>
import { ref, onMounted, computed } from 'vue';
// You'll need to import all necessary functions from your supabase.js file
import { saveInitialPreferences, updateUserPreferences } from '../supabase.js';
import { SupabaseClient } from '@supabase/supabase-js';

const props = defineProps({
  currentUserId: {
    type: String,
  },
  currentPage: {
    type: String,
  },
  supabase: {
    type: SupabaseClient
  }
});

// A computed property to easily check the current mode
const isAccountPage = computed(() => props.currentPage === 'account');

// --- Local State for UI ---
const catalogs = ref([
  { name: 'netflix', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { name: 'prime', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg' },
  { name: 'disney', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
  { name: 'hbo', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/8/81/HBO_Max_Logo_%28October_2019%29.svg' },
  { name: 'hulu', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/0/03/Hulu_logo_%282014%29.svg' },
  { name: 'apple', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' },
  { name: 'peacock', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/NBCUniversal_Peacock_Logo.svg' },
  { name: 'paramount', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Paramount%2B_logo.svg' },
  { name: 'starz', subscribed: false, logo: 'https://res.cloudinary.com/ybmedia/image/upload/c_crop,h_900,w_1600,x_0,y_0/c_fill,f_auto,h_1215,q_auto,w_2160/v1/m/7/b/7b5bafc2ddb956533bca95e70d7accb6f854c38e/starz-review-2023-everything-know-before.jpg' },
  { name: 'mubi', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/d/dc/MUBI_Logo_Standard_Black.png' },
  { name: 'britbox', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1a/Britbox_2022_%28UK%29.svg' },
  { name: 'curiosity', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Curiosity_Channel_Logo_2023.svg' },
  { name: 'plutotv', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/3/35/Pluto_TV_logo_2020.svg' },
  { name: 'tubi', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/d/db/Tubi_logo.svg' },
  { name: 'discovery', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/2019_Discovery_logo.svg' }
]);

const genres = ref([
  { id: 'action', name: 'Action', selected: false },
  { id: 'adventure', name: 'Adventure', selected: false },
  { id: 'animation', name: 'Animation', selected: false },
  { id: 'comedy', name: 'Comedy', selected: false },
  { id: 'crime', name: 'Crime', selected: false },
  { id: 'documentary', name: 'Documentary', selected: false },
  { id: 'drama', name: 'Drama', selected: false },
  { id: 'family', name: 'Family', selected: false },
  { id: 'fantasy', name: 'Fantasy', selected: false },
  { id: 'history', name: 'History', selected: false },
  { id: 'horror', name: 'Horror', selected: false },
  { id: 'music', name: 'Music', selected: false },
  { id: 'mystery', name: 'Mystery', selected: false },
  { id: 'news', name: 'News', selected: false },
  { id: 'reality', name: 'Reality', selected: false },
  { id: 'romance', name: 'Romance', selected: false },
  { id: 'scifi', name: 'Science Fiction', selected: false },
  { id: 'talk', name: 'Talk Show', selected: false },
  { id: 'thriller', name: 'Thriller', selected: false },
  { id: 'war', name: 'War', selected: false },
  { id: 'western', name: 'Western', selected: false }
]);

// --- Lifecycle Hook ---
// When the component is loaded, fetch preferences ONLY if we are on the account page
onMounted(async () => {
  if (isAccountPage.value && props.currentUserId) {
    await fetchUserPreferences();
  }
});

  // --- Data Fetching ---
async function fetchUserPreferences() {
  try {
    const { data: savedCatalogs, error: catalogError } = await props.supabase
      .from('user_catalogs')
      .select('service')
      .eq('user_id', props.currentUserId);
    if (catalogError) throw catalogError;
    const savedCatalogNames = savedCatalogs.map(c => c.service);
    catalogs.value.forEach(catalog => {
      catalog.subscribed = savedCatalogNames.includes(catalog.name);
    });

    const { data: savedGenres, error: genreError } = await props.supabase
      .from('user_genres')
      .select('genre')
      .eq('user_id', props.currentUserId);
    if (genreError) throw genreError;
    const savedGenreIds = savedGenres.map(g => g.genre);
    genres.value.forEach(genre => {
      genre.selected = savedGenreIds.includes(genre.id);
    });
  } catch (error) {
    console.error('Error fetching user preferences:', error.message);
    alert('Could not load your preferences.');
  }
}
  
// --- UI Interaction ---
function selectCatalog(catalogName) {
  const catalog = catalogs.value.find(c => c.name === catalogName);
  // console.log('catalog selected', catalog);
  if (catalog) catalog.subscribed = !catalog.subscribed;
}

function selectGenre(genreName) {
  const genre = genres.value.find(g => g.name === genreName);
  // console.log('genre selected', genre);
  if (genre) genre.selected = !genre.selected;
}

// --- Data Submission ---
async function handleSubmit() {
  const selectedCatalogs = catalogs.value.filter(c => c.subscribed).map(c => c.name);
  const selectedGenres = genres.value.filter(g => g.selected).map(g => g.id);

  try {
    if (isAccountPage.value) {
      // On the account page, use the "delete-then-insert" logic
      await updateUserPreferences(props.currentUserId, selectedCatalogs, selectedGenres, props.supabase);
      alert('Preferences updated successfully!');
    } else {
      // On the initial setup page, use the simple "insert-only" logic
      await saveInitialPreferences(props.currentUserId, selectedCatalogs, selectedGenres, props.supabase);
      alert('Preferences saved!');
      // You might want to emit an event here to tell the parent component to move to the next step
    }
  } catch (error) {
    console.error('Failed to save preferences:', error);
    alert('There was an error saving your preferences.');
  }
}
</script>

<!-- <style scoped>
.account-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 2rem auto;
}

.account-preferences {
  background-color: #2d3748; /* Dark card background */
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.catalog-preferences, .genre-preferences {
  margin-bottom: 3rem;
}

h2 {
  font-size: 1.75rem;
  color: #e2e8f0;
  border-bottom: 2px solid #4a5568; /* Darker border */
  padding-bottom: 0.5rem;
  margin-bottom: 0.5rem;
}

p {
  color: #a0aec0;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.catalog-buttons, .genre-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.catalog-button {
  background-color: #4a5568; /* Darker grey for unselected */
  border: 2px solid #718096;
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
  filter: brightness(0) invert(1); /* Invert logos to be white */
  opacity: 0.8;
}

.catalog-button.selected .catalog-logo {
    opacity: 1;
}

.genre-button {
  background-color: #4a5568;
  border: 2px solid #718096;
  color: #cbd5e0;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.genre-button.selected {
  background-color: #42b983;
  color: #1a202c; /* Dark text on green background */
  border-color: #42b983;
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
</style> -->


<style scoped>
.account-container {
  /*padding: 2rem;*/
  max-width: 1200px;
  margin: 2rem auto;
}

.account-preferences {
  background-color: #f8f9fa;
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
  border-bottom: 2px solid #a5b7d4;
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
  border-color: #735CD1; /* Purple accent */
  box-shadow: 0 0 10px rgba(115, 92, 209, 0.5);
}

.catalog-logo {
  height: 40px;
  width: auto;
  max-width: 100px;
}

.genre-button {
  background-color: #4a5568;
  border: 2px solid #718096;
  color: #cbd5e0;
  padding: 0.75rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}

.genre-button.selected {
  background-color: #735CD1; /* Purple accent */
  color: #ffffff;
  border-color: #735CD1;
}


.submit-button-container {
  text-align: right;
  margin-top: 2rem;
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
}

.submit-button:hover {
  background-color: #624FAD; /* Darker purple */
}
</style>







<!-- <template>
  <div class="account-preferences">
    <div class="catalog-preferences">
      <h2>Your Streaming Services</h2>
      <div class="catalog-buttons">
        <button
          v-for="catalog in catalogs"
          :key="catalog.name"
          @click="selectCatalog(catalog.name)"
          :class="{ selected: catalog.subscribed }"
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
      <div class="genre-buttons">
        <button
          v-for="genre in genres"
          :key="genre.name"
          @click="selectGenre(genre.name)"
          :class="{ selected: genre.selected }"
        >
          {{ genre.name }}
        </button>
      </div>
    </div>

    <div class="submit-button" v-if="currentPage !== 'account'">
      <button @click="submitPreferences">Save Preferences</button>
    </div>
  </div>
</template>


<script setup>
import { ref } from 'vue';

const props = defineProps({
  currentUserId: {
    type: String,
  },
  currentPage: {
    type: String,
  }
});

const catalogs = ref([
  { name: 'netflix', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
  { name: 'prime', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/11/Amazon_Prime_Video_logo.svg' },
  { name: 'disney', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
  { name: 'hbo', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Max_Logo.svg' },
  { name: 'hulu', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Hulu_Logo.svg' },
  { name: 'apple', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_TV_Plus_Logo.svg' },
  { name: 'peacock', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/17/Peacock_Logo.svg' },
  { name: 'paramount', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3a/Paramount_Plus_Logo.svg' },
  { name: 'starz', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/3/31/Starz_2022.svg' },
  { name: 'mubi', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/8/89/MUBI_logo.svg' },
  { name: 'britbox', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7d/BritBox_logo_2022.svg' },
  { name: 'curiosity', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/7/70/Curiositystream_logo_2020.svg' },
  { name: 'plutotv', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Pluto_TV_2020.svg' },
  { name: 'tubi', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Tubi_logo.svg' },
  { name: 'discovery', subscribed: false, logo: 'https://upload.wikimedia.org/wikipedia/commons/1/16/Discovery_Plus_logo.svg' }
]);

const genres = ref([
  { id: 'action', name: 'Action', selected: false },
  { id: 'adventure', name: 'Adventure', selected: false },
  { id: 'animation', name: 'Animation', selected: false },
  { id: 'comedy', name: 'Comedy', selected: false },
  { id: 'crime', name: 'Crime', selected: false },
  { id: 'documentary', name: 'Documentary', selected: false },
  { id: 'drama', name: 'Drama', selected: false },
  { id: 'family', name: 'Family', selected: false },
  { id: 'fantasy', name: 'Fantasy', selected: false },
  { id: 'history', name: 'History', selected: false },
  { id: 'horror', name: 'Horror', selected: false },
  { id: 'music', name: 'Music', selected: false },
  { id: 'mystery', name: 'Mystery', selected: false },
  { id: 'news', name: 'News', selected: false },
  { id: 'reality', name: 'Reality', selected: false },
  { id: 'romance', name: 'Romance', selected: false },
  { id: 'scifi', name: 'Science Fiction', selected: false },
  { id: 'talk', name: 'Talk Show', selected: false },
  { id: 'thriller', name: 'Thriller', selected: false },
  { id: 'war', name: 'War', selected: false },
  { id: 'western', name: 'Western', selected: false }
]);

function selectCatalog(catalogName) {
  const catalog = catalogs.value.find(c => c.name === catalogName);
  if (catalog) {
    catalog.subscribed = !catalog.subscribed;
    console.log(`Catalog ${catalogName} subscription status: ${catalog.subscribed}`);
  }
}

function selectGenre(genreName) {
  const genre = genres.value.find(g => g.name === genreName);
  if (genre) {
    genre.selected = !genre.selected;
    console.log(`Genre ${genreName} selection status: ${genre.selected}`);
  }
}

async function submitPreferences() {
  const selectedCatalogs = catalogs.value.filter(c => c.subscribed).map(c => c.name);
  const selectedGenres = genres.value.filter(g => g.selected).map(g => g.id);

  console.log('Selected Catalogs:', selectedCatalogs);
  console.log('Selected Genres:', selectedGenres);

  const { error } = await saveUserCatalogs(props.currentUserId, selectedCatalogs);
  if (error) {
  alert('Failed to save catalog preferences.');
  } else {
  alert('Catalog preferences saved!');
  }

}
</script>
  -->