<template>
    <div class="search-container">
        <!-- This main search UI is now always visible -->
        <h1 class="page-title">Find a Movie or Show</h1>
        <p class="page-subtitle">
            Know what you're looking for? Type in a title or describe it below.
        </p>

        <div class="search-box">
            <!-- Input wrapper for positioning the clear button -->
            <div class="input-wrapper">
                <textarea
                    @keyup.enter="handleSearch()"
                    v-model="prompt"
                    class="search-input"
                    placeholder="e.g., 'The Dark Knight' or 'the one with the spinning top that makes you question reality'"
                ></textarea>
                <!-- Clear button ('x') inside the input -->
                <button v-if="prompt" @click="clearPrompt()" class="clear-button" tabindex="-1">&times;</button>
            </div>
            
            <!-- This button now conditionally changes its text and action -->
            <button v-if="!searched" @click="handleSearch()" class="search-button" :disabled="isLoading || !prompt.trim()">
                <span v-if="!isLoading">Search</span>
                <span v-else>Searching...</span>
            </button>
            <button v-else @click="resetSearch()" class="search-button">
                Start New Search
            </button>
        </div>

        <!-- UPDATED: Use Popcorn component for loading state -->
        <Popcorn v-if="isLoading" :quote="currentQuote" />
    
        <div v-if="error" class="error-message">
            <p>{{ error }}</p>
        </div>
    
        <!-- Search Results -->
        <div v-if="searchResults.length > 0" class="results-container">
            <h2 class="results-title">Search Results</h2>
            <TitleCardSearch
                :shows="searchResults"
                :catalogs="catalogs"
                :supabase="supabase"
                :currentUserId="currentUserId"
                :currentPage="currentPage"
            />
        </div>
        <div v-else-if="searched && !isLoading && !error" class="no-results-message">
            <p>I didn't find anything for that title. Please try another search.</p>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import TitleCardSearch from '../components/TitleCardSearch.vue'; 
import Popcorn from '../components/Popcorn.vue'; // Import Popcorn component
import { getShowsFromSearch } from '../serverCaller.js';
import { movieQuotes } from '../movieQuotes.js'; // Import movie quotes

// --- Props ---
const props = defineProps({
    catalogs: { type: Array, required: true },
    supabase: { type: Object, required: true },
    currentUserId: { type: String, required: true },
    currentPage: { type: String, required: true }
});

// --- State Management ---
const prompt = ref('');
const searchResults = ref([]);
const isLoading = ref(false);
const error = ref(null);
const searched = ref(false);
const currentQuote = ref(''); // Add state for the quote

// --- Functions ---
async function handleSearch() {
    if (!prompt.value.trim()) return;

    // Set a random quote for the loading screen
    const randomIndex = Math.floor(Math.random() * movieQuotes.length);
    currentQuote.value = movieQuotes[randomIndex];

    isLoading.value = true;
    error.value = null;
    searchResults.value = [];
    searched.value = true;

    try {
        const data = await getShowsFromSearch(prompt.value);
        searchResults.value = data;
    } catch (err) {
        console.error('Search failed:', err);
        error.value = err.message || 'An unexpected error occurred.';
    } finally {
        isLoading.value = false;
    }
}

// Clears the text in the input field
function clearPrompt() {
    prompt.value = '';
}

// Resets the search state, clearing results and the prompt
function resetSearch() {
    prompt.value = '';
    searchResults.value = [];
    error.value = null;
    searched.value = false;
}
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

/* Wrapper for the input and clear button */
.input-wrapper {
    position: relative;
    width: 100%;
    max-width: 600px;
}

.search-input {
    width: 100%;
    min-height: 80px; /* Larger default height */
    padding: 1rem 2.5rem 1rem 1rem; /* Adjust padding for textarea */
    font-size: 1.1rem;
    line-height: 1.5; /* Improve readability */
    background-color: #2d3748;
    border: 1px solid #4a5568;
    border-radius: 8px;
    color: #e2e8f0;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
    resize: vertical; /* Allow vertical resizing */
}

.search-input:focus {
    outline: none;
    border-color: #735CD1;
    box-shadow: 0 0 0 3px rgba(115, 92, 209, 0.3);
}

/* Clear button style */
.clear-button {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    color: #a0aec0;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0 5px;
    line-height: 1;
    z-index: 10;
}
.clear-button:hover {
    color: #e2e8f0;
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
    min-width: 180px; /* Give button a consistent width */
    text-align: center;
}

.search-button:hover:not(:disabled) {
    background-color: #5a48a2;
}

.search-button:disabled {
    background-color: #4a5568;
    cursor: not-allowed;
}

/* Removed .loading-indicator as it's replaced by Popcorn */

.error-message, .no-results-message {
    text-align: center;
    margin-top: 1rem;
    font-size: 1.2rem;
    color: #a0aec0;
}

.error-message {
    color: #f56565;
}

.results-container {
    margin-top: 1rem;
}

.results-title {
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    border-bottom: 2px solid #4a5568;
    padding-bottom: 0.5rem;
}
</style>
