<template>
  <h1>Your Generated Reccomendedations</h1>
  <img src="https://i.imgflip.com/11fjj7.jpg">
  <button @click="homeState = 'prompt'">Restart Reccomendations</button>
  <code> {{ reccomendedShows }} </code>
</template>

<script setup>
import { ref } from 'vue';
import { SupabaseClient } from '@supabase/supabase-js';

 
const homeState = defineModel('home-state');


const props = defineProps({
  supabase: SupabaseClient,
  currentUserId: String,
  catalogs: Array,
  reccomendedShows: Array
});

</script>

<style scoped>

</style>

