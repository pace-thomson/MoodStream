<template>
    <section class="page-container">
      <div class="page-header">
        <h2 class="page-title">Your Mood History</h2>
      </div>
  
      <div v-if="isLoading" class="loading-container">
        <p>Loading your history...</p>
      </div>
  
      <div v-else-if="moodHistory.length > 0" class="history-list">
        <div v-for="entry in moodHistory" :key="entry.created_at" class="history-entry">
          <div class="entry-header">
            <span class="entry-date">{{ formatDate(entry.created_at) }}</span>
          </div>
          <div class="entry-body">
            <p v-if="entry.transcript" class="entry-transcript">"{{ entry.transcript }}"</p>
            <div v-if="entry.moods && entry.moods.length > 0" class="entry-moods">
              <span v-for="mood in entry.moods" :key="mood" class="mood-tag">{{ mood }}</span>
            </div>
          </div>
        </div>
      </div>
  
      <div v-else class="empty-state">
        <p>You have no mood history yet.</p>
        <p>Once you get recommendations, your mood will be saved here.</p>
      </div>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { SupabaseClient } from '@supabase/supabase-js';
  import { getUserMoodHistory } from '../supabase.js';
  
  // --- Component State ---
  const isLoading = ref(true);
  const moodHistory = ref([]);
  
  // --- Props ---
  const props = defineProps({
    supabase: { type: SupabaseClient, required: true },
    currentUserId: { type: String, required: true }
  });
  
  // --- Lifecycle Hook ---
  onMounted(async () => {
    try {
      moodHistory.value = await getUserMoodHistory(props.supabase, props.currentUserId);
    } catch (error) {
      console.error("Failed to fetch mood history:", error);
    } finally {
      isLoading.value = false;
    }
  });
  
  // --- Helper Functions ---
  function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  }
  </script>
  
  <style scoped>
  .page-container {
    padding: 2rem;
    max-width: 900px;
    margin: 0 auto;
    background-color: #1a202c;
  }
  
  .page-header {
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
  
  .loading-container, .empty-state {
    text-align: center;
    padding: 4rem 0;
    color: #a0aec0;
  }
  
  .empty-state p {
    margin: 0.5rem;
    font-size: 1.1rem;
  }
  
  .history-list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .history-entry {
    background-color: #2d3748;
    border-radius: 8px;
    box-shadow: 0 4px 6px rgba(0,0,0,0.2);
    overflow: hidden;
  }
  
  .entry-header {
    background-color: #4a5568;
    padding: 0.75rem 1.5rem;
  }
  
  .entry-date {
    font-weight: 600;
    color: #e2e8f0;
    font-size: 0.9rem;
  }
  
  .entry-body {
    padding: 1.5rem;
  }
  
  .entry-transcript {
    font-style: italic;
    color: #cbd5e0;
    font-size: 1.1rem;
    margin: 0 0 1rem 0;
  }
  
  .entry-moods {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
  
  .mood-tag {
    background-color: #735CD1;
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 16px;
    font-size: 0.9rem;
    text-transform: capitalize;
  }
  </style>