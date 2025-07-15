<template>
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
  
      <div class="submit-button">
        <button @click="submitPreferences">Save Preferences</button>
      </div>
    </div>
  </template>
  

  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    currentUserId: {
      type: String,
      required: true
    },
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
  