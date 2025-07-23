<template>
    <div class="search-container">
      <h1 class="page-title">Find a Movie or Show</h1>
      <p class="page-subtitle">
        Know what you're looking for? Type in a title or describe it below.
      </p>
  
      <div class="search-box">
        <textarea
          v-model="prompt"
          class="search-input"
          placeholder="e.g., 'The Dark Knight' or 'the one with the spinning top that makes you question reality'"
          @keyup.enter="handleSearch"
        ></textarea>
        <button @click="handleSearch" class="search-button" :disabled="isLoading">
          <span v-if="!isLoading">Search</span>
          <span v-else>Searching...</span>
        </button>
      </div>
  
      <div v-if="isLoading" class="loading-indicator">
        <p>Finding your show...</p>
      </div>
  
      <div v-if="error" class="error-message">
        <p>{{ error }}</p>
      </div>
  
      <div v-if="searchResults.length > 0" class="results-container">
        <h2 class="results-title">Search Results</h2>
        <TitleCard
          :shows="searchResults"
          :catalogs="catalogs"
          :supabase="supabase"
          :currentUserId="currentUserId"
        />
      </div>
       <div v-else-if="searched && !isLoading" class="no-results-message">
        <p>I didn't find anything. Try being more specific or give any details you can remember about what you're looking for.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  import TitleCard from '../components/TitleCard.vue'; 
  
  // --- Props ---
  const props = defineProps({
    catalogs: {
      type: Array,
      required: true
    },
    supabase: {
      type: Object,
      required: true
    },
    currentUserId: {
      type: String,
      required: true
    }
  });
  
  // --- State Management ---
  const prompt = ref('');
  const searchResults = ref([]);
  const isLoading = ref(false);
  const error = ref(null);
  const searched = ref(false); // To track if a search has been attempted
  
  // --- API Call Logic ---
//   async function handleSearch() {
//     if (!prompt.value.trim()) return;
  
//     isLoading.value = true;
//     error.value = null;
//     searchResults.value = [];
//     searched.value = true;
  
//     try {
//       // backend API endpoint for search
      
  
//       if (!response.ok) {
//         throw new Error('Could not fetch search results. The server might be down or the request was invalid.');
//       }
  
//       const data = await response.json();
//       searchResults.value = data;
  
//     } catch (err) {
//       console.error('Search failed:', err);
//       error.value = err.message || 'An unexpected error occurred.';
//     } finally {
//       isLoading.value = false;
//     }
//   }
  </script>
  
  <style scoped>
  .search-container {
    max-width: 1200px;
    margin: 2rem auto;
    padding: 0 2rem;
    color: #e2e8f0;
  }
  
  .page-title {
    font-size: 2.5rem;
    font-weight: 700;
    text-align: center;
    margin-bottom: 0.5rem;
  }
  
  .page-subtitle {
    font-size: 1.1rem;
    text-align: center;
    color: #a0aec0;
    margin-bottom: 2.5rem;
  }
  
  .search-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-bottom: 2rem;
  }
  
  .search-input {
    width: 100%;
    max-width: 600px;
    min-height: 80px;
    padding: 1rem;
    font-size: 1rem;
    background-color: #cdd5df;
    border: 1px solid #4a5568;
    border-radius: 8px;
    color: #e2e8f0;
    resize: vertical;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  
  .search-input:focus {
    outline: none;
    border-color: #735CD1;
    box-shadow: 0 0 0 3px rgba(115, 92, 209, 0.3);
  }
  
  .search-button {
    padding: 0.75rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    color: #fff;
    background-color: #735CD1;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .search-button:hover:not(:disabled) {
    background-color: #5a48a2;
  }
  
  .search-button:disabled {
    background-color: #4a5568;
    cursor: not-allowed;
  }
  
  .loading-indicator, .error-message, .no-results-message {
    text-align: center;
    margin-top: 3rem;
    font-size: 1.2rem;
    color: #a0aec0;
  }
  
  .error-message {
    color: #f56565;
  }
  
  .results-container {
    margin-top: 3rem;
  }
  
  .results-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #4a5568;
    padding-bottom: 0.5rem;
  }
  </style>
  