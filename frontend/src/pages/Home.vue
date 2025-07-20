<template>
  <section class="home">
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
 

const homeState = ref('prompt');
const recommendedShows = ref(null);

const props = defineProps({
  supabase: SupabaseClient,
  currentUserId: String,
  catalogs: Array,
  genres: Array
});
</script>

<style scoped>
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
