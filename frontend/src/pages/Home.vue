<template>
  <section class="home">
    <Prompt 
      v-if="homeState == 'prompt'"
      v-model:home-state="homeState"
      v-model:reccomended-shows="reccomendedShows"
      :current-user-id="props.currentUserId"
      :supabase="props.supabase"
      :catalogs="props.catalogs"
      :genres="props.userGenres"
    />

    <Reccomendations 
      v-else-if="homeState == 'reccomendations'"
      v-model:home-state="homeState"
      :reccomendedShows="reccomendedShows"
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
import Reccomendations from './Reccomendations.vue';
 
// can be 'prompt' or 'reccomendations'
const homeState = ref('prompt');
const reccomendedShows = ref(null);

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

