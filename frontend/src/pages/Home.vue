<template>
  <section class="home">
    <div class="home-header">
      <img src="../assets/images/moodstreamlogo/moodstream_logo.png" alt="Moodstream Logo" class="header-logo"/>
      <p>Discover movies or shows that match your mood.</p>
    </div>
    <div class="home-mood-container">
      <h2>How are you feeling?</h2>
      <div class="input-container">
        <input 
          :class="{'disabled-input': emojisOrPrompt == 'emojis' }"
          type="text" v-model="moodTranscript" placeholder="I'm feeling..." 
        />
      </div>
      <div class="emoji-container">
        <span 
          v-for="emoji in emojis" :key="emoji" @click="selectEmoji(emoji)"
          :class="{
            'disabled-emoji': emojisOrPrompt == 'prompt', 
            'emoji':  emojisOrPrompt != 'prompt',
            'emoji-selected': mood.includes(emoji.name)
          }"
        >
          <img 
            :src="getImageUrl(emoji.fileName)" :alt="emoji.name" 
          />
        </span>
      </div>
      <div class="submit-button">
        <button @click="getRecommendations">Get Recommendations</button>
      </div>

    </div>
  </section>

  <!-- <AccountPreferences 
    :current-user-id="currentUserId"
    :current-page="currentPage"
    :supabase="props.supabase"
  
  /> -->


</template>

<script setup>
import { ref, watch } from 'vue';
import { getShowsWithGenres, getShowsWithPrompt } from '../serverCaller.js'
import AccountPreferences from '@/components/AccountPreferences.vue';
import { SupabaseClient } from '@supabase/supabase-js';


const currentPage = defineModel();
const emojisOrPrompt = ref('either');
const mood = ref([]);
const autoPrompt = ref([]);
const moodTranscript = ref('');

const props = defineProps({
  supabase: {
    type: SupabaseClient
  },
  currentUserId: {
    type: String,
  }
});

const emojis = ref([
  { name: 'happy', fileName: 'happy.png' },
  { name: 'sad', fileName: 'sad.png' },
  { name: 'tired', fileName: 'tired.png' },
  { name: 'love', fileName: 'love.png' },
  { name: 'neutral', fileName: 'neutral.png' }
]);

const emojiGenres = {
  happy: ['comedy', 'animation', 'family'],
  sad: ['drama', 'crime', 'reality', 'horror'],
  tired: ['documentary', 'history', 'family'],
  love: ['romance'],
  neutral: ['action', 'adventure', 'fantasy', 'mystery', 'thriller', 'science fiction', 'comedy']
};


watch(moodTranscript, (newTranscript, oldTranscript) => {
  console.log('emojiesorprompt:', emojisOrPrompt.value);

  if (newTranscript != '') {
    emojisOrPrompt.value = 'prompt'
    console.log('new emojisOrPrompt: prompt');
  } else {
    emojisOrPrompt.value = 'either'
  }
})


function selectEmoji(emoji) {
  if (emojisOrPrompt.value == 'prompt') {
    console.log('invalid click');
  } else if (mood.value.includes(emoji.name)) {
    mood.value = mood.value.filter(item => item !== emoji.name);
    console.log('Mood removed, new mood:', mood.value);
    if (mood.value.length == 0) {
      emojisOrPrompt.value = 'either';
    }
  } else {
    mood.value.push(emoji.name);
    autoPrompt.value.push(emojiGenres[emoji.name]);
    emojisOrPrompt.value = 'emojis';
    console.log('Mood added, new mood:', mood.value);
  }
}

function getImageUrl(fileName) {
  return new URL(`../assets/images/${fileName}`, import.meta.url).href;
}

async function getRecommendations() {
  const showss = await getShowsWithPrompt(moodTranscript.value, ['netflix', 'disney', 'prime']);
  console.log(showss);
}
</script>

<style scoped>
/* Scoped styles ensure these only apply to the Home.vue component */
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.home-header {
  text-align: center;
  /*margin-bottom: 3rem;*/
  padding: 2.5rem;
  background-color: #2d3748; /* Dark card background */
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Style for the logo image */
.header-logo {
  display: block; /* This is necessary for margin:auto to work */
  margin-left: auto;
  margin-right: auto;
  max-width: 400px; /* Control the size of the logo */
  width: 100%;
  height: auto;
  margin-bottom: 1rem;
}

.home-header p {
  font-size: 1.25rem;
  color: #a0aec0;
  margin-top: 0.5rem;
}

/* --- Mood Selection Area --- */
.home-mood-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.home-mood-container h2 {
  font-size: 1.75rem;
  /*color: #34495e;*/
  margin-bottom: 1.5rem;
}



.input-container input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid #dfe4ea;
  border-radius: 8px;
  box-sizing: border-box;
  /* Important for padding */
  transition: border-color 0.3s;
}

.input-container input:focus {
  outline: none;
  border-color: #735CD1;;
}

.disabled-input {
  pointer-events: none;
}


.emoji-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.emoji img {
  height: 60px;
  /* Slightly larger */
  cursor: pointer;
}

.emoji-selected {
  transform: scale(1.2);
  transition: transform 0.1s ease-in-out;
}

.disabled-emoji img {
  filter: grayscale(80%);
  transition: none;
  height: 60px;
}

.disabled-emoji img:hover {
  transform: none;
}

.disabled-emoji:hover {
  transform: none;
}

.submit-button {
  margin-top: 2.5rem;
}

.submit-button button {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background-color: #735CD1; /* Purple accent */
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button button:hover {
  background-color: #624FAD; /* Darker purple */
}

.gradient-title {
  /* Define the gradient from left (to right) with two purple shades */
  background: linear-gradient(to right, #735CD1, #d1c4f8);

  /* Clip the background to the shape of the text */
  -webkit-background-clip: text;
  background-clip: text;

  /* Make the text color transparent so the background gradient is visible */
  color: transparent;
}
/* .home-mood-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.home-mood-container h2 {
  font-size: 1.75rem;
  color: #cbd5e0;
  margin-bottom: 1.5rem;
}

.input-container input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  background-color: #1a202c;
  border: 2px solid #4a5568;
  color: #e2e8f0;
  border-radius: 8px;
  box-sizing: border-box;
  transition: border-color 0.3s;
}

.input-container input:focus {
  outline: none;
  border-color: #42b983;
}

.disabled-input {
  pointer-events: none;
  opacity: 0.5;
}

.emoji-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.emoji img {
  height: 60px;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.emoji:hover img {
  transform: scale(1.1);
}

.emoji-selected img {
  transform: scale(1.2);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(66, 185, 131, 0.7);
}

.disabled-emoji img {
  filter: grayscale(80%) opacity(50%);
  cursor: not-allowed;
}

.disabled-emoji:hover img {
  transform: none;
}

.submit-button {
  margin-top: 2.5rem;
}

.submit-button button {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background-color: #42b983;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button button:hover {
  background-color: #3aa873;
} */
</style>


<!-- <style scoped>
/* Scoped styles ensure these only apply to the Home.vue component  LIGHT THEME */
.home {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.home-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2.5rem;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.home-header h1 {
  font-size: 3rem;
  font-weight: 700;
  color: #2c3e50;
  /* Match navbar color */
  margin: 0;
}

.home-header p {
  font-size: 1.25rem;
  color: #7f8c8d;
  margin-top: 0.5rem;
}


/* --- Mood Selection Area --- */
.home-mood-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.home-mood-container h2 {
  font-size: 1.75rem;
  color: #34495e;
  margin-bottom: 1.5rem;
}

.input-container input {
  width: 100%;
  padding: 1rem;
  font-size: 1.1rem;
  border: 2px solid #dfe4ea;
  border-radius: 8px;
  box-sizing: border-box;
  /* Important for padding */
  transition: border-color 0.3s;
}

.input-container input:focus {
  outline: none;
  border-color: #42b983;
}

.disabled-input {
  pointer-events: none;
}


.emoji-container {
  margin-top: 2rem;
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  flex-wrap: wrap;
}

.emoji img {
  height: 60px;
  /* Slightly larger */
  cursor: pointer;
}

.emoji-selected {
  transform: scale(1.2);
  transition: transform 0.1s ease-in-out;
}

.disabled-emoji img {
  filter: grayscale(80%);
  transition: none;
  height: 60px;
}

.disabled-emoji img:hover {
  transform: none;
}

.disabled-emoji:hover {
  transform: none;
}

.submit-button {
  margin-top: 2.5rem;
}

.submit-button button {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  font-weight: bold;
  color: white;
  background-color: #42b983;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.submit-button button:hover {
  background-color: #3aa873;
}
</style> -->
