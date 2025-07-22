<template>
  <section class="page-container">
    <div class="page-header">
      <h2 class="page-title">Your Recommendations</h2>
      <button @click="homeState = 'prompt'" class="restart-button">
        Restart Recommendations
      </button>
    </div>

    <TitleCard 
      :shows="props.recommendedShows" 
      :catalogs="props.catalogs" 
      :supabase="props.supabase"
      :current-user-id="props.currentUserId"
    />
  </section>
</template>

<script setup>
import { SupabaseClient } from '@supabase/supabase-js';
import TitleCard from '../components/TitleCard.vue';

const homeState = defineModel('home-state');

const props = defineProps({
  supabase: SupabaseClient,
  currentUserId: String,
  catalogs: Array,
  recommendedShows: Array
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

.restart-button {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  font-weight: bold;
  color: #e2e8f0;
  background-color: #4a5568;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.restart-button:hover {
  background-color: #735CD1;
}
</style>