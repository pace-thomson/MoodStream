<template>
  <section class="page-container">
    <div class="page-header">
      <h2 class="page-title">Your Saved Shows</h2>
    </div>

    <div v-if="isLoading" class="loading-container">
      <p>Loading your watchlist...</p>
    </div>

    <TitleCard 
      v-else-if="watchlistShows.length > 0"
      :shows="watchlistShows" 
      :catalogs="props.catalogs"
      :supabase="props.supabase"
      :current-user-id="props.currentUserId"
    />

    <div v-else class="empty-watchlist">
      <p>Your watchlist is empty.</p>
      <p>Click the '+' on any show to add it here!</p>
    </div>
  </section>
</template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { SupabaseClient } from '@supabase/supabase-js';
import { getUserWatchlist } from '../supabase.js';
import { getShowByImdbId } from '../serverCaller.js';
import TitleCard from '../components/TitleCard.vue';

// --- Component State ---
const isLoading = ref(true);
const watchlistShows = ref([]);

// --- Props ---
const props = defineProps({
  supabase: { type: SupabaseClient, required: true },
  currentUserId: { type: String, required: true },
  catalogs: { type: Array, required: true }
});

// --- Lifecycle Hook ---
onMounted(async () => {
  try {
    const basicWatchlist = await getUserWatchlist(props.supabase, props.currentUserId);

    if (basicWatchlist && basicWatchlist.length > 0) {
      const imdbIds = basicWatchlist.map(item => item.id_imdb);

      const detailedShows = await getShowByImdbId(imdbId);
      watchlistShows.value = detailedShows;
    }
  } catch (error) {
    console.error("Failed to fetch watchlist details:", error);
  } finally {
    isLoading.value = false;
  }
});
</script>
  
<style scoped>
.page-container {
  padding: 2rem;
  background-color: #1a202c;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #4a5568;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #e2e8f0;
  margin: 0;
}

.loading-container, .empty-watchlist {
  text-align: center;
  padding: 4rem 0;
  color: #a0aec0;
}

.empty-watchlist p {
  margin: 0.5rem;
  font-size: 1.1rem;
}
</style>