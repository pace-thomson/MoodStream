<template>
  <section class="home">

    <div v-if="showPreferencesModal" class="modal-overlay">
      <div class="modal-content">
        <AccountPreferences 
          :current-user-id="props.currentUserId"
          :supabase="props.supabase"
          current-page="initial-setup" 
          @preferences-saved="handlePreferencesSaved"
        />
      </div>
    </div>

    <Prompt 
      v-if="homeState == 'prompt'"
      v-model:home-state="homeState"
      v-model:recommended-shows="recommendedShows"
      :current-user-id="props.currentUserId"
      :supabase="props.supabase"
      :catalogs="props.catalogs"
      :genres="props.userGenres"
    />

    <Recommendations 
      v-else-if="homeState == 'recommendations'"
      v-model:home-state="homeState"
      :recommendedShows="recommendedShows"
      :current-user-id="props.currentUserId"
      :supabase="props.supabase"
      :catalogs="props.catalogs"
    />


  </section>
</template>

<script setup>
import { ref } from 'vue';
import { SupabaseClient } from '@supabase/supabase-js';

import Prompt from './Prompt.vue';
import Recommendations from './Recommendations.vue';
import AccountPreferences from '../components/AccountPreferences.vue';
import Watchlist from './Watchlist.vue';
 

const homeState = ref('prompt');
const recommendedShows = ref(null);
const showPreferencesModal = defineModel('showPreferencesModal');

const props = defineProps({
  supabase: SupabaseClient,
  currentUserId: String,
  catalogs: Array,
  genres: Array,
});

function handlePreferencesSaved() {
  showPreferencesModal.value = false;     
}
</script>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}

.modal-content {
  background-color: #2d3748;
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow-y: auto;
}
</style>
